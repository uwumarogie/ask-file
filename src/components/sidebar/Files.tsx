"use client";
import React from "react";
import Link from "next/link";
import { File } from "@/util/hooks/use-user-files";
import Image from "next/image";
import { useSideBarStore } from "@/util/hooks/use-sidebar-store";

type FileProps = {
  files: File[];
  isLoading: boolean;
  hasError: boolean;
};

//NOTE: On double click, let the user change the file name
export default function Files({ files, isLoading, hasError }: FileProps) {
  const { toggle } = useSideBarStore((state) => state);

  return (
    <React.Fragment>
      {isLoading && <li>Loading files...</li>}
      {hasError && files.length === 0 && (
        <li>Click on the pen to upload a file</li>
      )}
      {hasError && <li>Error loading files</li>}
      {!isLoading && !hasError && files.length === 0 && (
        <li>No files found.</li>
      )}
      {!isLoading &&
        !hasError &&
        files.map((file) => (
          <Link
            key={file.file_id}
            href={`/c/${file.file_id}`}
            onClick={toggle}
            className="flex p-1 hover:bg-gray-800 hover:rounded-xl cursor-pointer justify-between"
          >
            <span>{file.file_name}</span>
            <button className="relative group inline-block">
              <span
                className="absolute bottom-7 -right-1 text-white bg-gray-800 border-2
	      border-gray-500 p-2 rounded-xl shadow-2xl hidden group-hover:block z-50"
              >
                Options
              </span>

              <Image
                src="/icons/option-icon.svg"
                alt="Option icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </button>
          </Link>
        ))}
    </React.Fragment>
  );
}
