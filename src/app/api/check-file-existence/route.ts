import { dbCheckExistingFile } from "@/db/relational/functions/files";
import { NextResponse, NextRequest } from "next/server";
import * as z from "zod";

const requestSchema = z.object({
  fileName: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const _context = await request.json();
    const { fileName } = requestSchema.parse(_context);
    const exist = await dbCheckExistingFile(fileName);
    return NextResponse.json({ success: true, exist });
  } catch (error) {
    console.error("Error checking file name:", error);
    return NextResponse.json({ success: false, error });
  }
}
