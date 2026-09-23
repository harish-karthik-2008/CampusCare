import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log("==================================================");
  console.log("🔍 Testing Supabase PostgreSQL Database Connection");
  console.log("==================================================");

  try {
    console.log("⏳ Connecting to database...");
    await prisma.$connect();
    console.log("✅ Successfully connected to database!\n");

    console.log("📊 Querying database tables:");

    // 1. Users
    const userCount = await prisma.user.count();
    const sampleUsers = await prisma.user.findMany({ take: 5, select: { id: true, email: true, role: true } });
    console.log(`  • User Table:           ${userCount} record(s) found (sampled ${sampleUsers.length})`);

    // 2. Categories
    const categoryCount = await prisma.category.count();
    const sampleCategories = await prisma.category.findMany({ take: 5, select: { id: true, name: true } });
    console.log(`  • Category Table:       ${categoryCount} record(s) found (sampled ${sampleCategories.length})`);

    // 3. Complaints
    const complaintCount = await prisma.complaint.count();
    const sampleComplaints = await prisma.complaint.findMany({ take: 5, select: { id: true, complaintNumber: true, status: true } });
    console.log(`  • Complaint Table:      ${complaintCount} record(s) found (sampled ${sampleComplaints.length})`);

    // 4. ResolutionLogs
    const resolutionLogCount = await prisma.resolutionLog.count();
    const sampleLogs = await prisma.resolutionLog.findMany({ take: 5, select: { id: true, action: true } });
    console.log(`  • ResolutionLog Table:  ${resolutionLogCount} record(s) found (sampled ${sampleLogs.length})`);

    // 5. Notifications
    const notificationCount = await prisma.notification.count();
    const sampleNotifications = await prisma.notification.findMany({ take: 5, select: { id: true, title: true, isRead: true } });
    console.log(`  • Notification Table:   ${notificationCount} record(s) found (sampled ${sampleNotifications.length})`);

    // 6. Feedback
    const feedbackCount = await prisma.feedback.count();
    const sampleFeedbacks = await prisma.feedback.findMany({ take: 5, select: { id: true, rating: true } });
    console.log(`  • Feedback Table:       ${feedbackCount} record(s) found (sampled ${sampleFeedbacks.length})`);

    console.log("\n==================================================");
    console.log("✅ SUCCESS: Database connection verified across all 6 models!");
    console.log("==================================================");
  } catch (error: unknown) {
    console.error("\n==================================================");
    console.error("❌ FAILED: Database connection test encountered an error.");
    if (error instanceof Error) {
      // Clean error message without exposing connection strings/passwords
      const cleanMessage = error.message.replace(/postgresql:\/\/[^@]+@/g, "postgresql://[REDACTED]@");
      console.error(`Error details: ${cleanMessage}`);
    } else {
      console.error("Unknown error occurred.");
    }
    console.error("==================================================");
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
