"use server";
import { db } from "@/database/relational/connection";
import { files } from "@/database/relational/schema";
import { eq } from "drizzle-orm";

export async function updateFileName(file_id: string, newFileName: string) {
  try {
    if (newFileName.length > 30) {
      return {
        success: false,
        message: "File name cannot be longer than 30 characters",
      };
    }

    const existingFile = await db
      .select()
      .from(files)
      .where(eq(files.file_name, newFileName))
      .limit(1);

    if (existingFile[0].file_id === file_id) {
      return {
        success: true,
        message: "File name is alredy set to the desired name.",
      };
    }

    const duplicateFile = await db
      .select()
      .from(files)
      .where(eq(files.file_name, newFileName));

    if (duplicateFile.length > 0) {
      return {
        success: false,
        message: "File name already taken",
      };
    }

    await db
      .update(files)
      .set({ file_name: newFileName })
      .where(eq(files.file_id, file_id));

    return { success: true, message: "File name updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}
