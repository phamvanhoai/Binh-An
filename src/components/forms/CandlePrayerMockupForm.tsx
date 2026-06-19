"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Flame, Lightbulb, Lock, Send, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type RitualMode = "candle" | "incense" | "lantern";

type PrayerResponse = {
  success: boolean;
  error?: string;
};

const ritualTabs = [
  { id: "candle" as const, label: "Thắp nến", text: "Gửi lời nguyện với ánh nến", image: "/assets/rituals/candle.png", imageClass: "w-9" },
  { id: "incense" as const, label: "Thắp hương", text: "Thành tâm tưởng nhớ", image: "/assets/rituals/incense.png", imageClass: "w-10" },
  { id: "lantern" as const, label: "Thả hoa đăng", text: "Ước nguyện bình an", image: "/assets/rituals/lantern.png", imageClass: "w-12" }
];

const ritualCopy = {
  candle: {
    step: "1. Chọn nến",
    action: "Thắp nến",
    loading: "Đang thắp...",
    success: "Ngọn nến đã được thắp.",
    quotePrefix: "Công khai"
  },
  incense: {
    step: "1. Chọn hương",
    action: "Thắp hương",
    loading: "Đang thắp...",
    success: "Nén hương đã được thắp.",
    quotePrefix: "Thành tâm"
  },
  lantern: {
    step: "1. Chọn hoa đăng",
    action: "Thả hoa đăng",
    loading: "Đang thả...",
    success: "Hoa đăng đã được thả.",
    quotePrefix: "Bình an"
  }
};

const options = {
  candle: [
    { name: "Nến sen vàng", note: "Bình an • May mắn", color: "from-amber-200 via-amber-400 to-orange-600", glow: "rgba(251,191,36,", flame: "from-amber-100 via-amber-300 to-orange-600", filter: "hue-rotate(0deg) saturate(1.05)" },
    { name: "Nến trắng", note: "Thanh tịnh • An nhiên", color: "from-white via-orange-100 to-amber-300", glow: "rgba(255,247,237,", flame: "from-white via-orange-100 to-amber-300", filter: "hue-rotate(-10deg) saturate(0.62) brightness(1.18)" },
    { name: "Nến hồng", note: "Yêu thương • Hạnh phúc", color: "from-rose-200 via-rose-400 to-orange-500", glow: "rgba(251,113,133,", flame: "from-rose-100 via-rose-300 to-orange-500", filter: "hue-rotate(-32deg) saturate(1.35) brightness(1.06)" },
    { name: "Nến xanh", note: "Hy vọng • Sức khỏe", color: "from-emerald-200 via-emerald-400 to-lime-500", glow: "rgba(52,211,153,", flame: "from-emerald-100 via-emerald-300 to-lime-500", filter: "hue-rotate(82deg) saturate(1.28) brightness(1.04)" },
    { name: "Nến tím", note: "Bình an • Tĩnh tâm", color: "from-violet-200 via-violet-500 to-purple-700", glow: "rgba(168,85,247,", flame: "from-violet-100 via-violet-400 to-purple-700", filter: "hue-rotate(-86deg) saturate(1.38) brightness(1.02)" }
  ],
  incense: [
    { name: "Trầm hương", note: "Tưởng nhớ • An yên", color: "from-orange-200 via-amber-600 to-stone-800", glow: "rgba(217,119,6,", flame: "from-orange-100 via-amber-300 to-orange-700", filter: "hue-rotate(0deg) saturate(1.04)" },
    { name: "Hương sen", note: "Thanh tịnh • Dịu nhẹ", color: "from-pink-100 via-rose-300 to-amber-500", glow: "rgba(244,114,182,", flame: "from-pink-100 via-rose-300 to-orange-500", filter: "hue-rotate(-18deg) saturate(1.18)" },
    { name: "Hương quế", note: "Ấm áp • Chở che", color: "from-red-200 via-orange-500 to-red-900", glow: "rgba(248,113,113,", flame: "from-red-100 via-orange-300 to-red-700", filter: "hue-rotate(-8deg) saturate(1.25)" },
    { name: "Hương lành", note: "Bình an • Sức khỏe", color: "from-emerald-100 via-teal-400 to-stone-700", glow: "rgba(45,212,191,", flame: "from-teal-100 via-emerald-300 to-amber-500", filter: "hue-rotate(65deg) saturate(1.08)" },
    { name: "Hương tím", note: "Tĩnh tâm • Sâu lắng", color: "from-violet-100 via-violet-500 to-stone-900", glow: "rgba(167,139,250,", flame: "from-violet-100 via-violet-300 to-orange-500", filter: "hue-rotate(-76deg) saturate(1.18)" }
  ],
  lantern: [
    { name: "Hoa đăng vàng", note: "May mắn • Bình an", color: "from-amber-200 via-yellow-400 to-orange-600", glow: "rgba(251,191,36,", flame: "from-amber-100 via-yellow-300 to-orange-600", filter: "hue-rotate(0deg) saturate(1.05)" },
    { name: "Hoa đăng trắng", note: "Thanh tịnh • An nhiên", color: "from-white via-orange-100 to-amber-300", glow: "rgba(255,247,237,", flame: "from-white via-orange-100 to-amber-400", filter: "hue-rotate(-10deg) saturate(0.68) brightness(1.18)" },
    { name: "Hoa đăng hồng", note: "Yêu thương • Hạnh phúc", color: "from-rose-200 via-pink-400 to-orange-500", glow: "rgba(244,114,182,", flame: "from-rose-100 via-pink-300 to-orange-500", filter: "hue-rotate(-28deg) saturate(1.34)" },
    { name: "Hoa đăng xanh", note: "Hy vọng • Chữa lành", color: "from-emerald-100 via-emerald-400 to-lime-500", glow: "rgba(52,211,153,", flame: "from-emerald-100 via-lime-300 to-amber-500", filter: "hue-rotate(82deg) saturate(1.24)" },
    { name: "Hoa đăng tím", note: "Tĩnh tâm • Biết ơn", color: "from-violet-100 via-violet-500 to-purple-700", glow: "rgba(168,85,247,", flame: "from-violet-100 via-violet-300 to-orange-500", filter: "hue-rotate(-86deg) saturate(1.3)" }
  ]
};

