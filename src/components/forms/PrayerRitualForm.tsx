"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Flame, Flower2, Send, Sparkles, Waves, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

type Ritual = "lantern" | "candle" | "incense";

type PrayerResponse = {
  success: boolean;
  error?: string;
};

const rituals: Array<{
  id: Ritual;
  label: string;
  description: string;
  readyText: string;
  activeText: string;
  icon: typeof Flame;
}> = [
  {
    id: "lantern",
    label: "Thả hoa đăng",
    description: "Hoa đăng nằm yên bên bờ. Khi gửi lời nguyện, ánh sáng sẽ trôi ra mặt nước.",
    readyText: "Hoa đăng đang chờ được thả.",
    activeText: "Hoa đăng đang trôi.",
    icon: Flower2
  },
  {
    id: "candle",
    label: "Thắp nến",
    description: "Ngọn nến còn tắt. Khi gửi lời nguyện, lửa sẽ bừng lên và giữ lời nguyện ở lại.",
    readyText: "Ngọn nến đang chờ được thắp.",
    activeText: "Ngọn nến đang sáng.",
    icon: Flame
  },
  {
    id: "incense",
    label: "Thắp hương",
    description: "Nén hương còn lặng. Khi gửi lời nguyện, khói sẽ bắt đầu bay lên.",
    readyText: "Nén hương đang chờ được thắp.",
    activeText: "Khói hương đang bay lên.",
    icon: Wind
  }
];

export function PrayerRitualForm() {
  const [ritual, setRitual] = useState<Ritual>("lantern");
  const [activeRitual, setActiveRitual] = useState<Ritual | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [effectKey, setEffectKey] = useState(0);

  const selectedRitual = useMemo(() => rituals.find((item) => item.id === ritual) || rituals[0], [ritual]);
  const isActive = activeRitual === ritual;

  function selectRitual(nextRitual: Ritual) {
    setRitual(nextRitual);
    setActiveRitual(null);
    setMessage(null);
  }

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    setActiveRitual(null);

    const payload = {
      content: String(formData.get("content") || ""),
      type: String(formData.get("type") || "peace"),
      visibility: String(formData.get("visibility") || "public_anonymous"),
      allow_reactions: true
    };

    const response = await fetch("/api/prayers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = (await response.json()) as PrayerResponse;

    setLoading(false);
    if (!json.success) {
      setMessage(json.error || "Có lỗi xảy ra.");
      return;
    }

    setActiveRitual(ritual);
    setEffectKey((value) => value + 1);
    setMessage(
      ritual === "lantern"
        ? "Hoa đăng đã được thả."
        : ritual === "candle"
          ? "Ngọn nến đã được thắp."
          : "Nén hương đã được thắp."
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <form action={onSubmit} className="soft-panel grid gap-4 rounded-lg p-5">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Nội dung
          <textarea
            name="content"
            required
            placeholder="Viết một điều bạn muốn gửi đi..."
            className="min-h-36 rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Loại
            <select
              name="type"
              className="rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
            >
              <option value="peace">Cầu bình an</option>
              <option value="wish">Mong ước</option>
              <option value="gratitude">Biết ơn</option>
              <option value="memorial">Tưởng nhớ</option>
              <option value="worry">Lo lắng</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Trạng thái
            <select
              name="visibility"
              className="rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
            >
              <option value="public_anonymous">Công khai ẩn danh</option>
              <option value="private">Riêng tư</option>
            </select>
          </label>
        </div>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold text-slate-700">Nghi thức gửi đi</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {rituals.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectRitual(item.id)}
                className={cn(
                  "grid min-h-28 place-items-center gap-2 rounded border px-3 py-4 text-center transition",
                  ritual === item.id
                    ? "border-night bg-night text-white shadow-glow"
                    : "border-slate-300 bg-white text-slate-700 hover:border-night"
                )}
              >
                <item.icon size={24} aria-hidden="true" />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded bg-night px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={17} aria-hidden="true" />
          {loading ? "Đang gửi..." : "Gửi lời nguyện"}
        </button>

        {message ? <p className="text-sm font-medium text-slate-600">{message}</p> : null}
      </form>

      <div className="soft-panel overflow-hidden rounded-lg">
        <div className="relative min-h-[30rem] bg-night text-white">
          <div
            className={cn(
              "absolute inset-0 transition duration-700",
              isActive
                ? "bg-[radial-gradient(circle_at_50%_18%,rgba(251,191,36,0.24),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(3,7,18,0.7)_100%)]"
                : "bg-[radial-gradient(circle_at_50%_18%,rgba(148,163,184,0.12),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(3,7,18,0.82)_100%)]"
            )}
          />
          <RitualScene ritual={ritual} isActive={isActive} effectKey={effectKey} />
          <div className="absolute left-5 right-5 top-5">
            <span className="inline-flex items-center gap-2 rounded bg-white/10 px-3 py-1 text-sm font-semibold text-mint">
              <Sparkles size={15} aria-hidden="true" />
              {selectedRitual.label}
            </span>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-200">{selectedRitual.description}</p>
          </div>
          <p className="absolute bottom-5 left-5 right-5 rounded bg-white/10 px-4 py-3 text-sm font-medium text-slate-100">
            {isActive ? selectedRitual.activeText : selectedRitual.readyText}
          </p>
        </div>
      </div>
    </div>
  );
}

function RitualScene({
  ritual,
  isActive,
  effectKey
}: {
  ritual: Ritual;
  isActive: boolean;
  effectKey: number;
}) {
  if (ritual === "candle") {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className={cn("ritual-photo candle-photo", isActive && "candle-photo-lit ritual-pulse")} key={`candle-${effectKey}-${isActive}`}>
          <Image src="/assets/rituals/candle.png" width={1000} height={1000} alt="Ngọn nến" priority />
          <span className="photo-candle-glow" />
          <span className="photo-candle-flame" />
        </div>
      </div>
    );
  }

  if (ritual === "incense") {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className={cn("ritual-photo incense-photo", isActive && "incense-active")} key={`incense-${effectKey}-${isActive}`}>
          <Image src="/assets/rituals/incense.png" width={1000} height={1000} alt="Nén hương" priority />
          <span className="photo-incense-ember" />
          <span className="photo-smoke photo-smoke-one" />
          <span className="photo-smoke photo-smoke-two" />
          <span className="photo-smoke photo-smoke-three" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" key={`lantern-${effectKey}-${isActive}`}>
      <Waves className="absolute bottom-24 left-8 text-mint/35" size={130} aria-hidden="true" />
      <div className={cn("lantern-water", isActive && "lantern-water-active")} />
      <div className={cn("ritual-photo lantern-photo lantern-photo-one", isActive && "lantern-released")}>
        <Image src="/assets/rituals/lantern.png" width={1200} height={800} alt="Hoa đăng" priority />
        <span className="photo-lantern-light" />
      </div>
      <div className={cn("ritual-photo lantern-photo lantern-photo-two", isActive && "lantern-released")}>
        <Image src="/assets/rituals/lantern.png" width={1200} height={800} alt="" aria-hidden="true" />
        <span className="photo-lantern-light" />
      </div>
      <div className={cn("ritual-photo lantern-photo lantern-photo-three", isActive && "lantern-released")}>
        <Image src="/assets/rituals/lantern.png" width={1200} height={800} alt="" aria-hidden="true" />
        <span className="photo-lantern-light" />
      </div>
    </div>
  );
}
