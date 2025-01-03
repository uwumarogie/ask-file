"use client";
import React from "react";
import clsx from "clsx";
import { useUser } from "@clerk/nextjs";
import { useUserFile } from "@/util/use-user-files";
import Link from "next/link";
import { File } from "@/util/use-user-files";
import Image from "next/image";
import { redirect } from "next/navigation";
import { updateFileName } from "@/actions/update-file-name";

function removeExtension(fileName: string) {
  if (fileName.length === 0) {
    throw new Error("File name is empty");
  }
  return fileName.split(".")[0];
}

export function SideBar() {
  const [isOpen, setIsOpen] = React.useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sideNavbarIsOpen");
      return savedState === "true" ? true : false;
    }
    return false;
  });
  const { user } = useUser();
  const { files, isLoading, hasError } = useUserFile(user?.id);
  React.useEffect(() => {
    localStorage.setItem("sideNavbarIsOpen", isOpen.toString());
  }, [isOpen]);

  //FIX: display error to the user
  async function onRename(fileId: string, newFileName: string) {
    if (fileId && newFileName) {
      const response = await updateFileName(fileId, newFileName);
    }
  }
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
      {isOpen && (
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
            <Files
              files={files}
              isLoading={isLoading}
              hasError={hasError}
              onRename={onRename}
            />
          </ul>
        </div>
      )}
    </aside>
  );
}

function Files({
  files,
  isLoading,
  hasError,
  onRename,
}: {
  files: File[];
  isLoading: boolean;
  hasError: boolean;
  onRename: (fileId: string, newFileName: string) => void;
}) {
  const [editingFileId, setEditingFileId] = React.useState<string | null>(null);
  const [newFileName, setNewFileName] = React.useState("");

  function handleDobleClick(file: File) {
    setEditingFileId(file.file_id);
    setNewFileName(file.file_name);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewFileName(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, file: File) {
    if (e.key === "Enter") {
      const trimmedFileName = newFileName.trim();
      if (trimmedFileName) {
        onRename(file.file_id, trimmedFileName);
        setEditingFileId(null);
      }
    } else if (e.key === "Escape") {
      setEditingFileId(null);
    }
  }

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
            {editingFileId === file.file_id ? (
              <input
                type="text"
                name="file_name"
                value={newFileName}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, file)}
                autoFocus
                className="border border-gray-300 rounded-xl px-2 py-px text-black"
              />
            ) : (
              <Link
                href={removeExtension(file.file_name)}
                onDoubleClick={() => handleDobleClick(file)}
              >
                {file.file_name}
              </Link>
            )}
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
