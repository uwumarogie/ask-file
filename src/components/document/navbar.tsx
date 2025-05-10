"use client";
import React, { useState } from "react";
import { cn } from "@/util/tailwind";
import {
  FileText,
  Settings,
  ChevronDown,
  FolderOpen,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { NavItem } from "./nav-item";

const menuItems = [
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Documents",
    path: "/documents",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    path: "/documents/settings",
  },
];

export function DocumentNavbar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleNavbar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">AskFile</span>
        </Link>
        <button
          onClick={toggleNavbar}
          className="p-1 rounded-md hover:bg-sidebar-accent/10"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>
      {collapsed && (
        <div
          onClick={toggleNavbar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
      <aside
        className={cn(
          "fixed bg-sidebar flex flex-col top-0 text-sidebar-foreground border-sidebar-border z-40",
          "transform transition-transform duration-500 ease-in-out",
          collapsed ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="flex flex-row items-center w-full p-3 h-16 border-b border-sidebar-border">
          <Link href="/" className="flex flex-row items-center gap-2 ">
            <FolderOpen className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">AskFile</span>
          </Link>
          <button
            onClick={toggleNavbar}
            className="ml-auto rounded-full hover:bg-sidebar-accent/10"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex py-4">
          <ul className="flex flex-col space-y-1 px-4 w-screen">
            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                toggleNavbar={toggleNavbar}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
