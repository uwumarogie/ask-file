import { NextRequest, NextResponse } from "next/server";
import { dbDeleteFile } from "@/db/relational/functions/postgres-interaction";
import * as z from "zod";

const requestSchema = z.object({
  fileName: z.string(),
  userId: z.string(),
});

export default async function DELETE(request: NextRequest) {
  try {
    const _context = await request.json();
    const { fileName, userId } = requestSchema.parse(_context);
    const response = await dbDeleteFile(fileName, userId);
    if (response.success) {
      return NextResponse.json({ success: true, response: response.fileId });
    } else {
      return NextResponse.json({ success: false, response: response.error });
    }
  } catch (error) {
    console.error("Error deleting file", error);
    return NextResponse.json({
      success: false,
      response: "Error deleting file",
    });
  }
}
