import { MessageCard } from "@/components/cards/MessageCard";
import { demoMessages } from "@/lib/demo-data";

async function getTodayMessage() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/daily-message/today`, {
      cache: "no-store"
    });
    if (!response.ok) return demoMessages[0];
    const json = await response.json();
    return json.data || demoMessages[0];
  } catch {
    return demoMessages[0];
  }
}

export default async function TodayPage() {
  const message = await getTodayMessage();

  return (
    <section className="mx-auto min-h-[70vh] max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <MessageCard message={message.message} reflection={message.reflection_question} category={message.category} />
    </section>
  );
}
