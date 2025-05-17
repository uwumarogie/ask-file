import React from "react";
import { Documents } from "@/components/document";
import { dbGetFiles } from "@/db/relational/functions/files";

export type DocumentCardProps = {
  id: string;
  title: string;
  fileType: string;
  createdAt: Date;
  isFavorite?: boolean;
  thumbnailUrl?: string;
  className?: string;
};

export default async function DocumentPage() {
  const _context = await dbGetFiles();
  return <Documents documents={_context.documents} />;
}
