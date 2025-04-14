"use server";
import db from "@/db/relational/connection";
import {
  conversationTable,
  messageTable,
} from "@/db/relational/schema/business";
import { generateUUID } from "@/util/uuid";
export async function postConversationStart(
  fileId: string,
  title: string,
  userId: string,
) {
  try {
    const chatId = generateUUID();
    const messageId = generateUUID();
    const systemMessage =
      "How can I help your with your technical documents today?";

    await db.transaction(async (tx) => {
      await tx.insert(conversationTable).values({
        conversationId: chatId,
        userId: userId,
        fileId: fileId,
        title: title,
      });
      await tx.insert(messageTable).values({
        messageId: messageId,
        chatId: chatId,
        userId: userId,
        messageRole: "assistant",
        content: systemMessage,
      });
    });
    return { success: true, response: chatId };
  } catch (error) {
    console.error("Error creating chat entry", error);
    return { success: false, response: (error as Error).message };
  }
}
