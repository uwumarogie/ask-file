import React from "react";
import ChatInput from "@/components/chat/chat-input";

type Chat = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Chat) {
  const _context = await params;
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <span className="text-3xl text-white font-bold">
        How can I assist you with the details of this file?
      </span>
      <ChatInput />
    </div>
  );
}
