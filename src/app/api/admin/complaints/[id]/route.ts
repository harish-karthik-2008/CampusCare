import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getUserFromRequest } from "../../../../../lib/auth";

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
    const { status, resolutionNote, priority, internalNote } = body;

    const complaint = await prisma.complaint.findFirst({
      where: { OR: [{ id }, { complaintNumber: id }] },
      include: { student: true },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Do not allow edits to closed complaints except reopening by admin
    if (complaint.status === "CLOSED" && status === "CLOSED") {
      return NextResponse.json(
        { error: "Complaint is already closed and read-only" },
        { status: 400 }
      );
    }

    // Enforcement: If marking as RESOLVED, resolutionNote is strictly mandatory!
    if (status === "RESOLVED") {
      if (!resolutionNote || resolutionNote.trim().length < 5) {
        return NextResponse.json(
          {
            error:
              "Resolution note is mandatory when marking a complaint as RESOLVED. Please detail the action taken.",
          },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (resolutionNote) updateData.resolutionNote = resolutionNote.trim();

    if (status === "RESOLVED") {
      updateData.resolvedAt = new Date();
    } else if (status === "CLOSED") {
      updateData.closedAt = new Date();
    } else if (status === "IN_PROGRESS" && complaint.status === "RESOLVED") {
      // Reopening back to in progress
      updateData.resolvedAt = null;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.complaint.update({
        where: { id: complaint.id },
        data: updateData,
        include: {
          category: true,
          student: true,
          resolutionLogs: true,
        },
      });

      // Add audit log
      const actionType =
        status === "RESOLVED"
          ? "RESOLVED"
          : status === "CLOSED"
          ? "CLOSED"
          : status === "IN_PROGRESS"
          ? "STATUS_CHANGE"
          : "UPDATED";

      const noteText =
        status === "RESOLVED"
          ? `Issue marked RESOLVED: ${resolutionNote}`
          : internalNote || `Status changed from ${complaint.status} to ${status}`;

      await tx.resolutionLog.create({
        data: {
          complaintId: complaint.id,
          actorId: user.id,
          action: actionType,
          note: noteText,
        },
      });

      // Notify student of status update
      await tx.notification.create({
        data: {
          userId: complaint.studentId,
          complaintId: complaint.id,
          title:
            status === "RESOLVED"
              ? "Complaint Resolved! Action Needed"
              : `Complaint Status: ${status}`,
          message:
            status === "RESOLVED"
              ? `Your issue ${complaint.complaintNumber} has been marked as resolved: "${resolutionNote}". Please verify and confirm.`
              : `Status for ${complaint.complaintNumber} updated to ${status}.`,
        },
      });

      return c;
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error("Admin update error:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
