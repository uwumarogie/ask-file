"use server";
import db from "@/db/relational/connection";
import {
  conversationTable,
  messageTable,
} from "@/db/relational/schema/business";
import { v4 as uuidv4 } from "uuid";

export async function postConversationStart(
  fileId: string,
  title: string,
  userId: string,
) {
  try {
    const chatId = uuidv4();
    const messageId = uuidv4();
    const systemMessage =
      "How can I help your with your technical documents today?";

    await db.transaction(async (tx) => {
      await tx.insert(conversationTable).values({
        chat_id: chatId,
        user_id: userId,
        file_id: fileId,
        title: title,
      });
      await tx.insert(messageTable).values({
        message_id: messageId,
        chat_id: chatId,
        user_id: userId,
        message_role: "system",
        content: systemMessage,
      });
    });
    return { success: true, response: chatId };
  } catch (error) {
    console.error("Error creating chat entry", error);
    return { success: false, response: (error as Error).message };
  }
}
