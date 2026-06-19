import "server-only";
import { dbQuery } from "@/lib/db";

export type SiteSettings = {
  allowRegistration: boolean;
  publicCommunityEnabled: boolean;
  moderateNewPrayers: boolean;
  communityPageSize: number;
  supportEmail: string;
};

export type ApiSettings = {
  enabled: boolean;
  maintenance: boolean;
  maintenanceMessage: string;
  allowedOrigins: string[];
  rateLimitPerMinute: number;
};

export const defaultSiteSettings: SiteSettings = {
  allowRegistration: true,
  publicCommunityEnabled: true,
  moderateNewPrayers: false,
  communityPageSize: 8,
  supportEmail: ""
};

export const defaultApiSettings: ApiSettings = {
  enabled: true,
  maintenance: false,
  maintenanceMessage: "API đang bảo trì. Vui lòng thử lại sau.",
  allowedOrigins: ["*"],
  rateLimitPerMinute: 120
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await dbQuery<{
      allow_registration: boolean;
      public_community_enabled: boolean;
      moderate_new_prayers: boolean;
      community_page_size: number;
      support_email: string | null;
    }>(`
      select allow_registration, public_community_enabled, moderate_new_prayers,
        community_page_size, support_email
      from public.site_settings
      where id = true
      limit 1
    `);
    const row = result.rows[0];
    if (!row) return defaultSiteSettings;

    return {
      allowRegistration: row.allow_registration,
      publicCommunityEnabled: row.public_community_enabled,
      moderateNewPrayers: row.moderate_new_prayers,
      communityPageSize: row.community_page_size,
      supportEmail: row.support_email || ""
    };
  } catch {
    return defaultSiteSettings;
  }
}

export async function getApiSettings(): Promise<ApiSettings> {
  try {
    const result = await dbQuery<{
      api_enabled: boolean;
      api_maintenance: boolean;
      api_maintenance_message: string | null;
      api_allowed_origins: string[];
      api_rate_limit_per_minute: number;
    }>(`
      select api_enabled, api_maintenance, api_maintenance_message,
        api_allowed_origins, api_rate_limit_per_minute
      from public.site_settings
      where id = true
      limit 1
    `);
    const row = result.rows[0];
    if (!row) return defaultApiSettings;

    return {
      enabled: row.api_enabled,
      maintenance: row.api_maintenance,
      maintenanceMessage: row.api_maintenance_message || defaultApiSettings.maintenanceMessage,
      allowedOrigins: row.api_allowed_origins?.length ? row.api_allowed_origins : ["*"],
      rateLimitPerMinute: row.api_rate_limit_per_minute
    };
  } catch {
    return defaultApiSettings;
  }
}
