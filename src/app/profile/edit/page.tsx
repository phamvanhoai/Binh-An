import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { ProfileEditForm } from "@/components/forms/ProfileEditForm";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

async function getEditableProfile() {
  if (!hasSupabaseEnv()) redirect("/login?next=/profile/edit");

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/profile/edit");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name,bio,avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: user.email || "",
    displayName: profile?.display_name || user.user_metadata?.name || user.email?.split("@")[0] || "",
    bio: profile?.bio || "",
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || ""
  };
}

export default async function ProfileEditPage() {
  const profile = await getEditableProfile();

  return (
    <div className="ritual-dashboard min-h-screen overflow-x-hidden bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/profile" variant="prayers" />
      <main className="dashboard-main">
        <header className="dashboard-frame">
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Chỉnh sửa hồ sơ</h1>
          <p className="mt-2 text-sm text-slate-400">Cập nhật thông tin mà mọi người nhìn thấy trong hành trình Bình An.</p>
        </header>
        <div className="dashboard-frame mt-6">
          <div className="max-w-4xl">
            <ProfileEditForm {...profile} />
          </div>
        </div>
      </main>
    </div>
  );
}
