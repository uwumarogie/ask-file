import React from "react";
import { cn } from "@/util/tailwind";
import {
  FileText,
  Clock,
  MoreVertical,
  Star,
  ExternalLink,
} from "lucide-react";
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

function getFileIcon(fileType: string | undefined) {
  if (!fileType) {
    return <FileText className="w-8 h-8 text-gray-500" />;
  }
  if (fileType.toLowerCase() === "pdf") {
    return <FileText className="w-8 h-8 text-red-500" />;
  }

  if (fileType.toLowerCase() === "doc" || fileType.toLowerCase() === "docx") {
    return <FileText className="w-8 h-8 text-blue-500" />;
  }

  if (fileType.toLowerCase() === "md") {
    return <FileText className="w-8 h-8 text-green-500" />;
  }

  return <FileText className="w-8 h-8 text-gray-500" />;
}

export function DocumentCard({
  id,
  title,
  fileType,
  createdAt,
  isFavorite = false,
  thumbnailUrl,
  className,
}: DocumentCardProps) {
  const [hasClicked, setHasClicked] = React.useState(false);
  return (
    <div
      className={cn(
        "group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300",
        "hover:border-primary/20 hover:-translate-y-1",
        className,
      )}
    >
      <div className="absolute top-2 right-2 z-10 flex space-x-1">
        {isFavorite && (
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </span>
        )}
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            setHasClicked((prev) => !prev);
          }}
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        {hasClicked && <button>Hello World {id}</button>}
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
            {getFileIcon(fileType)}
          </div>
        )}
      </div>
      <div className="flex flex-col p-4 flex-grow">
        <h3 className="font-medium text-sm line-clamp-2 mb-2">{title}</h3>
        <div className="mt-auto flex flex-row items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3 text-black" />
          <span className="text-black">{format(createdAt, "MMM d, yyyy")}</span>
          <Link
            className="flex flex-row items-center space-x-3"
            href={`documents/chat/${id}`}
          >
            <ExternalLink className="text-black scale-75" />
          </Link>
        </div>
      </div>
    </div>
  );
}
