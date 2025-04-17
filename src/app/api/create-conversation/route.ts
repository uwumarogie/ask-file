import { NextRequest } from "next/server";
import * as z from "zod";
import { postConversationStart } from "@/db/relational/functions/chat";
import { NextResponse } from "next/server";
const requestSchema = z.object({
  fileId: z.string(),
  title: z.string(),
});
export async function POST(request: NextRequest) {
  try {
    const _context = await request.json();
    const { fileId, title } = requestSchema.parse(_context);
    const conversationResponse = await postConversationStart(fileId, title);
    if (conversationResponse.success) {
      return NextResponse.json({
        success: true,
        conversationId: conversationResponse.conversationId,
      });
    } else {
      return NextResponse.json({
        success: false,
        response: conversationResponse.error,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, response: error });
  }
}
