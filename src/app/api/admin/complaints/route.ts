import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getUserFromRequest } from "../../../../lib/auth";
import { calculateSLA } from "../../../../lib/sla";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const team = searchParams.get("team");
    const search = searchParams.get("search");
    const overdueOnly = searchParams.get("overdue") === "true";

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status.toUpperCase();
    }

    if (category && category !== "ALL") {
      where.category = { name: category };
    }

    if (priority && priority !== "ALL") {
      where.priority = priority.toUpperCase();
    }

    if (team && team !== "ALL") {
      where.assignedTeam = team;
    }

    if (search) {
      where.OR = [
        { complaintNumber: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
        { locationBuilding: { contains: search } },
        { student: { name: { contains: search } } },
        { student: { email: { contains: search } } },
      ];
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        category: true,
        student: {
          select: { id: true, name: true, email: true, department: true, phone: true, avatar: true },
        },
        assignedAdmin: {
          select: { id: true, name: true, email: true },
        },
        feedback: true,
      },
      orderBy: [
        { priority: "desc" }, // Critical & High will appear near top
        { createdAt: "desc" },
      ],
    });

    // Decorate with SLA & filter overdue if requested
    const decorated = complaints.map((c) => {
      const sla = calculateSLA(c.createdAt, c.priority, c.status, c.resolvedAt);
      return {
        ...c,
        isOverdue: sla.isOverdue,
        hoursRemaining: sla.hoursRemaining,
        slaPercentage: sla.percentageUsed,
      };
    });

    const finalResult = overdueOnly
      ? decorated.filter((c) => c.isOverdue && c.status !== "CLOSED")
      : decorated;

    return NextResponse.json({ complaints: finalResult, total: finalResult.length });
  } catch (error) {
    console.error("Admin fetch complaints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin complaints" },
      { status: 500 }
    );
  }
}
