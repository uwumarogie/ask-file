"use client";

import React, { useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { DocumentCard, DocumentCardProps } from "./document-card";
import { SlidersHorizontal, Plus, Grid, List, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const mockDocuments: Omit<DocumentCardProps, "onClick">[] = [
  {
    id: "1",
    title: "Technical Specification v1.0",
    fileType: "pdf",
    tags: ["specification", "v1.0"],
    createdAt: new Date("2023-10-15"),
    isFavorite: true,
  },
  {
    id: "2",
    title: "API Documentation",
    fileType: "md",
    tags: ["api", "reference"],
    createdAt: new Date("2023-11-02"),
    isFavorite: false,
  },
  {
    id: "3",
    title: "User Manual Draft",
    fileType: "docx",
    tags: ["manual", "draft"],
    createdAt: new Date("2023-09-28"),
    isFavorite: false,
  },
  {
    id: "4",
    title: "System Architecture Overview",
    fileType: "pdf",
    tags: ["architecture", "system"],
    createdAt: new Date("2023-10-05"),
    isFavorite: true,
  },
  {
    id: "5",
    title: "Project Requirements Document",
    fileType: "pdf",
    tags: ["requirements", "project"],
    createdAt: new Date("2023-08-20"),
    isFavorite: false,
  },
  {
    id: "6",
    title: "Code Standards Guide",
    fileType: "md",
    tags: ["code", "standards"],
    createdAt: new Date("2023-09-10"),
    isFavorite: false,
  },
];

export function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(searchQuery);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredDocs, setFilteredDocs] = useState(mockDocuments);

  const router = useRouter();
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredDocs(mockDocuments);
      return;
    }

    const filtered = mockDocuments.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags?.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase()),
        ),
    );

    setFilteredDocs(filtered);
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-medium">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage and search your technical documents
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button onClick={() => router.push("/documents/upload")}>
            <Plus className="w-4 h-4 mr-2" />
            Upload New
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by title, content, or tags..."
          showFilters={true}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-l-md"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-r-md"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No documents found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t find any documents matching your search criteria.
            Try adjusting your filters or upload new documents.
          </p>
          <Button className="mt-4" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              {...doc}
              onClick={() => console.log(`Clicked document ${doc.id}`)}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center border rounded-lg p-3 gap-4 hover:border-primary/20 hover:bg-accent/10 transition-colors cursor-pointer"
              onClick={() => console.log(`Clicked document ${doc.id}`)}
            >
              <div className="w-10 h-10 flex-shrink-0 bg-secondary rounded-md flex items-center justify-center">
                {doc.fileType === "pdf" ? (
                  <div className="w-6 h-6 text-red-500">
                    <FileText className="w-full h-full" />
                  </div>
                ) : doc.fileType === "md" ? (
                  <div className="w-6 h-6 text-green-500">
                    <FileText className="w-full h-full" />
                  </div>
                ) : (
                  <div className="w-6 h-6 text-blue-500">
                    <FileText className="w-full h-full" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{doc.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Created: {doc.createdAt.toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{doc.fileType}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 justify-end">
                {doc.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
