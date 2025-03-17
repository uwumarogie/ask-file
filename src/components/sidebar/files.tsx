"use client";
import React from "react";
import Link from "next/link";
import { File } from "@/util/hooks/use-user-files";
import Image from "next/image";
import { renameFile } from "@/actions/rename-file-in-the-layout";
import { useRouter } from "next/navigation";
type FileProps = {
  files: File[];
  isLoading: boolean;
  hasError: boolean;
  userId?: string;
};

//NOTE: On double click, let the user change the file name
export default function Files({
  files,
  isLoading,
  hasError,
  userId,
}: FileProps) {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [fileName, setFileName] = React.useState("");

  const router = useRouter();
  async function handleDoubleClick(file: File) {
    const response = await renameFile(fileName, file.file_id, userId);
    if (response.success) {
      setIsEditingName(false);
      router.refresh();
    }
    router.refresh();
  }

  return (
    <React.Fragment>
      {isLoading && <li>Loading files...</li>}
      {hasError && files.length === 0 && (
        <li>Upload a file after clicking on the pen</li>
      )}
      {!isLoading && !hasError && files.length === 0 && (
        <li>No files found.</li>
      )}
      {!isLoading &&
        !hasError &&
        files.map((file) => (
          <Link
            key={file.file_id}
            href={`/c/${file.file_id}`}
            className="flex p-1 hover:bg-gray-800 hover:rounded-xl cursor-pointer justify-between"
            onDoubleClick={() => {
              setIsEditingName(true);
            }}
          >
            {isEditingName ? (
              <form className="flex flex-col spac-x-5">
                <input
                  type="text"
                  onChange={(e) => setFileName(e.target.value)}
                  defaultValue={file.file_description}
                  className="w-full bg-gray-800 text-white rounded-xl p-2 outline-none"
                />
                <button
                  onClick={async () => await handleDoubleClick(file)}
                  className="hover:bg-gray-500"
                >
                  Save
                </button>
              </form>
            ) : (
              <span>{file.file_description}</span>
            )}

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
