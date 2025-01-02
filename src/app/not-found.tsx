"use client";
import { redirect } from "next/navigation";
export default function Notfound() {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => redirect("/")}>Go to home</button>
    </div>
  );
}
