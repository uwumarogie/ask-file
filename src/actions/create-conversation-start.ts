"use server";
import { postConversationStart } from "@/db/relational/functions/chat";
import { NextResponse } from "next/server";

// return the chatId if success = true
export async function createConversationStart(
  fileId: string,
  title: string,
  userId: string,
) {
  const response = await postConversationStart(fileId, title, userId);
  if (response.success) {
    return NextResponse.json({
      success: true,
      response: response.response,
    });
  } else {
    return NextResponse.json({ success: false, response: response.response });
  }
}
