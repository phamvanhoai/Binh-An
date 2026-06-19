import { NextResponse, type NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { defaultApiSettings } from "@/lib/site-settings";

type ProxyApiSettings = {
  api_enabled: boolean;
  api_maintenance: boolean;
  api_maintenance_message: string;
  api_allowed_origins: string[];
  api_rate_limit_per_minute: number;
};

const corsBase = {
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-version",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

function jsonError(
  code: string,
  message: string,
  status: number,
  corsOrigin?: string
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
      request_id: crypto.randomUUID()
    },
    {
      status,
      headers: {
        ...corsBase,
        ...(corsOrigin ? { "Access-Control-Allow-Origin": corsOrigin } : {})
      }
    }
  );
}

async function loadApiSettings(): Promise<ProxyApiSettings> {
  try {
    const result = await dbQuery<ProxyApiSettings>(`
      select api_enabled, api_maintenance, api_maintenance_message,
        api_allowed_origins, api_rate_limit_per_minute
      from public.site_settings
      where id = true
      limit 1
    `);
    if (result.rows[0]) return result.rows[0];
  } catch {
    // Fall back to safe defaults while database migrations are being applied.
  }

  return {
    api_enabled: defaultApiSettings.enabled,
    api_maintenance: defaultApiSettings.maintenance,
    api_maintenance_message: defaultApiSettings.maintenanceMessage,
    api_allowed_origins: defaultApiSettings.allowedOrigins,
    api_rate_limit_per_minute: defaultApiSettings.rateLimitPerMinute
  };
}

export async function proxy(request: NextRequest) {
  const settings = await loadApiSettings();
  const origin = request.headers.get("origin");
  const allowAll = settings.api_allowed_origins.includes("*");
  const originAllowed = !origin || allowAll || settings.api_allowed_origins.includes(origin);
  const corsOrigin = origin ? (allowAll ? "*" : originAllowed ? origin : undefined) : allowAll ? "*" : undefined;

  if (!originAllowed) {
    return jsonError("CORS_ORIGIN_DENIED", "This origin is not allowed to access the API.", 403);
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...corsBase,
        ...(corsOrigin ? { "Access-Control-Allow-Origin": corsOrigin } : {})
      }
    });
  }

  const pathname = request.nextUrl.pathname;
  const isExempt = pathname === "/api/v1/config" || pathname === "/api/v1/openapi";

  if (!isExempt && !settings.api_enabled) {
    return jsonError("API_DISABLED", "The app API is currently disabled.", 503, corsOrigin);
  }
  if (!isExempt && settings.api_maintenance) {
    return jsonError(
      "API_MAINTENANCE",
      settings.api_maintenance_message,
      503,
      corsOrigin
    );
  }

  if (!isExempt) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const identifier = `v1:${ip}`;

    try {
      const result = await dbQuery<{ request_count: number }>(
        `insert into public.api_rate_limits (identifier, window_start, request_count)
         values ($1, date_trunc('minute', now()), 1)
         on conflict (identifier, window_start)
         do update set request_count = public.api_rate_limits.request_count + 1
         returning request_count`,
        [identifier]
      );
      const count = result.rows[0]?.request_count || 1;
      if (count > settings.api_rate_limit_per_minute) {
        const response = jsonError(
          "RATE_LIMIT_EXCEEDED",
          "Too many requests. Please retry in one minute.",
          429,
          corsOrigin
        );
        response.headers.set("Retry-After", "60");
        return response;
      }

      if (Math.random() < 0.01) {
        void dbQuery("delete from public.api_rate_limits where window_start < now() - interval '1 day'");
      }
    } catch {
      // Do not take the API offline if rate-limit storage is temporarily unavailable.
    }
  }

  const response = NextResponse.next();
  Object.entries(corsBase).forEach(([key, value]) => response.headers.set(key, value));
  if (corsOrigin) response.headers.set("Access-Control-Allow-Origin", corsOrigin);
  response.headers.set("Vary", "Origin");
  return response;
}

export const config = {
  matcher: "/api/v1/:path*"
};
