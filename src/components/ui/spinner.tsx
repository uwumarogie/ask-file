import React from "react";
import { Loader } from "lucide-react";

export function LoadingIcon() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin w-12 h-12 text-white" />
    </div>
  );
}
