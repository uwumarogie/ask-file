"use client";
import { useParams } from "next/navigation";
import React from "react";

//FIX:: Input validation must be done by checking if the file name is among the uploaded files
export default function Page() {
  const params = useParams<{ file_name: string }>();

  return (
    <div className="flex flex-col space-y-40 justify-center items-center">
      <h1>File ID: {params.file_name}</h1>
      <ChatMessage />
    </div>
  );
}

function ChatMessage() {
  const [message, setMessage] = React.useState<string[]>([]);

  return (
    <form>
      <div>
        {message.map((mes) => (
          <div key={mes}>{mes}</div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage((prev) => [...prev, e.target.value])}
      />
      <button>Send</button>
    </form>
  );
}
