"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const supabase = createClient();
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="soft-panel mx-auto grid w-full max-w-md gap-4 rounded-lg p-6">
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Email
        <input
          name="email"
          type="email"
          required
          className="rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Mat khau
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-night px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Dang xu ly..." : mode === "login" ? "Dang nhap" : "Dang ky"}
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
