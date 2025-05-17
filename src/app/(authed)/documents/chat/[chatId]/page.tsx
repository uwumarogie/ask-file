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
  const isValidFileId = await checkMappingFileIdWithUser(chatId);

  return isValidFileId ? <Chat chatId={chatId} /> : redirect("/404");
}
