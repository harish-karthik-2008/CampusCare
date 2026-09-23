import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getUserFromRequest } from "../../../../../lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5 stars" },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.findFirst({
      where: { OR: [{ id }, { complaintNumber: id }] },
      include: { feedback: true },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    if (complaint.studentId !== user.id) {
      return NextResponse.json(
        { error: "Only the student who filed this complaint can submit feedback" },
        { status: 403 }
      );
    }

    const feedback = await prisma.feedback.upsert({
      where: { complaintId: complaint.id },
      update: {
        rating: Number(rating),
        comment: comment || null,
      },
      create: {
        complaintId: complaint.id,
        studentId: user.id,
        rating: Number(rating),
        comment: comment || null,
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
