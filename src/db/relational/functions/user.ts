"use server";
import db from "@/db/relational/connection";
import { user } from "@/db/relational/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function getUser() {
  try {
    const authUser = await auth.api.getSession({
      headers: await headers(),
    });

    if (authUser == undefined || authUser == null) {
      throw new Error("User not authenticated");
    }

    const [userInformation] = await db
      .select()
      .from(user)
      .where(eq(user.email, authUser.user.email));

    return userInformation;
  } catch (error) {
    console.error("Error getting user by id", error);
    throw new Error("Error getting user by id");
  }
}
