import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import type { User } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-version",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

export function apiResponse<T>(
  data: T,
  options: { status?: number; meta?: Record<string, unknown> } = {}
) {
  return Response.json(
    {
      success: true,
      data,
      ...(options.meta ? { meta: options.meta } : {}),
      request_id: randomUUID()
    },
    { status: options.status || 200, headers: corsHeaders }
  );
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  return Response.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {})
      },
      request_id: randomUUID()
    },
    { status, headers: corsHeaders }
  );
}

export function apiOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7).trim() || null;
}

export function createAppClient(accessToken?: string | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      global: accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined
    }
  );
}

type AppAuthSuccess = {
  token: string;
  user: User;
  supabase: ReturnType<typeof createAppClient>;
};

export async function requireAppAuth(
  request: Request
): Promise<AppAuthSuccess | { response: Response }> {
  const token = getBearerToken(request);
  if (!token) {
    return {
      response: apiError(
        "AUTH_TOKEN_MISSING",
        "Authorization Bearer token is required.",
        401
      )
    };
  }

  const supabase = createAppClient(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return {
      response: apiError(
        "AUTH_TOKEN_INVALID",
        "Access token is invalid or expired.",
        401
      )
    };
  }

  return { token, user: data.user, supabase };
}
