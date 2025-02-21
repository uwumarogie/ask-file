"use client";
import React from "react";
import { queryPinecone } from "@/database/vector";
import { useUser } from "@clerk/nextjs";

export default function ChatInput() {
  const [input, setInput] = React.useState("");
  const { user } = useUser();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      await queryPinecone(input, user.id);
    }
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
