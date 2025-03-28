import React from "react";
import { cn } from "@/util/cn";
import { FileText, Clock, Tag, MoreVertical, Star } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export interface DocumentCardProps {
  id: string;
  title: string;
  fileType: string;
  tags?: string[];
  createdAt: Date;
  isFavorite?: boolean;
  thumbnailUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function DocumentCard({
  id,
  title,
  fileType,
  tags = [],
  createdAt,
  isFavorite = false,
  thumbnailUrl,
  onClick,
  className,
}: DocumentCardProps) {
  const getFileIcon = () => {
    switch (fileType.toLowerCase()) {
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
    <div
      className={cn(
        "group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300",
        "hover:border-primary/20 hover:-translate-y-1",
        className,
      )}
      id={id}
      onClick={onClick}
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

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-secondary
                text-secondary-foreground"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span
                className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-secondary
              text-secondary-foreground"
              >
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
