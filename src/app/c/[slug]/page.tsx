import React from "react";
import ChatInput from "@/components/chat/chat-input";

export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const _context = await params;
  console.log("params", _context);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <span className="text-3xl text-white font-bold">
        How can I assist you with the details of this file?
      </span>
      <ChatInput />
    </div>
  );
}
