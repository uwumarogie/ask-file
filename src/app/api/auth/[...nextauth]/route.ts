import { authOptions } from "@/auth/index";
import NextAuth from "next-auth";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
