import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Filter,
  Flame,
  Heart,
  MessageCircle,
  MoreHorizontal,
  MoreVertical,
  Search,
  Sparkles,
  ThumbsUp,
  UserPlus,
  Users
} from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";

const friends = [
  { name: "Minh Châu", status: "Đang hoạt động", tone: "from-amber-200 to-emerald-700", active: true, action: MessageCircle },
  { name: "Hoàng Nam", status: "Đang thắp nến", tone: "from-orange-200 to-slate-700", active: true, action: ThumbsUp },
  { name: "Lan Anh", status: "Đang đồng nguyện", tone: "from-rose-200 to-emerald-800", active: false, action: Users },
  { name: "Giau ten", status: "Online", tone: "from-slate-100 to-stone-600", active: true, action: MessageCircle }
];

const groups = [
  {
    title: "Lan tỏa yêu thương",
    members: "1.248 thành viên",
    description: "Cùng nhau lan tỏa những điều tích cực mỗi ngày.",
    image: "/assets/rituals/today-message-bg.png",
    avatars: ["from-amber-200 to-emerald-700", "from-orange-200 to-slate-700", "from-rose-200 to-emerald-800"],
    extra: "+243"
  },
  {
    title: "Bình an mỗi ngày",
    members: "856 thành viên",
    description: "Thực hành lòng biết ơn và sống chậm lại.",
    image: "/assets/rituals/send-peace-hand-card.png",
    avatars: ["from-orange-200 to-slate-700", "from-amber-200 to-emerald-700", "from-stone-100 to-stone-600"],
    extra: "+156"
  },
  {
    title: "Học cách buông bỏ",
    members: "642 thành viên",
    description: "Cùng nhau buông bỏ những gánh nặng trong tâm trí.",
    image: "/assets/rituals/future-write-card.png",
    avatars: ["from-rose-200 to-emerald-800", "from-amber-200 to-emerald-700", "from-orange-200 to-slate-700"],
    extra: "+98"
  },
  {
    title: "Sống thiện lành",
    members: "1.024 thành viên",
    description: "Mỗi hành động nhỏ, một thế giới tốt đẹp hơn.",
    image: "/assets/rituals/memorial-bg.png",
    avatars: ["from-amber-200 to-emerald-700", "from-stone-100 to-stone-600", "from-orange-200 to-slate-700"],
    extra: "+201"
  }
];

const sharedPrayers = [
  {
    author: "Minh Châu",
    time: "2 giờ trước",
    text: "Nguyện cho gia đình luôn khỏe mạnh, bình an và hạnh phúc.",
    hearts: 128,
    comments: 56,
    extra: "+23",
    tone: "from-amber-200 to-emerald-700"
  },
  {
    author: "Hoàng Nam",
    time: "5 giờ trước",
    text: "Nguyện cho bản thân luôn giữ được lòng biết ơn và sống tử tế mỗi ngày.",
    hearts: 97,
    comments: 34,
    extra: "+18",
    tone: "from-orange-200 to-slate-700"
  },
  {
    author: "Lan Anh",
    time: "1 ngày trước",
    text: "Nguyện cho những người đang gặp khó khăn sẽ tìm thấy ánh sáng.",
    hearts: 156,
    comments: 62,
    extra: "+31",
    tone: "from-rose-200 to-emerald-800"
  }
];

const invitations = [
  { name: "Thu Hà", mutual: "5 bạn chung", tone: "from-amber-200 to-emerald-700", primary: "Chấp nhận" },
  { name: "Tuệ An", mutual: "3 bạn chung", tone: "from-orange-100 to-stone-700", primary: "Chấp nhận" },
  { name: "Giấu tên", mutual: "2 bạn chung", tone: "from-slate-100 to-stone-600", primary: "Đồng nguyện" }
];

const leaders = [
  { name: "Minh Châu", score: "1.248 điểm", tone: "from-amber-200 to-emerald-700", rank: "1" },
  { name: "Hoàng Nam", score: "856 điểm", tone: "from-orange-200 to-slate-700", rank: "2" },
  { name: "Lan Anh", score: "642 điểm", tone: "from-rose-200 to-emerald-800", rank: "3" },
  { name: "Giấu tên", score: "518 điểm", tone: "from-slate-100 to-stone-600", rank: "4" },
  { name: "Thu Hà", score: "432 điểm", tone: "from-amber-100 to-rose-700", rank: "5" }
];

