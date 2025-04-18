"use client";
import React from "react";
import { queryPinecone } from "@/db/vector/pinecone-service";
import { useParams } from "next/navigation";

export default function ChatInput() {
  const [input, setInput] = React.useState("");
  const params = useParams<{ slug: string }>();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  return (
    <div className="flex items-center justify-between w-5/6">
      <form onSubmit={handleSubmit} className="flex flex-row">
        <input
          type="text"
          placeholder="Enter your questions"
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 mt-4 text-lg text-black bg-white rounded-md border-2 border-gray-300"
        />
        <button className="p-2 mt-4 text-lg text-white bg-black rounded-md border-2 border-gray-300">
          GO
        </button>
      </form>
    </div>
  );
}
