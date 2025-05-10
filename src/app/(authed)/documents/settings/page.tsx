"use client";

import { authClient } from "@/auth/client";
import { redirect } from "next/navigation";
export default function Page() {
  return (
    <div className="flex flex-col items-center max-w-screen-2xl">
      <button onClick={() => console.log("Sign out")}>
        öuwnriownriäöwnrwirnwäirnwiränwi
      </button>
      <button
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                redirect("/");
              },
            },
          });
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
