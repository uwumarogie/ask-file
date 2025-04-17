"use server";
import db from "@/db/relational/connection";
import {
  conversationTable,
  messageTable,
} from "@/db/relational/schema/business";
import { generateUUID } from "@/util/uuid";
import { getUser } from "@/db/relational/functions/user";

export async function postConversationStart(fileId: string, title: string) {
  try {
    const chatId = generateUUID();
    const messageId = generateUUID();
    const systemMessage =
      "How can I help your with your technical documents today?";
    const user = await getUser();
    await db.transaction(async (tx) => {
      await tx.insert(conversationTable).values({
        conversationId: chatId,
        userId: user.id,
        fileId: fileId,
        title: title,
      });
      await tx.insert(messageTable).values({
        messageId: messageId,
        chatId: chatId,
        userId: user.id,
        messageRole: "assistant",
        content: systemMessage,
      });
    });
    return { success: true, conversationId: chatId };
  } catch (error) {
    console.error("Error creating chat entry", error);
    return { success: false, error: (error as Error).message };
  }
}
