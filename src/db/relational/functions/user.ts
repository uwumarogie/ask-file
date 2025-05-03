"use server";
import db from "@/db/relational/connection";
import { user } from "@/db/relational/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function getUser() {
  try {
    const userInformation = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("userInformation", userInformation);
    if (userInformation == undefined || userInformation == null) {
      throw new Error("User not authenticated");
    }

    const [user1] = await db
      .select()
      .from(user)
      .where(eq(user.email, userInformation.user.email));

    return user1;
  } catch (error) {
    console.error("Error getting user by id", error);
    throw new Error("Error getting user by id");
  }
}
