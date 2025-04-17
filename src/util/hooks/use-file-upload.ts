import React from "react";
import { useToast } from "@/util/hooks/use-toast";
import { uploadFileAcrossServices } from "@/db/relational/functions/files";

export function useFileUpload(file: File | null): string | undefined {
  const { toast } = useToast();
  const [chatId, setChatId] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!file) return;

    (async () => {
      try {
        // Check duplicate file name
        const existingRes = await fetch("/api/check-file-existance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name }),
        });

        const { exist } = await existingRes.json();

        if (exist) {
          toast({
            title: "File already exists",
            description: `Please delete the existing file '${file.name}' or rename your upload.`,
            variant: "destructive",
          });
          return;
        }

        // Upload file
        const uploadCtx = await uploadFileAcrossServices(file);
        const uploadJson = await uploadCtx?.json();
        if (!uploadJson?.success || !uploadJson.fileData) {
          throw new Error("Failed to upload file");
        }

        // Initialize chat
        const { fileId, title } = uploadJson.fileData;
        const chatRes = await fetch("/api/create-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId, title }),
        });

        const chatJson = await chatRes.json();
        if (!chatRes.ok || !chatJson.success) {
          throw new Error("Failed to initialize chat entry");
        }

        setChatId(chatJson.chatId);
      } catch (error: any) {
        console.error("Error uploading file:", error);
        toast({
          title: "Upload Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    })();
  }, [file, toast]);

  return chatId;
}
