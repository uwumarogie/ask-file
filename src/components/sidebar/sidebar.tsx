"use client";
import clsx from "clsx";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useUserFile } from "@/util/hooks/use-user-files";
import { redirect } from "next/navigation";
import Files from "./files";
import SidebarButton from "./sidebar-button";
import { useSideBarStore } from "@/util/hooks/use-sidebar-store";
import { usePathname } from "next/navigation";

export function SideBar() {
  const { isOpen, toggle } = useSideBarStore((state) => state);
  const { user } = useUser();
  const { files, isLoading, hasError, refetch } = useUserFile(user?.id);

  const pathName = usePathname();
  React.useEffect(() => {
    if (pathName.includes("/c")) {
      refetch();
    }
  }, [pathName]);

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 z-40 h-screen bg-black text-white transition-all sm:translate-x-0",
        isOpen
          ? "lg:w-64 md:w-64 w-full bg-black"
          : "w-15 lg:w-20 bg-neutral-700 lg:bg-black",
      )}
      aria-label="Sidebar"
    >
      <div
        className={clsx(
          "flex justify-between",
          isOpen ? "flex-row" : "flex-col",
        )}
      >
        <SidebarButton
          onClick={toggle}
          path="/icons/move-sidebar-icon.svg"
          alt="Move sidebar icon"
        />

        <SidebarButton
          onClick={() => redirect("/")}
          path="/icons/create-new-file-icon.svg"
          alt="Move sidebar icon"
        />
      </div>
      {isOpen && (
        <div className="h-full px-2 py-5 overflow-y-auto">
          <ul className="space-y-6 font-medium flex flex-col">
            <div className="flex flex-row justify-between items-center p-2 h-10 group">
              <span className="text-sm font-bold">Projects</span>
              <SidebarButton
                onClick={() => redirect("/")}
                path="/icons/add-icon.svg"
                alt="Move sidebar icon"
              />
            </div>
            <Files files={files} isLoading={isLoading} hasError={hasError} />
          </ul>
        </div>
      )}
    </aside>
  );
}
