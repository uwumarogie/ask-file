"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/auth/client";
import Link from "next/link";
import { cn } from "@/util/tailwind";
import Image from "next/image";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);

  return (
    <Card className="max-w-md rounded-none">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl items-center justify-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await signIn.email({ email, password });
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
          </Button>

          <div
            className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col",
            )}
          >
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              onClick={async () => {
                await signIn.social({
                  provider: "google",
                  callbackURL: "/documents",
                });
              }}
            >
              <Image
                src="/auth/google.svg"
                alt="Google"
                width={24}
                height={24}
              />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              onClick={async () => {
                await signIn.social({
                  provider: "github",
                  callbackURL: "/documents",
                });
              }}
            >
              <Image
                src="/auth/github.svg"
                alt="GitHub"
                width={24}
                height={24}
              />
              Sign in with GitHub
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
