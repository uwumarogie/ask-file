"use server";
import db from "@/db/relational/connection";

import { NextResponse } from "next/server";

export async function createUser() {
  try {
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({
      success: false,
      response: (error as Error).message,
    });
  }
}
