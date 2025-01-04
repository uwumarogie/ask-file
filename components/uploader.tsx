"use client";
import React from "react";
import Image from "next/image";
import { insertUserAndFileData } from "@/actions/upload-file";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { redirect } from "next/navigation";
import * as z from "zod";

const responseSchema = z.object({
  success: z.boolean(),
  response: z.string(),
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

  function onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }

  async function handleSubmit() {
    if (file) {
      const _context = await insertUserAndFileData(file);
      const data = responseSchema.parse(_context);
      redirect(`/${data.response}`);
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <form
        {...getRootProps()}
        className={clsx(
          "flex flex-col items-center justify-center border-4 border-dashed p-32 lg:p-40 cursor-pointer rounded-2xl transition-colors duration-200",
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
      {file && <DisplayFile file={file} />}
      {file && (
        <button
          className="p-4 rounded-2xl border-4 border-gray-800 hover:bg-gray-400 text-black text-xl font-bold hover:border-0"
          onClick={handleSubmit}
        >
          Upload File
        </button>
      )}
    </div>
  );
}

function extractFileType(fileType: string) {
  if (fileType.length === 0) {
    return "unknown";
  }
  if (fileType.includes("pdf")) {
    return "pdf";
  }
}

function deleteFile(fileName: string) {
  console.log(fileName);
}
export function DisplayFile({ file }: { file: File }) {
  const fileType = extractFileType(file.type);
  return (
    <div className="flex flex-col space-y-5 border-4 border-dashed border-black rounded-2xl text-black p-4">
      <div className="flex flex-row relative">
        <div className="flex flex-row space-x-3 iitems-center">
          <FileImage fileType={fileType} />
          <div className="flex flex-col space-y-5">
            <p className="font-semibold text-lg">{file.name}</p>
            <p className="text-gray-800">
              {Math.round(file.size / 1_000_000)} MB
            </p>
          </div>
        </div>
        <button
          onClick={() => deleteFile(file.name)}
          className="top-6 absolute right-0 bottom-96"
        >
          <Image
            src="/icons/delete-file-icon.svg"
            alt="Trash icon"
            width={24}
            height={24}
          />
        </button>
      </div>
      <progress value={0.5} className="flex rounded-xl" />
    </div>
  );
}
function FileImage({ fileType }: { fileType?: string }) {
  return (
    <Image
      src={`/icons/files/${fileType}-file-icon.jpg`}
      alt="Upload file icon"
      width={100}
      height={100}
    />
  );
}
