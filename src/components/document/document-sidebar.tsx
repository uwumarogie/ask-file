"use client";

import React, { useState } from "react";
import { cn } from "@/util/cn";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";

type User = {
  name: string | null;
  email: string;
  image: string;
};

type DocuSidebar = {
  user: User;
};

export function DocumentSidebar({ user }: DocuSidebar) {
  const [collapsed, setCollapsed] = useState(false);
  const location = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Documents",
      path: "/documents",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Chat",
      path: "/documents/chat",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/documents/settings",
    },
  ];

  return (
    <div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center p-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">DocuMind</span>
          </div>
        )}
        {collapsed && <FolderOpen className="w-6 h-6 text-primary mx-auto" />}
        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded-full hover:bg-sidebar-accent/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/10",
                  location === item.path
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            {user.image ? (
              <Image
                src={user.image}
                alt="user"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <>U</>
            )}{" "}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-asidebar-foreground/60">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
