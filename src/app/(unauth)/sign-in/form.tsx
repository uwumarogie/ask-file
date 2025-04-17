"use client";
import { signIn, signOut } from "next-auth/react";

export default function SignInForm() {
  return (
    <div className="flex items-center justify-center h-fit min-h-screen">
      <div className="shadow-xl p-12 rounded-2xl flex flex-col gap-4">
        <form
          action={() => {
            signIn("github", { redirectTo: "/documents" });
          }}
        >
          <button className="flex items-center justify-center gap-3 border border-black bg-black cursor-pointer text-white p-2 px-3 rounded hover:scale-105 transition">
            Sign in with Github
          </button>
        </form>
        <form
          action={() => {
            signOut();
          }}
        >
          <button className="flex items-center justify-center gap-3 border border-black bg-black cursor-pointer text-white p-2 px-3 rounded hover:scale-105 transition">
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
