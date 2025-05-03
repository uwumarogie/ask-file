"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
export default function Page() {
  const session = useSession();
  console.log("session", session);
  return (
    <div className="flex flex-col items-center">
      <button onClick={() => signOut()}>
        öuwnriownriäöwnrwirnwäirnwiränwi
      </button>

      <div>{session?.data?.user?.email}</div>
    </div>
  );
}
