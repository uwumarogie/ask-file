import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Login() {
  return (
    <div>
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
    </div>
  );
}
