import { NextResponse } from "next/server";
import { dbGetFiles } from "@/db/relational/functions/files";
export async function GET() {
  try {
    const response = await dbGetFiles();
    if (response.success) {
      return NextResponse.json({ success: true, response: response.response });
    } else {
      return NextResponse.json({ success: false, response: response.response });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, response: error });
  }
}
