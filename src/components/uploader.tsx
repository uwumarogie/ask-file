"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import { uploadFileAcrossServices } from "@/actions/upload-file-into-services";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { checkExistingFileName } from "@/actions/check-existence-of-file";
import * as z from "zod";
import { sanitizeFileName } from "@/util/file-modification/util";
import { FileExistsModal } from "@/components/file-exists-modal";

const responseSchema = z.object({
  success: z.boolean(),
  filePath: z.string().uuid(),
});

// NOTE: this component needs a way to show the user when the upload is complete
export function Uploader({ userId }: { userId: string | undefined }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [fileAlreadyExists, setFileAlreadyExists] = React.useState(false);
  const router = useRouter();

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) {
        throw new Error("File does not exist");
      }
      const sanitizedFileName = sanitizeFileName(file.name);
      const { response: exists } =
        await checkExistingFileName(sanitizedFileName);
      if (!exists) {
        const _context = await uploadFileAcrossServices(file);
        const data = responseSchema.parse(_context);
        if (!data.success) {
          throw new Error("Failed to upload file");
        } else {
          router.push(`/c/${data.filePath}`);
        }
      }
      setFileAlreadyExists(exists);
    },
    [router],
  );

  React.useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file, handleUpload]);

  function onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }

  function selectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 25 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className="flex flex-col space-y-3">
      {fileAlreadyExists && file && userId && (
        <FileExistsModal
          file={file}
          onClose={() => setFileAlreadyExists(false)}
          userId={userId}
        />
      )}
      <div
        {...getRootProps()}
        className={clsx(
          "flex flex-col items-center justify-center border-4 border-dashed lg:p-56 p-52" +
            "cursor-pointer rounded-2xl transition-colors duration-200",
          {
            "border-green-400": isDragActive,
            "border-red-400": isDragReject,
            "border-white": !isDragActive && !isDragReject,
          },
        )}
      >
        <input
          {...getInputProps()}
          name="file"
          type="file"
          id="file"
          onChange={selectFile}
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
      </div>

      {!file && (
        <div className="flex flex-row justify-between text-white">
          <span>Supported format: PDF</span>
          <span>Max file size: 25MB</span>
        </div>
      )}
    </div>
  );
}
