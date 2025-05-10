import { NextResponse } from "next/server";
import { dbGetFiles } from "@/db/relational/functions/files";

export async function GET() {
  try {
    const response = await dbGetFiles();
    return response.success
      ? NextResponse.json({ success: true, files: response.response })
      : NextResponse.json({ success: false, message: response.response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, response: error });
  }
}
