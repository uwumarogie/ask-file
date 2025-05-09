import { Chat } from "@/components/chat";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

// NOTE: Validate the chatId is for the right user
export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  return <Chat chatId={chatId} />;
}
