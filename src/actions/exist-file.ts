"use server";

import { NextResponse } from "next/server";
import { dbCheckExistingFile } from "@/db/relational/functions/files";

export async function checkExistingFileName(fileName: string) {
  try {
    const exist = await dbCheckExistingFile(fileName);
    return NextResponse.json({ success: true, response: exist });
  } catch (error) {
    console.error("Error checking file name:", error);
    return NextResponse.json({ success: false, response: error });
  }
}
