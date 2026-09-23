import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUserFromRequest } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const where: any = {};

    // If student, restrict to own complaints
    if (user.role === "STUDENT") {
      where.studentId = user.id;
    }

    if (status && status !== "ALL") {
      where.status = status.toUpperCase();
    }

    if (category && category !== "ALL") {
      where.category = { name: category };
    }

    if (priority && priority !== "ALL") {
      where.priority = priority.toUpperCase();
    }

    if (search) {
      where.OR = [
        { complaintNumber: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
        { locationBuilding: { contains: search } },
      ];
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        category: true,
        student: {
          select: { id: true, name: true, email: true, department: true, avatar: true },
        },
        assignedAdmin: {
          select: { id: true, name: true, email: true },
        },
        feedback: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      categoryId,
      title,
      description,
      locationBuilding,
      locationBlock,
      locationRoom,
      priority = "NORMAL",
      attachmentUrl,
    } = body;

    // Server-side validation
    if (!categoryId || !title || !description || !locationBuilding) {
      return NextResponse.json(
        { error: "Category, title, description, and building are required" },
        { status: 400 }
      );
    }

    if (title.trim().length < 5) {
      return NextResponse.json(
        { error: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (description.trim().length < 15) {
      return NextResponse.json(
        { error: "Description must provide at least 15 characters of detail" },
        { status: 400 }
      );
    }

    // Calculate maximum existing CC-XXXX number to guarantee uniqueness
    const allComplaints = await prisma.complaint.findMany({
      select: { complaintNumber: true },
    });

    let maxNumber = 1000;
    for (const c of allComplaints) {
      if (c.complaintNumber && c.complaintNumber.startsWith("CC-")) {
        const val = parseInt(c.complaintNumber.replace("CC-", ""), 10);
        if (!isNaN(val) && val > maxNumber) {
          maxNumber = val;
        }
      }
    }

    const complaintNumber = `CC-${maxNumber + 1}`;

    // Create complaint in transaction with initial resolution log & admin notifications
    const complaint = await prisma.$transaction(async (tx) => {
      const created = await tx.complaint.create({
        data: {
          complaintNumber,
          studentId: user.id,
          categoryId,
          title: title.trim(),
          description: description.trim(),
          locationBuilding: locationBuilding.trim(),
          locationBlock: locationBlock ? locationBlock.trim() : null,
          locationRoom: locationRoom ? locationRoom.trim() : null,
          priority: priority.toUpperCase(),
          status: "PENDING",
          attachmentUrl: attachmentUrl || null,
        },
        include: {
          category: true,
          student: true,
        },
      });

      // Audit log entry
      await tx.resolutionLog.create({
        data: {
          complaintId: created.id,
          actorId: user.id,
          action: "SUBMITTED",
          note: `Complaint submitted by student (${user.name})`,
        },
      });

      // Notify all active admins
      const admins = await tx.user.findMany({
        where: { role: "ADMIN", isActive: true },
        select: { id: true },
      });

      for (const admin of admins) {
        await tx.notification.create({
          data: {
            userId: admin.id,
            complaintId: created.id,
            title: priority === "CRITICAL" ? "CRITICAL Issue Reported" : "New Complaint Submitted",
            message: `${complaintNumber}: "${title.slice(0, 45)}..." in ${locationBuilding}`,
          },
        });
      }

      // Notify the student of successful filing
      await tx.notification.create({
        data: {
          userId: user.id,
          complaintId: created.id,
          title: "Complaint Received",
          message: `Your issue ${complaintNumber} has been logged and queued for administrative review.`,
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, complaint }, { status: 201 });
  } catch (error) {
    console.error("Error creating complaint:", error);
    return NextResponse.json(
      { error: "Failed to submit complaint" },
      { status: 500 }
    );
  }
}
