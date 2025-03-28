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
          "flex flex-col items-center justify-center transition-all ease-out duration-700 border-2 border-black lg:p-56 p-52" +
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

        <div className="flex flex-col space-y-8 items-center justify-center">
          <Image
            src="/icons/upload-file-icon.svg"
            alt="Upload file icon"
            width={70}
            height={70}
          />
          <label
            htmlFor="file"
            className="flex flex-col space-y-4 items-center justify-center"
          >
            <p className="font-bold">Upload your Document</p>
            <p className="font-thin text-black text-center">
              Drag and drop your text document, PDF, or Markdown file, or click
              to browse your files.
            </p>
            {isDragReject && (
              <p className="text-red-500 mt-2">
                Unsupported file type or size.
              </p>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
