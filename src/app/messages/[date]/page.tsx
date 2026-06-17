import { MessageCard } from "@/components/cards/MessageCard";
import { demoMessages } from "@/lib/demo-data";

export default async function MessageByDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const message = demoMessages[0];

  return (
    <section className="mx-auto min-h-[70vh] max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-4 text-sm font-semibold text-slate-500">{date}</p>
      <MessageCard message={message.message} reflection={message.reflection_question} category={message.category} />
    </section>
  );
}
