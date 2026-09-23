import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUTPUT_DIR = path.resolve("public/screenshots");
const JWT_SECRET = process.env.JWT_SECRET || "campuscare-default-jwt-secret-key-32chars";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function capture() {
  const student = await prisma.user.findUnique({ where: { email: "student@campuscare.demo" } });
  const admin = await prisma.user.findUnique({ where: { email: "admin@campuscare.demo" } });
  const studentToken = createToken(student);
  const adminToken = createToken(admin);

  console.log("Launching Edge headless...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Landing Page
  console.log("Capturing 01_landing_page.png...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "01_landing_page.png") });

  // 2. Login Page
  console.log("Capturing 02_login_page.png...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "02_login_page.png") });

  // Authenticate as Student
  console.log("Setting Student Session Cookie...");
  await page.setCookie({
    name: "campuscare_session",
    value: studentToken,
    domain: "localhost",
    path: "/",
  });

  // 3. Student Dashboard
  console.log("Capturing 03_student_dashboard.png...");
  await page.goto("http://localhost:3000/student/dashboard", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "03_student_dashboard.png") });

  // 4. Student New Complaint
  console.log("Capturing 04_student_new_complaint.png...");
  await page.goto("http://localhost:3000/student/complaints/new", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "04_student_new_complaint.png") });

  // 5. Student Complaints Tracker
  console.log("Capturing 05_student_complaints_list.png...");
  await page.goto("http://localhost:3000/student/complaints", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "05_student_complaints_list.png") });

  // 6. Student Complaint Detail
  console.log("Capturing 06_student_complaint_detail.png...");
  const firstComplaint = await prisma.complaint.findFirst({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  });
  if (firstComplaint) {
    await page.goto(`http://localhost:3000/student/complaints/${firstComplaint.id}`, {
      waitUntil: "networkidle0",
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, "06_student_complaint_detail.png") });
  }

  // 7. Student Notifications
  console.log("Capturing 07_student_notifications.png...");
  await page.goto("http://localhost:3000/student/notifications", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "07_student_notifications.png") });

  // 8. Student Profile
  console.log("Capturing 08_student_profile.png...");
  await page.goto("http://localhost:3000/student/profile", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "08_student_profile.png") });

  // Mobile Views
  console.log("Capturing Mobile Views...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/student/dashboard", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "14_mobile_student_dashboard.png") });

  await page.goto("http://localhost:3000/student/complaints", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "15_mobile_complaints_cards.png") });

  // Mobile Drawer Menu
  const menuBtn = await page.$("button[aria-label*='Toggle Navigation Drawer']");
  if (menuBtn) {
    await menuBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, "16_mobile_drawer_navigation.png") });
  }

  // Switch to Admin (Desktop)
  console.log("Setting Admin Session Cookie...");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.setCookie({
    name: "campuscare_session",
    value: adminToken,
    domain: "localhost",
    path: "/",
  });

  // 9. Admin Dashboard
  console.log("Capturing 09_admin_dashboard.png...");
  await page.goto("http://localhost:3000/admin/dashboard", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "09_admin_dashboard.png") });

  // 10. Admin Complaints Management Suite
  console.log("Capturing 10_admin_complaints_management.png...");
  await page.goto("http://localhost:3000/admin/complaints", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "10_admin_complaints_management.png") });

  // 11. Admin Analytics
  console.log("Capturing 11_admin_analytics.png...");
  await page.goto("http://localhost:3000/admin/analytics", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "11_admin_analytics.png") });

  // 12. Admin Users Directory
  console.log("Capturing 12_admin_users.png...");
  await page.goto("http://localhost:3000/admin/users", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "12_admin_users.png") });

  // 13. Admin Categories Management
  console.log("Capturing 13_admin_categories.png...");
  await page.goto("http://localhost:3000/admin/categories", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "13_admin_categories.png") });

  await browser.close();
  await prisma.$disconnect();
  console.log("=== ALL HIGH-RES SCREENSHOTS CAPTURED PERFECTLY! ===");
}

capture().catch((err) => {
  console.error("Capture script error:", err);
  process.exit(1);
});
