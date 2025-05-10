"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Notfound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <Card className="max-w-md w-full shadow-lg border-muted">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-primary" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">404</h1>
              <h2 className="text-xl font-medium text-foreground/90">
                Page Not Found
              </h2>
              <p className="text-muted-foreground max-w-sm">
                The page you're looking for doesn't exist or has been moved to
                another location.
              </p>
            </div>

            <div className="py-2 px-4 bg-secondary/50 rounded-lg text-xs text-muted-foreground font-mono w-full overflow-hidden overflow-ellipsis">
              {pathname}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
