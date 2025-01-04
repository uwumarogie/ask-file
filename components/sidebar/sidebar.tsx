"use client";
import React from "react";
import clsx from "clsx";
import { useUser } from "@clerk/nextjs";
import { useUserFile } from "@/util/use-user-files";
import { redirect } from "next/navigation";
import Files from "./Files";
import SidebarButton from "./SidebarButton";

function initSidebarState() {
    if (typeof window !== "undefined") {
        const savedState = localStorage.getItem("sideNavbarIsOpen");
        return savedState === "true" ? true : false;
    }
    return false;
}



export function SideBar() {
    const [isOpen, setIsOpen] = React.useState(initSidebarState());
    const { user } = useUser();
    const { files, isLoading, hasError } = useUserFile(user?.id);

    React.useEffect(() => {
        localStorage.setItem("sideNavbarIsOpen", isOpen.toString());
    }, [isOpen]);

    return (
        <aside
            className={clsx(
                "fixed top-0 left-0 z-40 w-72 h-screen bg-black text-white transition-all translate-x-full sm:translate-x-0",
                isOpen ? "w-5/6 sm:w-64" : "w-0 sm:w-20",
            )}
            aria-label="Sidebar"
        >
            <div
                className={clsx(
                    "flex justify-between",
                    isOpen ? "flex-row" : "flex-col",
                )}
            >
                <SidebarButton onClick={() => setIsOpen((prev) => !prev)} path="/icons/move-sidebar-icon.svg" alt="Move sidebar icon" />

                <SidebarButton onClick={() => redirect("/")} path="/icons/create-new-file-icon.svg" alt="Move sidebar icon" />
            </div>
            {isOpen && (
                <div className="h-full px-2 py-5 overflow-y-auto">
                    <ul className="space-y-6 font-medium flex flex-col">
                        <div className="flex flex-row justify-between items-center p-2 h-10 group">
                            <span className="text-sm font-bold">Projects</span>
                            <SidebarButton onClick={() => redirect("/")} path="/icons/add-icon.svg" alt="Move sidebar icon" />
                        </div>
                        <Files files={files} isLoading={isLoading} hasError={hasError} />
                    </ul>
                </div>
            )}
        </aside>
    );
}
