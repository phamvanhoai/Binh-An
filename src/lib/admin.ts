import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dbQuery } from "@/lib/db";
import { fail } from "@/lib/utils";

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

async function isAdmin(userId: string) {
  const result = await dbQuery<{ exists: boolean }>(
    "select exists(select 1 from public.admin_users where user_id = $1) as exists",
    [userId]
  );
  return result.rows[0]?.exists === true;
}

export async function requireAdminPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/admin");
  if (!(await isAdmin(user.id))) redirect("/profile");
  return user;
}

export async function getAdminOrError() {
  const user = await currentUser();
  if (!user) return { response: fail("Authentication required.", 401) };
  if (!(await isAdmin(user.id))) return { response: fail("Admin permission required.", 403) };
  return { user };
}
