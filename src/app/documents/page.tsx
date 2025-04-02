
import React from "react";
import { Documents } from "@/components/document";
export type DocumentCardProps = {
  id: string;
  title: string;
  fileType: string;
  createdAt: Date;
  isFavorite?: boolean;
  thumbnailUrl?: string;
  className?: string;
};
const mockDocuments: Omit<DocumentCardProps, "onClick">[] = [
  {
    id: "1",
    title: "Technical Specification v1.0",
    fileType: "PDF",
    createdAt: new Date("2023-10-15"),
    isFavorite: true,
  },

  {
    id: "2",
    title: "System Architecture Overview",
    fileType: "PDF",
    createdAt: new Date("2023-10-05"),
    isFavorite: true,
  },
  {
    id: "3",
    title: "Project Requirements Document",
    fileType: "PDF",
    createdAt: new Date("2023-08-20"),
    isFavorite: false,
  },
];

export default function DocumentPage() {







  return <Documents />;
}
