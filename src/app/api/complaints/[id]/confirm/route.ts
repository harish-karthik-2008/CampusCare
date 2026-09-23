import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getUserFromRequest } from "../../../../../lib/auth";

export async function PATCH(
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
    const { action, note } = body; // action: "CONFIRM" | "REOPEN"

    const complaint = await prisma.complaint.findFirst({
      where: { OR: [{ id }, { complaintNumber: id }] },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    if (complaint.studentId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only the reporting student or an administrator can confirm resolution" },
        { status: 403 }
      );
    }

    if (action === "CONFIRM") {
      const updated = await prisma.$transaction(async (tx) => {
        const c = await tx.complaint.update({
          where: { id: complaint.id },
          data: {
            status: "CLOSED",
            closedAt: new Date(),
          },
        });

        await tx.resolutionLog.create({
          data: {
            complaintId: complaint.id,
            actorId: user.id,
            action: "CLOSED",
            note: note || "Student confirmed resolution of the issue.",
          },
        });

        // Notify assigned admin if present
        if (complaint.assignedAdminId) {
          await tx.notification.create({
            data: {
              userId: complaint.assignedAdminId,
              complaintId: complaint.id,
              title: "Complaint Closed & Confirmed",
              message: `Student confirmed resolution for ${complaint.complaintNumber}.`,
            },
          });
        }

        return c;
      });

      return NextResponse.json({ success: true, complaint: updated });
    } else if (action === "REOPEN") {
      const updated = await prisma.$transaction(async (tx) => {
        const c = await tx.complaint.update({
          where: { id: complaint.id },
          data: {
            status: "IN_PROGRESS",
            resolvedAt: null,
            closedAt: null,
          },
        });

        await tx.resolutionLog.create({
          data: {
            complaintId: complaint.id,
            actorId: user.id,
            action: "REOPENED",
            note: note || "Student indicated the issue has recurred or was not fully resolved.",
          },
        });

        if (complaint.assignedAdminId) {
          await tx.notification.create({
            data: {
              userId: complaint.assignedAdminId,
              complaintId: complaint.id,
              title: "Complaint Reopened by Student",
              message: `Student reported issue still persists for ${complaint.complaintNumber}.`,
            },
          });
        }

        return c;
      });

      return NextResponse.json({ success: true, complaint: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to update complaint status" },
      { status: 500 }
    );
  }
}
