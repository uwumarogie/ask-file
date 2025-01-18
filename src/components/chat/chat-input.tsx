"use client";
import React from "react";
import Image from "next/image";

export default function ChatInput() {
  return (
    <div className="flex justify-between w-5/6">
      <input
        type="text"
        placeholder="Enter your question"
        className="w-full p-2 mt-4 text-lg text-black bg-white rounded-md border-2 border-gray-300"
      />
      <button className="w-full p-2 mt-4 text-lg text-white bg-black rounded-md border-2 border-gray-300">
        <Image
          src="/images/search.svg"
          alt="search"
          width={20}
          height={20}
          className="mr-2"
        />
      </button>
    </div>
  );
}
