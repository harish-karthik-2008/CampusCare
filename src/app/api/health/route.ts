import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    const cleanMessage = message.replace(/postgresql:\/\/[^@]+@/g, "postgresql://[REDACTED]@");
    return NextResponse.json(
      {
        status: "error",
        message: cleanMessage,
      },
      { status: 500 }
    );
  }
}
