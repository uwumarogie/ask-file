import React from "react";
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Login() {
  return (
    <React.Fragment>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "size-10",
          },
        }}
      />
    </React.Fragment>
  );
}
