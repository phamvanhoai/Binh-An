"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Flame, Flower2, Send, Sparkles, Wind } from "lucide-react";
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
  const [lastPrayer, setLastPrayer] = useState("");

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

    setLastPrayer(payload.content.slice(0, 28));
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
          <RitualScene ritual={ritual} isActive={isActive} effectKey={effectKey} prayerText={lastPrayer} />
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
  effectKey,
  prayerText
}: {
  ritual: Ritual;
  isActive: boolean;
  effectKey: number;
  prayerText: string;
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
    <LanternCanvasScene isActive={isActive} releaseKey={effectKey} prayerText={prayerText} />
  );
}

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
};

type Ripple = {
  x: number;
  y: number;
  r: number;
  max: number;
  alpha: number;
};

type Floater = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  prayer: string;
  age: number;
  life: number;
  wobble: number;
  wobbleSpeed: number;
  hue: number;
  scale: number;
  flicker: number;
  flickerSpeed: number;
};

function LanternCanvasScene({
  isActive,
  releaseKey,
  prayerText
}: {
  isActive: boolean;
  releaseKey: number;
  prayerText: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<{
    stars: Star[];
    ripples: Ripple[];
    floaters: Floater[];
    shoreLanterns: Array<{ x: number; hue: number; flicker: number; flickerSpeed: number }>;
    seeded: boolean;
    lastReleaseKey: number;
  }>({
    stars: [],
    ripples: [],
    floaters: [],
    shoreLanterns: [],
    seeded: false,
    lastReleaseKey: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const state = stateRef.current;
    if (!state.seeded) {
      state.stars = Array.from({ length: 110 }, () => ({
        x: Math.random(),
        y: Math.random() * 0.48,
        r: Math.random() * 1.15 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.003
      }));
      state.shoreLanterns = Array.from({ length: 7 }, (_, index) => ({
        x: 0.08 + index * 0.135,
        hue: 18 + index * 8,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: 0.03 + Math.random() * 0.02
      }));
      state.seeded = true;
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let time = 0;
    let animationId = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function addRipple(x: number, y: number) {
      state.ripples.push({ x, y, r: 0, max: Math.min(width, height) * 0.06, alpha: 0.5 });
    }

    function spawnFloater(x: number, prayer: string) {
      state.floaters.push({
        x,
        y: 0.035 + Math.random() * 0.04,
        vx: (Math.random() - 0.5) * 0.00035,
        vy: Math.random() * 0.00016 + 0.00006,
        prayer,
        age: 0,
        life: 2600 + Math.random() * 1100,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.012 + Math.random() * 0.01,
        hue: 20 + Math.floor(Math.random() * 7) * 8,
        scale: 0.78 + Math.random() * 0.28,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: 0.04 + Math.random() * 0.03
      });
    }

    function drawLotusLantern(x: number, y: number, scale: number, opacity: number, flicker: number, hue: number) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const radius = 28;
      const glow = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius * 3.4);
      glow.addColorStop(0, `hsla(${hue}, 100%, 70%, ${0.22 * flicker})`);
      glow.addColorStop(0.52, `hsla(${hue}, 90%, 50%, ${0.08 * flicker})`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 3.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, radius * 0.82, radius * 1.18, radius * 0.28, 0, 0, Math.PI * 2);
      const leafGradient = ctx.createRadialGradient(0, radius * 0.7, 0, 0, radius * 0.85, radius * 1.1);
      leafGradient.addColorStop(0, "#3d8c40");
      leafGradient.addColorStop(0.55, "#2e7031");
      leafGradient.addColorStop(1, "#1a4d1c");
      ctx.fillStyle = leafGradient;
      ctx.fill();

      for (let index = 0; index < 8; index += 1) {
        const angle = (index / 8) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, radius * 0.55);
        ctx.bezierCurveTo(radius * 0.55, radius * 0.3, radius * 0.7, -radius * 0.15, 0, -radius * 0.6);
        ctx.bezierCurveTo(-radius * 0.7, -radius * 0.15, -radius * 0.55, radius * 0.3, 0, radius * 0.55);
        const petalGradient = ctx.createLinearGradient(0, -radius * 0.6, 0, radius * 0.55);
        petalGradient.addColorStop(0, `hsla(${hue}, 90%, 88%, 0.95)`);
        petalGradient.addColorStop(0.45, `hsla(${hue + 5}, 85%, 72%, 0.9)`);
        petalGradient.addColorStop(1, `hsla(${hue + 10}, 75%, 55%, 0.85)`);
        ctx.fillStyle = petalGradient;
        ctx.fill();
        ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.4)`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.restore();
      }

      for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * Math.PI * 2 + Math.PI / 6;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, radius * 0.3);
        ctx.bezierCurveTo(radius * 0.38, radius * 0.1, radius * 0.42, -radius * 0.3, 0, -radius * 0.55);
        ctx.bezierCurveTo(-radius * 0.42, -radius * 0.3, -radius * 0.38, radius * 0.1, 0, radius * 0.3);
        const petalGradient = ctx.createLinearGradient(0, -radius * 0.55, 0, radius * 0.3);
        petalGradient.addColorStop(0, `hsla(${hue - 5}, 95%, 95%, 0.98)`);
        petalGradient.addColorStop(0.52, `hsla(${hue}, 88%, 78%, 0.92)`);
        petalGradient.addColorStop(1, `hsla(${hue + 10}, 80%, 60%, 0.85)`);
        ctx.fillStyle = petalGradient;
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.ellipse(0, radius * 0.05, radius * 0.22, radius * 0.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,245,210,0.95)";
      ctx.fill();

      const firePower = 0.85 + flicker * 0.25;
      ctx.save();
      ctx.translate(0, -radius * 0.34);
      const fireGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.48);
      fireGlow.addColorStop(0, `rgba(255,240,140,${0.55 * firePower})`);
      fireGlow.addColorStop(0.55, `rgba(255,160,40,${0.22 * firePower})`);
      fireGlow.addColorStop(1, "transparent");
      ctx.fillStyle = fireGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, radius * 0.14);
      ctx.bezierCurveTo(radius * 0.12, radius * 0.06, radius * 0.1, -radius * 0.1, 0, -radius * 0.22 * firePower);
      ctx.bezierCurveTo(-radius * 0.1, -radius * 0.1, -radius * 0.12, radius * 0.06, 0, radius * 0.14);
      const fireGradient = ctx.createLinearGradient(0, radius * 0.14, 0, -radius * 0.22 * firePower);
      fireGradient.addColorStop(0, "rgba(255,200,50,0.95)");
      fireGradient.addColorStop(0.42, "rgba(255,130,20,0.9)");
      fireGradient.addColorStop(1, "rgba(255,240,180,0.75)");
      ctx.fillStyle = fireGradient;
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    function drawSky() {
      const gradient = ctx.createLinearGradient(0, 0, 0, height * 0.52);
      gradient.addColorStop(0, "#02020e");
      gradient.addColorStop(0.5, "#090720");
      gradient.addColorStop(1, "#140e30");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height * 0.52);
    }

    function drawStars() {
      state.stars.forEach((star) => {
        star.phase += star.speed;
        const alpha = 0.45 + 0.45 * Math.sin(star.phase);
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,200,${alpha})`;
        ctx.fill();
      });
    }

    function drawMoon() {
      const moonX = width * 0.76;
      const moonY = height * 0.1;
      const moonR = width * 0.036;
      const glow = ctx.createRadialGradient(moonX, moonY, moonR * 0.4, moonX, moonY, moonR * 2.5);
      glow.addColorStop(0, "rgba(255,245,180,0.15)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = "#fff8e0";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX + moonR * 0.32, moonY - moonR * 0.1, moonR * 0.83, 0, Math.PI * 2);
      ctx.fillStyle = "#09061e";
      ctx.fill();
    }

    function drawWater() {
      const waterY = height * 0.5;
      const gradient = ctx.createLinearGradient(0, waterY, 0, height);
      gradient.addColorStop(0, "#080618");
      gradient.addColorStop(0.5, "#050410");
      gradient.addColorStop(1, "#020208");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, waterY, width, height - waterY);

      const moonX = width * 0.76;
      for (let index = 0; index < 4; index += 1) {
        const reflectionY = waterY + height * 0.055 + index * height * 0.038;
        ctx.beginPath();
        ctx.ellipse(moonX + Math.sin(time * 0.4 + index) * width * 0.009, reflectionY, width * 0.018 * (4 - index), height * 0.009, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,180,${0.12 - index * 0.025})`;
        ctx.fill();
      }

      for (let index = 0; index < 24; index += 1) {
        const lineY = waterY + (index + 1) * ((height - waterY) / 26);
        const lineX = width * (0.08 + Math.sin(time * 0.25 + index * 0.8) * 0.05);
        const lineW = width * 0.07 * (0.6 + Math.sin(time * 0.18 + index) * 0.35);
        ctx.beginPath();
        ctx.moveTo(lineX, lineY);
        ctx.lineTo(lineX + lineW, lineY);
        ctx.strokeStyle = `rgba(255,215,100,${0.035 + 0.018 * Math.sin(time * 0.28 + index)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      state.ripples.forEach((ripple) => {
        ripple.r += width * 0.0012;
        ripple.alpha = 0.4 * (1 - ripple.r / ripple.max);
        ctx.beginPath();
        ctx.ellipse(ripple.x * width, waterY + ripple.y * (height - waterY), ripple.r, ripple.r * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,200,90,${Math.max(0, ripple.alpha)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      state.ripples = state.ripples.filter((ripple) => ripple.r < ripple.max);
    }

    function drawShore() {
      const waterY = height * 0.5;
      ctx.fillStyle = "#141008";
      ctx.fillRect(0, waterY - height * 0.04, width, height * 0.045);
      for (let index = 0; index < 18; index += 1) {
        const baseX = width * (0.02 + index * 0.056 + Math.sin(index) * 0.01);
        const bladeH = height * (0.04 + Math.sin(index * 1.7) * 0.015);
        ctx.beginPath();
        ctx.moveTo(baseX, waterY - height * 0.005);
        ctx.quadraticCurveTo(baseX + Math.sin(index) * 8, waterY - bladeH * 0.5, baseX + Math.sin(index * 0.5) * 5, waterY - bladeH);
        ctx.strokeStyle = `rgba(${30 + index * 3},${60 + index * 2},20,0.7)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    function render() {
      time += 0.016;
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      drawSky();
      drawStars();
      drawMoon();
      drawWater();
      drawShore();

      const waterY = height * 0.5;
      const shoreY = waterY - height * 0.038;
      state.shoreLanterns.forEach((lantern) => {
        lantern.flicker += lantern.flickerSpeed;
        const flicker = 0.88 + Math.sin(lantern.flicker) * 0.12;
        drawLotusLantern(lantern.x * width, shoreY, Math.min(width, height) * 0.00175, 0.88, flicker, lantern.hue);
      });

      state.floaters.forEach((floater) => {
        floater.age += 1;
        floater.wobble += floater.wobbleSpeed;
        floater.flicker += floater.flickerSpeed;
        floater.x += floater.vx;
        floater.y += floater.vy;
        floater.vy *= 0.997;
        if (floater.x < 0) floater.x = 1;
        if (floater.x > 1) floater.x = 0;

        const progress = floater.age / floater.life;
        let opacity = progress < 0.08 ? progress / 0.08 : progress > 0.85 ? (1 - progress) / 0.15 : 1;
        opacity *= 0.92;
        const flicker = 0.82 + Math.sin(floater.flicker) * 0.18;
        const x = floater.x * width + Math.sin(floater.wobble) * width * 0.005;
        const y = waterY + floater.y * (height - waterY);
        const scale = floater.scale * Math.min(width, height) * 0.00185;
        drawLotusLantern(x, y, scale, opacity, flicker, floater.hue);

        ctx.save();
        ctx.translate(x, y + 8 * floater.scale);
        ctx.scale(1, -0.18);
        ctx.globalAlpha = opacity * 0.15;
        ctx.beginPath();
        ctx.ellipse(0, 0, 28 * floater.scale, 28 * floater.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${floater.hue},90%,65%)`;
        ctx.fill();
        ctx.restore();

        if (floater.prayer && opacity > 0.35) {
          ctx.save();
          ctx.font = `${Math.round(Math.min(width, height) * 0.038)}px Georgia`;
          ctx.fillStyle = `rgba(255,235,160,${opacity * 0.82})`;
          ctx.textAlign = "center";
          ctx.shadowColor = `rgba(255,180,50,${opacity * 0.5})`;
          ctx.shadowBlur = 8;
          ctx.fillText(floater.prayer, x, y - 46 * floater.scale - 4);
          ctx.restore();
        }
      });
      state.floaters = state.floaters.filter((floater) => floater.age < floater.life);

      if (frame === 35 && state.floaters.length < 3) {
        spawnFloater(0.28, "Bình an");
        spawnFloater(0.55, "May mắn");
        spawnFloater(0.74, "An lành");
        addRipple(0.28, 0.08);
        addRipple(0.55, 0.06);
        addRipple(0.74, 0.1);
      }

      animationId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!isActive || releaseKey <= 0 || stateRef.current.lastReleaseKey === releaseKey) return;

    stateRef.current.lastReleaseKey = releaseKey;
    const x = 0.25 + Math.random() * 0.5;
    stateRef.current.floaters.push({
      x,
      y: 0.035 + Math.random() * 0.04,
      vx: (Math.random() - 0.5) * 0.00035,
      vy: Math.random() * 0.00016 + 0.00006,
      prayer: prayerText || "Bình an",
      age: 0,
      life: 3000,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.014,
      hue: 22,
      scale: 1,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: 0.06
    });
    stateRef.current.ripples.push({ x, y: 0.06 + Math.random() * 0.08, r: 0, max: 80, alpha: 0.5 });
  }, [isActive, prayerText, releaseKey]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Cảnh thả hoa đăng" />;
}
