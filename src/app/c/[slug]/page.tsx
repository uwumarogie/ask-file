import React from "react";
import * as z from "zod";
import ChatInput from "@/components/chat/chat-input";
const fileIdSchema = z.object({
  slug: z.string().uuid(),
});

type Chat = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Chat) {
  const _context = await params;
  const validateData = fileIdSchema.parse(_context);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <span className="text-3xl text-white font-bold">
        How can I assist you with the details of this file?
      </span>
      <ChatInput />
    </div>
  );
}
