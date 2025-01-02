"use client";
import React from "react";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.log("error", error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <span>{error.message}</span>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
