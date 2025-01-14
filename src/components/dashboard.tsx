"use client";

import { Uploader } from "./uploader";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { syncUser } from "@/actions/sync-user";

export function Dashboard() {
  const { user } = useUser();
  const userId = user?.id;
  const username = user?.username;
  const email = user?.emailAddresses[0].emailAddress;
  React.useEffect(() => {
    if (userId) {
      syncUser(userId, username, email).then(console.log).catch(console.error);
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <Uploader />
    </div>
  );
}
