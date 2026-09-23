import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { getUserFromRequest } from "../../../../../../lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { assignedTeam, note } = body;

    if (!assignedTeam) {
      return NextResponse.json({ error: "Assigned team is required" }, { status: 400 });
    }

    const complaint = await prisma.complaint.findFirst({
      where: { OR: [{ id }, { complaintNumber: id }] },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    const newStatus = complaint.status === "PENDING" ? "IN_PROGRESS" : complaint.status;

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.complaint.update({
        where: { id: complaint.id },
        data: {
          assignedTeam,
          assignedAdminId: user.id,
          status: newStatus,
        },
      });

      await tx.resolutionLog.create({
        data: {
          complaintId: complaint.id,
          actorId: user.id,
          action: "ASSIGNED",
          note: note || `Assigned to ${assignedTeam} by Admin (${user.name})`,
        },
      });

      // Notify the student
      await tx.notification.create({
        data: {
          userId: complaint.studentId,
          complaintId: complaint.id,
          title: "Team Assigned to Your Issue",
          message: `${assignedTeam} has been assigned to investigate and resolve ${complaint.complaintNumber}.`,
        },
      });

      return c;
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error("Assignment error:", error);
    return NextResponse.json(
      { error: "Failed to assign complaint" },
      { status: 500 }
    );
  }
}
