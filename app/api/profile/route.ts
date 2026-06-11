import { NextResponse } from "next/server";
import { profile } from "@/data/profile";

// Profile data lives in data/profile.ts (shared with the server-rendered
// homepage). This endpoint serves it to the chatbot and external consumers.
export async function GET() {
  return NextResponse.json(profile);
}
