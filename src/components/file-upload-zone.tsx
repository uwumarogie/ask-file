"use client";

import React, { useState, useCallback } from "react";
import { Upload, File, FileText, X } from "lucide-react";
import { cn } from "@/util/tailwind/cn";
import { Toast, ToasterToast, useToast } from "@/util/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type FileUploadZoneProps = {
  onFileUploaded?: (
    file: File | null,
    toast?: ({ ...props }: Toast) => {
      id: string;
      dismiss: () => void;
      update: (props: ToasterToast) => void;
    },
  ) => Promise<string | undefined> | void;
  accept?: string;
  maxSize?: number;
};

export function FileUploadZone({
  onFileUploaded,
  accept = ".pdf",
  maxSize = 10, // Default 10MB
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback(
    (file: File) => {
      // Check file size (convert maxSize from MB to bytes)
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum size of ${maxSize}MB`,
          variant: "destructive",
        });
        return false;
      }

      // Check file type based on accept prop
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const acceptedTypes = accept.split(",");

      if (
        !acceptedTypes.some(
          (type) => type === fileExtension || type === file.type,
        )
      ) {
        toast({
          title: "Unsupported file format",
          description: `${file.name} is not a supported document type`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    },
    [accept, maxSize, toast],
  );

  const processFile = useCallback(
    (fileList: FileList) => {
      if (fileList.length === 0) return;
      const selectedFile = fileList[0];

      if (validateFile(selectedFile)) {
        setFile(selectedFile);

        if (onFileUploaded) {
          onFileUploaded(selectedFile, toast);
        }

        toast({
          title: "File uploaded",
          description: `${selectedFile.name} successfully uploaded`,
        });
      }
    },
    [onFileUploaded, toast, validateFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files);
      }
    },
    [processFile],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (onFileUploaded) {
      onFileUploaded(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {!file ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-8 transition-all duration-200 bg-secondary/40",
            isDragging
              ? "border-primary bg-accent scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-secondary/70",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-accent flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Upload a document</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Drag and drop your file here, or click to browse. Supports PDF,
              Markdown, and text documents up to {maxSize}MB.
            </p>
            <Input
              id="fileInput"
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileInput}
            />
            <Button
              variant="default"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card shadow-md p-6 rounded-lg animate-fade-in border border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium mb-4">Selected File</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setFile(null)}
            >
              Change file
            </Button>
          </div>

          <div className="flex items-center justify-between bg-accent/30 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              {getFileIcon(file.name)}
              <div className="flex flex-col">
                <span className="font-medium truncate max-w-[200px] md:max-w-[300px]">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground flex">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              className="w-full sm:w-auto"
              disabled={!file}
              onClick={async () => {
                if (onFileUploaded) {
                  const chatId = await onFileUploaded(file);
                  router.push(`/documents/chat/${chatId}`);
                }
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Process Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