const chips = ["Mong ước", "Biết ơn", "Cầu nguyện", "Cho bản thân", "Cho gia đình", "Cho mọi người"];

export function CandlePrayerMockupForm({
  mode,
  onModeChange,
  onCreated
}: {
  mode: RitualMode;
  onModeChange: (mode: RitualMode) => void;
  onCreated?: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const [visibility, setVisibility] = useState<"public_anonymous" | "private">("public_anonymous");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [igniteKey, setIgniteKey] = useState(0);

  const modeOptions = options[mode];
  const selectedOption = modeOptions[selected] || modeOptions[0];
  const copy = ritualCopy[mode];
  const previewText = useMemo(
    () => content.trim() || "Bình an cho gia đình, mạnh khỏe và luôn hạnh phúc. Cảm ơn cuộc sống!",
    [content]
  );

  function changeMode(nextMode: RitualMode) {
    onModeChange(nextMode);
    setSelected(0);
    setIsActive(false);
    setMessage(null);
  }

  async function onSubmit() {
    setLoading(true);
    setMessage(null);
    setIsActive(false);

    const response = await fetch("/api/prayers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: previewText,
        type: mode === "incense" ? "memorial" : mode === "lantern" ? "wish" : "peace",
        visibility,
        allow_reactions: true
      })
    });
    const json = (await response.json()) as PrayerResponse;

    setLoading(false);
    if (!json.success) {
      setMessage(json.error || "Có lỗi xảy ra.");
      return;
    }

    setIsActive(true);
    setIgniteKey((value) => value + 1);
    setMessage(copy.success);
    setContent("");
    onCreated?.();
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] shadow-2xl shadow-black/25">
      <div className="grid overflow-hidden border-b border-white/10 bg-white/[0.035] md:grid-cols-3">
        {ritualTabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => changeMode(tab.id)}
            className={cn(
              "flex items-center gap-4 px-7 py-6 text-left transition",
              index > 0 && "md:border-l md:border-white/10",
              mode === tab.id ? "bg-white/8 shadow-[inset_0_-1px_0_rgba(251,191,36,0.7)]" : "hover:bg-white/5"
            )}
          >
            <span className="relative grid h-12 w-12 shrink-0 place-items-center">
              <span
                className={cn(
                  "absolute inset-1 rounded-full blur-xl transition",
                  mode === tab.id ? "bg-amber-300/35" : "bg-rose-300/15"
                )}
              />
              <Image
                src={tab.image}
                width={120}
                height={120}
                alt=""
                aria-hidden="true"
                className={cn("relative z-10 max-h-11 object-contain drop-shadow-[0_0_14px_rgba(251,191,36,0.45)]", tab.imageClass)}
              />
            </span>
            <span>
              <span className="block text-lg font-semibold text-white">{tab.label}</span>
              <span className="mt-1 block text-sm text-slate-400">{tab.text}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.42fr)_minmax(22rem,0.88fr)]">
        <div className="p-6">
          <h2 className="text-base font-semibold text-white">{copy.step}</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
            {modeOptions.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setSelected(index);
                  setIsActive(false);
                }}
                className={cn(
                  "ritual-option-card group min-h-48 overflow-hidden rounded-2xl border bg-[#101827] p-4 text-center transition",
                  selected === index
                    ? "ritual-option-card-active border-amber-400 shadow-[0_0_42px_rgba(251,191,36,0.22)]"
                    : "border-white/10 hover:border-amber-300/50"
                )}
              >
                <div className={cn("ritual-option-art relative mx-auto w-24", mode === "incense" ? "h-32" : "h-24")}>
                  <span className={cn("absolute inset-1 rounded-full bg-gradient-to-br blur-2xl opacity-45", item.color)} />
                  <span className="absolute inset-x-1 bottom-1 h-6 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.28),rgba(56,189,248,0.08)_45%,transparent_72%)] blur-sm" />
                  {mode === "incense" ? (
                    <>
                      <Image
                        src="/assets/rituals/incense.png"
                        width={1000}
                        height={1000}
                        alt=""
                        aria-hidden="true"
                        className="absolute left-1/2 top-[58%] z-10 w-[6.2rem] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)] transition duration-500 group-hover:scale-105"
                        style={{ filter: `${item.filter} sepia(0.26) brightness(0.78) contrast(1.14)` }}
                      />
                      <span
                        className="absolute left-1/2 top-[23%] z-20 h-3 w-3 -translate-x-1/2 rounded-full blur-[2px]"
                        style={{ backgroundColor: `${item.glow}0.95)`, boxShadow: `0 0 18px ${item.glow}0.8)` }}
                      />
                      <span className="ritual-option-smoke ritual-option-smoke-one" />
                      <span className="ritual-option-smoke ritual-option-smoke-two" />
                    </>
                  ) : (
                    <>
                      <Image
                        src="/assets/rituals/lantern.png"
                        width={1200}
                        height={800}
                        alt=""
                        aria-hidden="true"
                        className="absolute left-1/2 top-[56%] z-10 w-[6.35rem] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_16px_24px_rgba(0,0,0,0.46)] transition duration-500 group-hover:scale-105"
                        style={{ filter: item.filter }}
                      />
                      <span
                        className="absolute left-1/2 top-[42%] z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
                        style={{ backgroundColor: `${item.glow}0.46)` }}
                      />
                      <span
                        className={cn(
                          "absolute left-1/2 top-[37%] z-30 h-7 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[60%_40%_60%_40%] bg-gradient-to-b shadow-[0_0_18px_rgba(251,191,36,0.8)]",
                          item.flame
                        )}
                      />
                    </>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-xs text-slate-400">{item.note}</p>
              </button>
            ))}
          </div>

          <label className="mt-6 block">
            <span className="text-base font-semibold text-white">2. Viết lời nguyện</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value.slice(0, 500))}
              placeholder="Hãy viết điều bạn mong muốn, biết ơn hoặc gửi gắm..."
              className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>{content.length}/500</span>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-white/6 px-4 py-2 text-amber-200">
              <Lightbulb size={14} aria-hidden="true" />
              Gợi ý lời nguyện
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button key={chip} type="button" className="rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-xs text-slate-300">
                {chip}
              </button>
            ))}
          </div>

          <h2 className="mt-6 text-base font-semibold text-white">3. Chọn chế độ</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setVisibility("public_anonymous")}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition",
                visibility === "public_anonymous" ? "border-amber-400 bg-amber-300/8" : "border-white/10 bg-[#0b1220]"
              )}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-300/12 text-amber-200">
                <Flame size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-white">Công khai</span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">Mọi người có thể thấy và đồng nguyện</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition",
                visibility === "private" ? "border-amber-400 bg-amber-300/8" : "border-white/10 bg-[#0b1220]"
              )}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/6 text-slate-300">
                <UserRound size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-white">Ẩn danh</span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">Chỉ bạn và hệ thống biết lời nguyện này</span>
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-5 py-4 text-lg font-semibold text-white shadow-[0_20px_50px_rgba(251,191,36,0.22)] transition hover:brightness-110 disabled:opacity-60"
          >
            <Send size={19} aria-hidden="true" />
            {loading ? copy.loading : copy.action}
          </button>
          {message ? <p className="mt-3 text-sm font-medium text-amber-200">{message}</p> : null}
        </div>

        <div className="relative min-h-[43rem] overflow-hidden border-t border-white/10 bg-[#090f1c] lg:border-l lg:border-t-0">
          <CandlePreviewCanvas active={isActive} igniteKey={igniteKey} glow={selectedOption.glow} mode={mode} />
          <RitualPreviewObject mode={mode} isActive={isActive} selected={selectedOption} />

          <div className="absolute bottom-20 left-8 right-8 text-center">
            <p className="text-5xl leading-none text-amber-100/90">“</p>
            <p className="mx-auto mt-2 max-w-md text-xl leading-9 text-white">“{previewText}”</p>
            <p className="mt-7 inline-flex items-center gap-2 border-t border-amber-300/25 pt-4 text-sm text-amber-100">
              <Lock size={15} aria-hidden="true" />
              {visibility === "public_anonymous" ? copy.quotePrefix : "Ẩn danh"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RitualPreviewObject({
  mode,
  isActive,
  selected
}: {
  mode: RitualMode;
  isActive: boolean;
  selected: (typeof options)[RitualMode][number];
}) {
  if (mode === "incense") {
    return (
      <div className="absolute inset-x-0 top-14 flex justify-center">
        <div className="relative w-[16rem] transition duration-700" style={{ filter: isActive ? `drop-shadow(0 0 45px ${selected.glow}0.55))` : undefined }}>
          <Image src="/assets/rituals/incense.png" width={1000} height={1000} alt={selected.name} priority className="transition duration-500" style={{ filter: selected.filter }} />
          <span className="absolute left-1/2 top-[4.2%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition" style={{ backgroundColor: `${selected.glow}0.95)`, boxShadow: isActive ? `0 0 24px ${selected.glow}0.88)` : "none", opacity: isActive ? 1 : 0.25 }} />
          <span className={cn("photo-smoke photo-smoke-one", isActive && "animate-[photo-smoke-rise_4.2s_ease-in-out_infinite]")} />
          <span className={cn("photo-smoke photo-smoke-two", isActive && "animate-[photo-smoke-rise_4.2s_ease-in-out_infinite]")} />
          <span className={cn("photo-smoke photo-smoke-three", isActive && "animate-[photo-smoke-rise_4.2s_ease-in-out_infinite]")} />
        </div>
      </div>
    );
  }

  if (mode === "lantern") {
    return (
      <div className="absolute inset-x-0 top-20 flex justify-center">
        <div className="relative w-[21rem] transition duration-700" style={{ filter: isActive ? `drop-shadow(0 0 58px ${selected.glow}0.68))` : undefined }}>
          <Image src="/assets/rituals/lantern.png" width={1200} height={800} alt={selected.name} priority className="transition duration-500" style={{ filter: selected.filter }} />
          <span className="absolute left-1/2 top-[44%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition" style={{ backgroundColor: `${selected.glow}0.45)`, opacity: isActive ? 1 : 0.35 }} />
          <span className={cn("absolute left-1/2 top-[43%] h-12 w-8 -translate-x-1/2 -translate-y-1/2 rounded-[60%_40%_60%_40%] bg-gradient-to-b transition", selected.flame, isActive ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 top-16 flex justify-center">
      <div className="relative w-[15rem] transition duration-700" style={{ filter: isActive ? `drop-shadow(0 0 58px ${selected.glow}0.68))` : undefined }}>
        <Image src="/assets/rituals/candle.png" width={1000} height={1000} alt={selected.name} priority className="transition duration-500" style={{ filter: selected.filter }} />
        <span className="absolute left-1/2 top-[17%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition" style={{ backgroundColor: `${selected.glow}0.45)`, opacity: isActive ? 1 : 0.35 }} />
        <span className={cn("absolute left-[50.2%] top-[16.8%] h-10 w-6 -translate-x-1/2 -translate-y-1/2 rounded-[60%_40%_60%_40%] bg-gradient-to-b transition", selected.flame, isActive ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
      </div>
    </div>
  );
}

function CandlePreviewCanvas({
  active,
  igniteKey,
  glow,
  mode
}: {
  active: boolean;
  igniteKey: number;
  glow: string;
  mode: RitualMode;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const burstsRef = useRef<Array<{ x: number; y: number; r: number; life: number }>>([]);
  const lastKeyRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let animationId = 0;
    const sparks = Array.from({ length: mode === "incense" ? 44 : 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.12 + Math.random() * 0.45,
      size: 0.6 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2
    }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#070b16");
      sky.addColorStop(0.46, "#0c1424");
      sky.addColorStop(1, "#020617");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const waterY = height * 0.47;
      const water = ctx.createLinearGradient(0, waterY, 0, height);
      water.addColorStop(0, "#111827");
      water.addColorStop(0.42, "#08111f");
      water.addColorStop(1, "#020617");
      ctx.fillStyle = water;
      ctx.fillRect(0, waterY, width, height - waterY);

      for (let index = 0; index < 34; index += 1) {
        const y = waterY + ((index + 1) / 36) * (height - waterY);
        const x = width * (0.1 + Math.sin(time * 0.45 + index * 0.77) * 0.08);
        const lineW = width * (0.07 + Math.sin(time * 0.2 + index) * 0.035);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + lineW, y);
        ctx.strokeStyle = `${glow}${0.025 + (active ? 0.025 : 0.01) * Math.sin(time + index) ** 2})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      sparks.forEach((spark) => {
        spark.phase += 0.014;
        spark.y -= spark.speed * 0.00085;
        if (spark.y < 0.04) {
          spark.y = 0.78 + Math.random() * 0.15;
          spark.x = 0.18 + Math.random() * 0.64;
        }
        const alpha = (active ? 0.58 : 0.24) * (0.4 + Math.sin(spark.phase) * 0.4 + 0.4);
        ctx.beginPath();
        ctx.arc(spark.x * width, spark.y * height, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = `${glow}${alpha})`;
        ctx.shadowColor = `${glow}0.7)`;
        ctx.shadowBlur = active ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      burstsRef.current.forEach((burst) => {
        burst.r += mode === "lantern" ? 2.4 : 1.7;
        burst.life -= 0.012;
        ctx.beginPath();
        ctx.ellipse(burst.x * width, burst.y * height, burst.r, burst.r * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `${glow}${Math.max(0, burst.life) * 0.5})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });
      burstsRef.current = burstsRef.current.filter((burst) => burst.life > 0);

      const radialGlow = ctx.createRadialGradient(width * 0.5, height * 0.38, 0, width * 0.5, height * 0.38, width * 0.45);
      radialGlow.addColorStop(0, `${glow}${active ? 0.26 : 0.1})`);
      radialGlow.addColorStop(0.42, `${glow}${active ? 0.1 : 0.04})`);
      radialGlow.addColorStop(1, "transparent");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [active, glow, mode]);

  useEffect(() => {
    if (!active || igniteKey <= 0 || lastKeyRef.current === igniteKey) return;
    lastKeyRef.current = igniteKey;
    burstsRef.current.push({ x: 0.5, y: mode === "incense" ? 0.42 : 0.58, r: 8, life: 1 });
    burstsRef.current.push({ x: 0.5, y: mode === "incense" ? 0.42 : 0.58, r: 26, life: 0.72 });
  }, [active, igniteKey, mode]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
