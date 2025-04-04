"use client";

import React from "react";
import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadZone } from "@/components/file-upload-zone";
import { Badge } from "@/components/ui/badge";
import { uploadFileAcrossServices } from "@/actions/upload-file-into-services";
import { createConversationStart } from "@/actions/create-conversation-start";
import { checkExistingFileName } from "@/actions/exist-file";

async function handleUpload(
  file: File | null,
  toast?: Function,
): Promise<string | undefined> {
  if (!file) {
    throw new Error("File does not exist");
  }
  try {
    const _context = await checkExistingFileName(file.name);
    const fileResponse = await _context.json();
    if (fileResponse.exist && toast) {
      toast({
        title: "File already exist",
        description: `Delete the current file ${file.name} in teh application or rename your uploaded file`,
        variant: "destructive",
      });
      return;
    }

    const _context_upload = await uploadFileAcrossServices(file);
    const response = await _context_upload?.json();

    if (!response.success) {
      throw new Error("Failed to upload file");
    }

    const fileData = response.fileData;
    if (!fileData) {
      throw new Error("Missing file data in the upload response");
    }

    const { userId, fileId, title } = fileData;
    if (!title) {
      throw new Error("Missing title in file data");
    }

    const _contextChatID = await createConversationStart(fileId, title, userId);
    const chatResponse = await _contextChatID.json();
    if (!chatResponse.success) {
      throw new Error("Failed to initialize chat entry");
    }

    return chatResponse.chatId;
  } catch (error) {
    console.error("Error uploading file", error);
  }
}

export function DocumentUpload() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Upload Documents</h1>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          <Upload className="mr-1 h-3 w-3" /> Upload Zone
        </Badge>
      </div>
      <Card className="mb-8 border-none shadow-md bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Add new documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Upload technical documentation in various formats for AI analysis
            and chat interaction. The system will process your documents and
            make them available for searching and answering questions.
          </p>

          <div className="mt-6">
            <FileUploadZone onFileUploaded={handleUpload} />
          </div>
          <div className="mt-8 bg-muted/40 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Supported file types:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-700 hover:bg-red-200"
              >
                .pdf
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-primary/5 to-secondary/20 p-6 rounded-lg border border-border/50">
        <h3 className="text-lg font-medium mb-2">Upload Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2 items-start">
            <div className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
              1
            </div>
            <span>
              Make sure your documents are properly formatted for best results
            </span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
              2
            </div>
            <span>Larger documents (over 10MB) may take longer to process</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
              3
            </div>
            <span>
              PDF files with searchable text work better than scanned documents
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
