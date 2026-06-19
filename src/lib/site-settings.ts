import "server-only";
import { dbQuery } from "@/lib/db";

export type SiteSettings = {
  allowRegistration: boolean;
  publicCommunityEnabled: boolean;
  moderateNewPrayers: boolean;
  communityPageSize: number;
  supportEmail: string;
};

export const defaultSiteSettings: SiteSettings = {
  allowRegistration: true,
  publicCommunityEnabled: true,
  moderateNewPrayers: false,
  communityPageSize: 8,
  supportEmail: ""
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
