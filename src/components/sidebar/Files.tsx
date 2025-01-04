"use client";
import React from "react";
import Link from "next/link";
import { File } from "@/util/use-user-files";
import Image from "next/image";


function removeExtension(fileName: string) {
    if (fileName.length === 0) {
        throw new Error("File name is empty");
    }
    return fileName.split(".")[0];
}


//FIX: On double click, let the user change the file name
export default function Files({
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
