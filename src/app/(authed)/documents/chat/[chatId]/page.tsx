import { Chat } from "@/components/chat";
import { checkMappingFileIdWithUser } from "@/db/relational/functions/files";
import { redirect } from "next/navigation";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  const isValid = await checkMappingFileIdWithUser(chatId);
  return isValid ? <Chat chatId={chatId} /> : redirect("/404");
}
