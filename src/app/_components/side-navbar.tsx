"use client";
import React from "react";
import clsx from "clsx";
import { useUser } from "@clerk/nextjs";
import { useUserFile } from "@/util/use-user-files";
import Link from "next/link";
import { File } from "@/util/use-user-files";
import Image from "next/image";
import { redirect } from "next/navigation";

function removeExtension(fileName: string) {
  if (fileName.length === 0) {
    throw new Error("File name is empty");
  }
  return fileName.split(".")[0];
}

export function SideBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();

  const { files, isLoading, hasError } = useUserFile(user?.id);

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 z-40 w-72 h-screen bg-black text-white transition-transform -translate-x-full sm:translate-x-0",
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
        <button onClick={() => setIsOpen((prev) => !prev)} className="p-5">
          <Image
            className="dark:invert"
            src="/icons/move-sidebar-icon.svg"
            alt="Move sidebar icon"
            width={24}
            height={24}
          />
        </button>

        <button className="p-5" onClick={() => redirect("/")}>
          <Image
            className="dark:invert"
            src="/icons/create-new-file-icon.svg"
            alt="Move sidebar icon"
            width={24}
            height={24}
          />
        </button>
      </div>

      <div className="h-full px-2 py-5 overflow-y-auto">
        <ul className="space-y-6 font-medium flex flex-col">
          <div className="flex flex-row justify-between items-center p-2 h-10 group">
            <span className="text-sm font-bold">Projects</span>
            <button onClick={() => redirect("/")} className="p-5">
              <Image
                className="dark:invert  hidden group-hover:block"
                src="/icons/add-icon.svg"
                alt="Move sidebar icon"
                width={24}
                height={24}
              />
            </button>
          </div>
          <Files files={files} isLoading={isLoading} hasError={hasError} />
        </ul>
      </div>
    </aside>
  );
}

//FIX: On double click, let the user change the file name
function Files({
  files,
  isLoading,
  hasError,
}: {
  files: File[];
  isLoading: boolean;
  hasError: boolean;
}) {
  return (
    <React.Fragment>
      {isLoading && <li>Loading files...</li>}
      {hasError && <li>Error loading files.</li>}
      {!isLoading && !hasError && files.length === 0 && (
        <li>No files found.</li>
      )}
      {!isLoading &&
        !hasError &&
        files.map((file) => (
          <span
            key={file.file_id}
            className="flex p-1 hover:bg-gray-900 hover:rounded-xl cursor-pointer justify-between"
          >
            <Link href={removeExtension(file.file_name)}>{file.file_name}</Link>
            <button className="relative group inline-block">
              <span className="absolute bottom-7 -right-1 text-white bg-gray-800 border-2 border-gray-500 p-2 rounded-xl shadow-2xl hidden group-hover:block z-50">
                Options
              </span>
              <Image
                className="dark:invert"
                src="/icons/option-icon.svg"
                alt="Option icon"
                width={24}
                height={24}
              />
            </button>
          </span>
        ))}
    </React.Fragment>
  );
}
