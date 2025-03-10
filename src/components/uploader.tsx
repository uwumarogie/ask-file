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
  const router = useRouter();
  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 25 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  React.useEffect(() => {
    (async () => {
      if (file) {
        const _context = await insertFileData(file);
        const data = responseSchema.parse(_context);
        router.push(`/c/${data.response}`);
      }
    })();
  }, [file, router]);

  function onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }

  //NOTE: Check if the file with the same name is already in the database.
  // Let the user choose either to overwrite or keep the old file or rename the new file to another name.
  // Additional note: AWS S3 overrides the file name if the same name is already in the bucket.
  return (
    <div className="flex flex-col space-y-3">
      <form
        {...getRootProps()}
        className={clsx(
          "flex flex-col items-center justify-center border-4 border-dashed lg:p-56 p-52" +
            "cursor-pointer rounded-2xl transition-colors duration-200",
          isDragActive
            ? "border-green-400"
            : isDragReject
              ? "border-red-400"
              : "border-white",
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
        <label htmlFor="file" className=" space-x-10 font-bold">
          <p className="font-bold">
            {isDragActive ? (
              "Drop the file here..."
            ) : (
              <span className="text-white">
                Drag and Drop file here or{" "}
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
        <div className="flex flex-row justify-between text-white">
          <span>Supported format: PDF</span>
          <span>Max file size: 25MB</span>
        </div>
      )}
    </div>
  );
}
