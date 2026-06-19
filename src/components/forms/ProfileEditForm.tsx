"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Save, Upload, UserRound } from "lucide-react";

type ProfileEditFormProps = {
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
};

export function ProfileEditForm({ email, displayName, bio, avatarUrl }: ProfileEditFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState(avatarUrl);
  const [storedAvatarUrl, setStoredAvatarUrl] = useState(avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function onAvatarChange(file?: File) {
    setMessage(null);
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ảnh đại diện không được vượt quá 5MB.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = URL.createObjectURL(file);
    setAvatarFile(file);
    setPreviewUrl(objectUrlRef.current);
  }

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    let nextAvatarUrl = storedAvatarUrl;

    if (avatarFile) {
      const uploadData = new FormData();
      uploadData.set("avatar", avatarFile);

      const uploadResponse = await fetch("/api/profile", {
        method: "POST",
        body: uploadData
      });
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setLoading(false);
        setMessage(uploadResult.error || "Không thể tải ảnh đại diện lên.");
        return;
      }

      nextAvatarUrl = uploadResult.data.avatar_url;
      setStoredAvatarUrl(nextAvatarUrl);
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: String(formData.get("display_name") || ""),
        bio: String(formData.get("bio") || ""),
        avatar_url: nextAvatarUrl
      })
    });
    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setMessage(result.error || "Không thể cập nhật hồ sơ.");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span
            className="relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border border-amber-200/30 bg-[radial-gradient(circle_at_40%_30%,#f8d7a1,#9a5d34_58%,#172033)] bg-cover bg-center shadow-[0_0_45px_rgba(251,191,36,0.18)]"
            style={previewUrl ? { backgroundImage: `url("${previewUrl}")` } : undefined}
          >
            {!previewUrl ? <UserRound size={52} className="text-amber-50" aria-hidden="true" /> : null}
            <span className="absolute inset-x-0 bottom-0 grid h-9 place-items-center bg-black/55 text-white">
              <Camera size={17} aria-hidden="true" />
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-white">Ảnh đại diện</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Chọn ảnh JPG, PNG hoặc WebP. Dung lượng tối đa 5MB.</p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/15">
              <Upload size={18} aria-hidden="true" />
              {avatarFile ? "Chọn ảnh khác" : "Tải ảnh lên"}
              <input
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => onAvatarChange(event.target.files?.[0])}
                className="sr-only"
              />
            </label>
            {avatarFile ? <p className="mt-3 truncate text-xs text-slate-400">{avatarFile.name}</p> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.055] p-5 sm:p-7">
        <label className="grid gap-2 text-sm font-medium text-white">
          Tên hiển thị
          <input
            name="display_name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            defaultValue={displayName}
            className="rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-white">
          Email
          <input type="email" value={email} readOnly className="cursor-not-allowed rounded-xl border border-white/10 bg-[#101827]/60 px-4 py-3 text-slate-500 outline-none" />
          <span className="text-xs font-normal text-slate-500">Email không thể đổi tại đây vì cần xác minh lại tài khoản.</span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-white">
          Giới thiệu
          <textarea
            name="bio"
            rows={5}
            maxLength={500}
            defaultValue={bio}
            className="resize-none rounded-xl border border-white/10 bg-[#101827] px-4 py-3 leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
            placeholder="Chia sẻ đôi điều về hành trình bình an của bạn..."
          />
        </label>

        {message ? <p className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/profile" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/6 px-5 py-3 font-semibold text-slate-200 hover:bg-white/10">
            <ArrowLeft size={18} aria-hidden="true" />
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-5 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(251,191,36,0.18)] transition hover:brightness-110 disabled:opacity-60"
          >
            <Save size={18} aria-hidden="true" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </section>
    </form>
  );
}
