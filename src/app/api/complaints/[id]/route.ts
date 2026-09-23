import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getUserFromRequest } from "../../../../lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const complaint = await prisma.complaint.findFirst({
      where: {
        OR: [{ id }, { complaintNumber: id }],
      },
      include: {
        category: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            department: true,
            avatar: true,
          },
        },
        assignedAdmin: {
          select: { id: true, name: true, email: true },
        },
        resolutionLogs: {
          include: {
            actor: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        feedback: true,
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // Role security: Student can only view their own complaint
    if (user.role === "STUDENT" && complaint.studentId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: Cannot view another student's complaint" },
        { status: 403 }
      );
    }

    return NextResponse.json({ complaint });
  } catch (error) {
    console.error("Error fetching complaint details:", error);
    return NextResponse.json(
      { error: "Failed to retrieve complaint details" },
      { status: 500 }
    );
  }
}
