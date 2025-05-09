import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border">
      <div className="container flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-medium">AskFile</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AskFile. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
