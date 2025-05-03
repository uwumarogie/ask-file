"use server";
import db from "@/db/relational/connection";
import { userTable } from "@/db/relational/schema/auth";
import { eq } from "drizzle-orm";

export async function getUser() {
  try {
    const userInformation = null;
    if (userInformation == undefined || userInformation == null) {
      throw new Error("User not authenticated");
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, userInformation));

    return user;
  } catch (error) {
    console.error("Error getting user by id", error);
    throw new Error("Error getting user by id");
  }
}