function Avatar({ tone, size = "h-10 w-10" }: { tone: string; size?: string }) {
  return <span className={`${size} shrink-0 rounded-full border border-amber-200/30 bg-gradient-to-br ${tone} shadow-[0_0_18px_rgba(251,191,36,0.16)]`} />;
}

function AvatarStack({ extra }: { extra: string }) {
  const tones = ["from-amber-200 to-emerald-700", "from-orange-200 to-slate-700", "from-rose-200 to-emerald-800", "from-slate-100 to-stone-600"];

  return (
    <div className="flex items-center">
      {tones.map((tone) => (
        <Avatar key={tone} tone={tone} size="h-7 w-7" />
      ))}
      <span className="-ml-2 rounded-full border border-white/10 bg-[#172033] px-2.5 py-1 text-xs text-slate-300">{extra}</span>
    </div>
  );
}

export default function PrayersPage() {
  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/prayers" variant="prayers" />

      <main className="min-h-screen px-4 py-6 xl:ml-72 2xl:px-8">
        <header className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Bạn bè &amp; Đồng nguyện</h1>
            <p className="mt-2 text-sm text-slate-400">Kết nối với những người cùng lan tỏa yêu thương và bình an.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm kiếm bạn bè, nhóm, lời nguyện..." />
            </label>
            <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/6">
              <Bell size={18} aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">8</span>
            </button>
            <Avatar tone="from-amber-100 to-stone-700" size="h-11 w-11" />
          </div>
        </header>

        <div className="mx-auto mt-6 grid max-w-[1600px] gap-6 2xl:grid-cols-[minmax(0,1fr)_25rem]">
          <section className="grid gap-6">
            <section className="relative min-h-[19rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-8 shadow-2xl shadow-black/25">
              <Image
                src="/assets/rituals/today-message-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover object-right"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.91),rgba(8,13,25,0.66)_44%,rgba(8,13,25,0.08)_78%,rgba(8,13,25,0.28))]" />
              <div className="relative z-10 max-w-2xl">
                <p className="text-5xl leading-none text-amber-400/80">“</p>
                <h2 className="mt-2 text-3xl font-medium leading-[1.45] text-amber-100 md:text-4xl">
                  Khi chúng ta cùng nguyện cầu,
                  <br />
                  những điều tốt đẹp sẽ lan tỏa
                  <br />
                  mạnh mẽ hơn.
                </h2>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/prayers/new" className="rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-7 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(251,191,36,0.18)]">
                    Tạo lời nguyện chung
                  </Link>
                  <button className="rounded-xl border border-white/15 bg-[#111a2b]/70 px-7 py-3 font-semibold text-slate-200 backdrop-blur transition hover:bg-white/10">
                    Khám phá nhóm
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold text-white">Nhóm đồng nguyện</h2>
                <Link href="/groups" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                  Xem tất cả
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {groups.map((group) => (
                  <article key={group.title} className="overflow-hidden rounded-xl border border-white/10 bg-[#101827]">
                    <div className="relative h-28">
                      <Image src={group.image} width={600} height={360} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.02),rgba(8,13,25,0.68))]" />
                      <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/25 text-slate-300 backdrop-blur">
                        <MoreVertical size={15} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                      <p className="mt-1 text-xs text-slate-400">{group.members}</p>
                      <p className="mt-3 min-h-10 text-sm leading-5 text-slate-400">{group.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <AvatarStack extra={group.extra} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="mr-2 font-semibold text-white">Lời nguyện chung</h2>
                  {["Mới nhất", "Được yêu thích", "Đang đồng nguyện"].map((tab, index) => (
                    <button
                      key={tab}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        index === 0 ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-transparent bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-300 lg:self-auto">
                  <Filter size={15} aria-hidden="true" />
                  Lọc
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                {sharedPrayers.map((prayer) => (
                  <article key={prayer.author} className="rounded-xl border border-white/10 bg-[#101827] px-4 py-4">
                    <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                      <Avatar tone={prayer.tone} size="h-14 w-14" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                          <span className="font-semibold text-white">{prayer.author}</span>
                          <span>đã tạo lời nguyện chung</span>
                          <button className="ml-auto grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-white/6 lg:hidden">
                            <MoreVertical size={16} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="mt-2 text-base leading-7 text-white">{prayer.text}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-slate-400">
                          <span>{prayer.time}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Heart size={15} aria-hidden="true" />
                            {prayer.hearts}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MessageCircle size={15} aria-hidden="true" />
                            {prayer.comments}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 lg:justify-end">
                        <AvatarStack extra={prayer.extra} />
                        <button className="rounded-lg bg-amber-400/14 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-400/20">
                          Đồng nguyện
                        </button>
                        <button className="grid h-9 w-9 place-items-center rounded-full bg-white/6 text-slate-400">
                          <MoreHorizontal size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <Link href="/prayers" className="mt-4 flex justify-center rounded-xl px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-white/6">
                Xem tất cả lời nguyện chung
                <ChevronRight className="ml-2" size={16} aria-hidden="true" />
              </Link>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Bạn bè của bạn</h2>
                <Link href="/friends" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                  Xem tất cả
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Bạn bè", value: "128", icon: UserPlus },
                  { label: "Đang đồng nguyện", value: "36", icon: Sparkles },
                  { label: "Lời nguyện chung", value: "12", icon: Flame }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-[#121a2a] p-3 text-center">
                    <stat.icon className="mx-auto text-amber-300" size={20} fill="currentColor" aria-hidden="true" />
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-4">
                {friends.map((friend) => {
                  const Action = friend.action;
                  return (
                    <div key={friend.name} className="flex items-center gap-3">
                      <span className="relative">
                        <Avatar tone={friend.tone} />
                        {friend.active ? <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#111a2b] bg-emerald-400" /> : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{friend.name}</p>
                        <p className="truncate text-xs text-emerald-300/80">{friend.status}</p>
                      </div>
                      <Action size={17} className="text-slate-300" aria-hidden="true" />
                      <MoreHorizontal size={17} className="text-slate-500" aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
              <Link href="/friends" className="mt-5 flex justify-center gap-2 text-sm text-slate-300 hover:text-amber-200">
                Xem tất cả bạn bè
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Lời mời kết bạn</h2>
              <div className="mt-5 grid gap-4">
                {invitations.map((invite) => (
                  <div key={invite.name} className="flex items-center gap-3">
                    <Avatar tone={invite.tone} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{invite.name}</p>
                      <p className="text-xs text-slate-400">{invite.mutual}</p>
                    </div>
                    <button className="rounded-lg bg-amber-400/14 px-3 py-2 text-xs font-semibold text-amber-200">{invite.primary}</button>
                    <button className="rounded-lg bg-white/6 px-3 py-2 text-xs text-slate-400">Từ chối</button>
                  </div>
                ))}
              </div>
              <Link href="/friends/requests" className="mt-5 flex justify-center gap-2 text-sm text-slate-300 hover:text-amber-200">
                Xem tất cả lời mời
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Người lan tỏa tích cực</h2>
                <button className="inline-flex items-center gap-1 rounded-lg bg-amber-400/10 px-3 py-1.5 text-xs text-amber-200">
                  Tuần này
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-5 grid gap-3">
                {leaders.map((leader, index) => (
                  <div key={leader.name} className="flex items-center gap-3">
                    <span className={`w-5 text-sm ${index < 3 ? "text-amber-300" : "text-slate-400"}`}>{leader.rank}</span>
                    <Avatar tone={leader.tone} size="h-8 w-8" />
                    <span className="min-w-0 flex-1 truncate text-sm text-white">{leader.name}</span>
                    <span className="text-xs text-slate-400">{leader.score}</span>
                  </div>
                ))}
              </div>
              <Link href="/friends/ranking" className="mt-5 flex justify-center gap-2 text-sm text-slate-300 hover:text-amber-200">
                Xem bảng xếp hạng
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </section>

            <section className="relative min-h-40 overflow-hidden rounded-2xl border border-amber-200/20 p-6">
              <Image src="/assets/rituals/today-message-bg.png" width={1792} height={1024} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-left" />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.28),rgba(8,13,25,0.72))]" />
              <div className="relative z-10 ml-auto max-w-[17rem] text-right">
                <p className="text-lg leading-8 text-slate-100">“Một ngọn nến có thể thắp sáng trăm ngọn nến khác mà không làm giảm đi ánh sáng của nó.”</p>
                <p className="mt-3 text-sm text-slate-300">- Phật giáo</p>
              </div>
              <RitualMiniImage src="/assets/rituals/lantern.png" className="absolute bottom-4 left-4 h-16 w-20" />
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
