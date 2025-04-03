"use server";
import { dbDeleteFile } from "@/db/relational/functions/postgres-interaction";
import { NextResponse } from "next/server";
export async function deleteFileFromDatabase(
  sanitizedFileName: string,
  userId: string,
) {
  const response = await dbDeleteFile(sanitizedFileName, userId);

  if (response.success) {
    return NextResponse.json({ success: true, response: response.fileId });
  } else {
    return NextResponse.json({ success: false, response: response.error });
  }
}
