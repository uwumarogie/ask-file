"use client";
import { authClient } from "@/auth/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center">
      <button onClick={() => console.log("Sign out")}>
        öuwnriownriäöwnrwirnwäirnwiränwi
      </button>

      <button
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/");
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
