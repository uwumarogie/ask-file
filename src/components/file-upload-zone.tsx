import React, { useState, useCallback } from "react";
import { Upload, File, FileText, X } from "lucide-react";
import { cn } from "@/util/cn";
import { useToast } from "@/util/hooks/use-toast";

interface FileUploadZoneProps {
  onFilesUploaded?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
}

export function FileUploadZone({
  onFilesUploaded,
  accept = ".pdf,.md,.txt,.doc,.docx",
  multiple = true,
  maxSize = 10, // Default 10MB
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
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
  };

  const processFiles = (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(validateFile);

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(newFiles);

      if (onFilesUploaded) {
        onFilesUploaded(newFiles);
      }

      toast({
        title: "Files uploaded",
        description: `${validFiles.length} file(s) successfully uploaded`,
      });
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [files, multiple, onFilesUploaded],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    if (onFilesUploaded) {
      onFilesUploaded(newFiles);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-blue-500" />;
      case "md":
        return <FileText className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-8 transition-all duration-200 bg-secondary/40",
          isDragging
            ? "border-primary bg-accent scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-secondary/70",
          files.length > 0 && "border-primary/40 bg-accent/40",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-accent flex items-center justify-center animate-float">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Upload your documents</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Drag and drop your files here, or click to browse. Supports PDF,
            Markdown, and text documents up to {maxSize}MB.
          </p>
          <label
            htmlFor="fileInput"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors 
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 
            bg-primary text-primary-foreground shadow hover:bg-primary/90 cursor-pointer"
          >
            Browse Files
            <input
              id="fileInput"
              type="file"
              className="hidden"
              multiple={multiple}
              accept={accept}
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            Uploaded Files ({files.length})
          </h4>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-card shadow-subtle p-3 rounded-lg animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.name)}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
