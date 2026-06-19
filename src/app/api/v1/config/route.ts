import { apiOptions, apiResponse } from "@/lib/api-v1";
import { getSiteSettings } from "@/lib/site-settings";

export function OPTIONS() {
  return apiOptions();
}

export async function GET() {
  const settings = await getSiteSettings();
  return apiResponse({
    registration_enabled: settings.allowRegistration,
    public_community_enabled: settings.publicCommunityEnabled,
    community_page_size: settings.communityPageSize,
    support_email: settings.supportEmail
  });
}
