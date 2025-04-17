import * as z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { uploadFileAcrossServices } from "@/db/relational/functions/files";
const requestSchema = z.object({
  file: z.instanceof(File),
});

export async function POST(request: NextRequest) {
  try {
    const _context = await request.json();
    const { file } = requestSchema.parse(_context);
    await uploadFileAcrossServices(file);
    return NextResponse.json({
      success: true,
      response: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading file", error);
    return NextResponse.json({
      success: false,
      response: "Error uploading file",
    });
  }
}
