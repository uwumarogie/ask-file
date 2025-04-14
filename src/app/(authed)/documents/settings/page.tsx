"use client";

import { signOut } from "next-auth/react";

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <button onClick={() => signOut()}></button>
    </div>
  );
}
