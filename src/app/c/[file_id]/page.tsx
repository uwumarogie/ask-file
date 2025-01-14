"use client";
import { useParams } from "next/navigation";
import React from "react";
import * as z from "zod";

const fileIdSchema = z.object({
  file_id: z.string().uuid(),
});
export default function Page() {
  const _context = useParams<{ file_id: string }>();
  const validateData = fileIdSchema.parse(_context);

  return (
    <div className="flex flex-col space-y-40 justify-center items-center">
      <h1>File ID: {validateData.file_id}</h1>
    </div>
  );
}
