import Link from "next/link";
import { BookHeart, Flame, Mail, PenLine } from "lucide-react";
import { MessageCard } from "@/components/cards/MessageCard";
import { demoMessages } from "@/lib/demo-data";

const actions = [
  { href: "/prayers/new", label: "Tao loi nguyen", icon: Flame },
  { href: "/gratitude/new", label: "Viet dieu biet on", icon: PenLine },
  { href: "/letters/new", label: "Viet thu tuong lai", icon: Mail },
  { href: "/memorials/new", label: "Tao goc tuong nho", icon: BookHeart }
];

export default function DashboardPage() {
  const message = demoMessages[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-night">Dashboard</h1>
        <p className="mt-2 text-slate-600">Tong quan hanh trinh binh an cua ban.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <MessageCard message={message.message} reflection={message.reflection_question} category={message.category} />
        <aside className="soft-panel rounded-lg p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Streak</p>
          <p className="mt-3 text-5xl font-bold text-night">1</p>
          <p className="mt-2 text-slate-600">ngay mo Binh An lien tiep</p>
        </aside>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="soft-panel rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <action.icon className="mb-4 text-night" aria-hidden="true" />
            <span className="font-semibold text-night">{action.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 soft-panel rounded-lg p-5">
        <h2 className="font-semibold text-night">Hoat dong gan day</h2>
        <p className="mt-3 text-slate-600">Ket noi Supabase de hien thi cac hoat dong that cua user.</p>
      </div>
    </section>
  );
}
