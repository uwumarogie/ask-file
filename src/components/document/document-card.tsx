import React from "react";
import { cn } from "@/util/tailwind";
import { FileText, Clock, MoreVertical, Star } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export type DocumentCardProps = {
  id: string;
  title: string;
  fileType?: string;
  createdAt: Date;
  isFavorite?: boolean;
  thumbnailUrl?: string;
  className?: string;
};

export function DocumentCard({
  id,
  title,
  fileType,
  createdAt,
  isFavorite = false,
  thumbnailUrl,
  className,
}: DocumentCardProps) {
  const getFileIcon = () => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-blue-500" />;
      case "md":
        return <FileText className="w-8 h-8 text-green-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <Link
      className={cn(
        "group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300",
        "hover:border-primary/20 hover:-translate-y-1",
        className,
      )}
      href={`/documents/chat/${id}`}
    >
      <div className="absolute top-2 right-2 z-10 flex space-x-1">
        {isFavorite && (
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </span>
        )}
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="w-full aspect-[3/2] bg-secondary flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            width={1000}
            height={1000}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-accent/50">
            {getFileIcon()}
          </div>
        )}
      </div>

      <div className="flex flex-col p-4 flex-grow">
        <h3 className="font-medium text-sm line-clamp-2 mb-2">{title}</h3>

        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{format(createdAt, "MMM d, yyyy")}</span>
        </div>
      </div>
    </Link>
  );
}
