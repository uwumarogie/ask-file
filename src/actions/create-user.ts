"use server";

import { NextResponse } from "next/server";
import { createUser } from "@/db/relational/functions/user";

// export async function dbCreateUser() {
//   const _context = await createUser();
//   const response = await _context.json();
//   if (response.success) {
//     return NextResponse.json({ success: true, response: response.response });
//   } else {
//     return NextResponse.json({ success: false, response: response.response });
//   }
// }
