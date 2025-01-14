"use client";
import React from "react";
import Image from "next/image";
import { insertFileData } from "@/actions/upload-file";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import * as z from "zod";

const responseSchema = z.object({
  success: z.boolean(),
  response: z.string().uuid(),
});

export function Uploader() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 25 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (file) {
        const _context = await insertFileData(file);
        const data = responseSchema.parse(_context);
        router.push(`/c/${data.response}`);
      }
    })();
  }, [file]);

  function onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <form
        {...getRootProps()}
        className={clsx(
          "flex flex-col items-center justify-center border-4 border-dashed p-32 lg:p-40" +
            "cursor-pointer rounded-2xl transition-colors duration-200",
          isDragActive
            ? "border-green-400"
            : isDragReject
              ? "border-red-400"
              : "border-gray-800",
        )}
      >
        <input
          {...getInputProps()}
          name="file"
          type="file"
          id="file"
          onChange={(e) => {
            if (e.target?.files) {
              setFile(e.target?.files[0]);
            }
          }}
          accept=".pdf"
          className="hidden"
        />
        <Image
          src="/icons/upload-file-icon.svg"
          alt="Upload file icon"
          width={70}
          height={70}
        />
        <label
          htmlFor="file"
          className="border-4 border-dashed border-white space-x-10 font-bold"
        >
          <p className="font-bold">
            {isDragActive ? (
              "Drop the file here..."
            ) : (
              <span>
                Drag an Drop file here or{" "}
                <span className="underline text-blue-500">Choose file</span>
              </span>
            )}
          </p>
          {isDragReject && (
            <p className="text-red-500 mt-2">Unsupported file type or size.</p>
          )}
        </label>
      </form>
      {!file && (
        <div className="flex flex-row justify-between text-gray-700">
          <span>Supported format: PDF</span>
          <span>Max file size: 25MB</span>
        </div>
      )}
    </div>
  );
}
