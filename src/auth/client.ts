import { createAuthClient } from "better-auth/react";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://ask-file.netlify.app"
    : "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: baseUrl,
  debugLogs: true,
  plugins: [],
  fetchOptions: {
    credentials: "include",
    onError(e) {
      if (e.error.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
