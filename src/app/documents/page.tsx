"use client";

import React from "react";
import { Documents } from "@/components/document";
import { syncUser } from "@/actions/sync-user";
import { useUser } from "@clerk/nextjs";

export default function DocumentPage() {
  const { user } = useUser();
  const userId = user?.id;
  const username = user?.username;
  const email = user?.emailAddresses[0].emailAddress;
  React.useEffect(() => {
    async function checkUser() {
      if (userId && username && email) {
        await syncUser(userId, username, email);
      }
    }
    checkUser();
  }, [email, userId, username]);

  return <Documents />;
}
