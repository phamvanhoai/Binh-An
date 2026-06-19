import { apiOptions, apiResponse } from "@/lib/api-v1";
import { getApiSettings, getSiteSettings } from "@/lib/site-settings";

export function OPTIONS() {
  return apiOptions();
}

export async function GET() {
  const [settings, apiSettings] = await Promise.all([getSiteSettings(), getApiSettings()]);
  return apiResponse({
    api_enabled: apiSettings.enabled,
    api_maintenance: apiSettings.maintenance,
    api_maintenance_message: apiSettings.maintenance ? apiSettings.maintenanceMessage : "",
    rate_limit_per_minute: apiSettings.rateLimitPerMinute,
    registration_enabled: settings.allowRegistration,
    public_community_enabled: settings.publicCommunityEnabled,
    community_page_size: settings.communityPageSize,
    support_email: settings.supportEmail
  });
}
