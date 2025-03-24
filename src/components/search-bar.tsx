"use client";

import React, { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/util/cn";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = "Search documents...",
  className,
  showFilters = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-2xl group", className)}
    >
      <div
        className={cn(
          "flex items-center bg-secondary rounded-full border px-4 py-2 transition-all duration-200",
          isFocused
            ? "border-primary ring-1 ring-primary/20"
            : "border-transparent",
        )}
      >
        <Search className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-accent/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {showFilters && (
          <button
            type="button"
            className="ml-2 p-1.5 rounded-full hover:bg-accent/70 transition-colors"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="absolute inset-0 -z-10 rounded-full bg-accent/50 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
    </form>
  );
}
