"use server";
import { dbGetFiles } from "@/db/relational/functions/files";
import { NextResponse } from "next/server";

export async function getFiles() {
  const response = await dbGetFiles();
  if (response.success) {
    return NextResponse.json({ success: true, response: response.response });
  } else {
    return NextResponse.json({ success: false, response: response.response });
  }
}
