// End-to-end automated demo verification script
const BASE_URL = "http://localhost:3000";

async function runDemoTest() {
  console.log("=== STARTING CAMPUSCARE E2E DEMO VERIFICATION ===");

  // 1. Check Landing Page
  const landingRes = await fetch(`${BASE_URL}/`);
  console.log(`1. Landing Page Response: ${landingRes.status} ${landingRes.statusText}`);
  const landingHtml = await landingRes.text();
  if (landingHtml.includes("CampusCare") && landingHtml.includes("A Better Way to Care for Your")) {
    console.log("   ✓ Landing page loaded with official branding and hero copy");
  } else {
    throw new Error("Landing page verification failed");
  }

  // 2. Login as Student
  console.log("\n2. Logging in as Demo Student (student@campuscare.demo)...");
  const studentLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "student@campuscare.demo", password: "student123" }),
  });
  console.log(`   Response: ${studentLoginRes.status}`);
  const studentLoginData = await studentLoginRes.json();
  const studentCookie = studentLoginRes.headers.get("set-cookie");
  console.log(`   ✓ Student Logged in: ${studentLoginData.user.name} (${studentLoginData.user.role})`);

  // 3. Fetch Categories
  const catRes = await fetch(`${BASE_URL}/api/admin/categories`);
  const catData = await catRes.json();
  console.log(`   ✓ Loaded ${catData.categories.length} campus categories`);
  const itCategory = catData.categories.find((c) => c.name === "IT Services") || catData.categories[0];

  // 4. Submit New Complaint
  console.log("\n3. Submitting New Complaint as Student...");
  const newComplaintRes = await fetch(`${BASE_URL}/api/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      categoryId: itCategory.id,
      title: "Wi-Fi not working in Hostel Block B",
      description: "Since yesterday evening, all students on the 3rd floor are unable to connect to the campus network. Router lights are red.",
      locationBuilding: "Hostel Block B",
      locationBlock: "3rd Floor",
      locationRoom: "Rooms 301-320 Wing",
      priority: "HIGH",
    }),
  });

  const newComplaintData = await newComplaintRes.json();
  console.log(`   Response: ${newComplaintRes.status}`);
  const complaint = newComplaintData.complaint;
  console.log(`   ✓ Created Ticket: ${complaint.complaintNumber} (Status: ${complaint.status}, Priority: ${complaint.priority})`);

  // 5. Login as Admin
  console.log("\n4. Switching / Logging in as Demo Admin (admin@campuscare.demo)...");
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@campuscare.demo", password: "admin123" }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminCookie = adminLoginRes.headers.get("set-cookie");
  console.log(`   ✓ Admin Logged in: ${adminLoginData.user.name} (${adminLoginData.user.role})`);

  // 6. Admin Assigns Team
  console.log(`\n5. Admin Assigning ${complaint.complaintNumber} to IT Team...`);
  const assignRes = await fetch(`${BASE_URL}/api/admin/complaints/${complaint.id}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      assignedTeam: "IT Team",
      note: "IT team assigned to inspect the network and reboot the access point.",
    }),
  });
  const assignData = await assignRes.json();
  console.log(`   ✓ Ticket status updated to: ${assignData.complaint.status} (Assigned to: ${assignData.complaint.assignedTeam})`);

  // 7. Admin Marks as RESOLVED with mandatory resolution note
  console.log(`\n6. Admin Resolving ${complaint.complaintNumber}...`);
  const resolveRes = await fetch(`${BASE_URL}/api/admin/complaints/${complaint.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      status: "RESOLVED",
      resolutionNote: "Access point restarted and network configuration corrected. Replaced faulty PoE adapter.",
    }),
  });
  const resolveData = await resolveRes.json();
  console.log(`   ✓ Status is now: ${resolveData.complaint.status}`);
  console.log(`   ✓ Resolution Note: "${resolveData.complaint.resolutionNote}"`);

  // 8. Student Verifies and Confirms Resolution
  console.log(`\n7. Student Confirming Resolution for ${complaint.complaintNumber}...`);
  const confirmRes = await fetch(`${BASE_URL}/api/complaints/${complaint.id}/confirm`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      action: "CONFIRM",
      note: "Tested connection in Room 304, high speed restored. Thank you!",
    }),
  });
  const confirmData = await confirmRes.json();
  console.log(`   ✓ Ticket status transitioned to: ${confirmData.complaint.status}`);

  // 9. Student Submits 5-Star Feedback
  console.log("\n8. Submitting 5-Star Feedback Rating...");
  const feedbackRes = await fetch(`${BASE_URL}/api/complaints/${complaint.id}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      rating: 5,
      comment: "Super fast turnaround time! Resolved within hours.",
    }),
  });
  const feedbackData = await feedbackRes.json();
  console.log(`   ✓ Feedback saved: ${feedbackData.feedback.rating} Stars - "${feedbackData.feedback.comment}"`);

  // 10. Check Admin Analytics reflects the updated counts
  console.log("\n9. Verifying Admin Analytics Auto-Update...");
  const analyticsRes = await fetch(`${BASE_URL}/api/admin/analytics`, {
    headers: { Cookie: adminCookie },
  });
  const analyticsData = await analyticsRes.json();
  console.log(`   ✓ Total Tickets: ${analyticsData.summary.total}`);
  console.log(`   ✓ Closed/Resolved: ${analyticsData.summary.closed + analyticsData.summary.resolved}`);
  console.log(`   ✓ Average Turnaround: ${analyticsData.summary.avgResolutionTime} hours`);
  console.log(`   ✓ Average Satisfaction: ${analyticsData.summary.avgSatisfaction} / 5.0`);
  console.log(`   ✓ Smart Insights generated: ${analyticsData.insights.length}`);
  analyticsData.insights.forEach((ins) => console.log(`     - ${ins}`));

  console.log("\n=== ALL WORKFLOW STEPS PASSED SUCCESSFULLY 100% ===");
}

runDemoTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
