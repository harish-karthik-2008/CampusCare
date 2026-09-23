import { PrismaClient, ResolutionAction } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CampusCare database...");

  // Clean existing data
  await prisma.feedback.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.resolutionLog.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash("admin123", salt);
  const studentPasswordHash = await bcrypt.hash("student123", salt);

  // 1. Users
  const admin = await prisma.user.create({
    data: {
      name: "Dr. Rajesh Kumar",
      email: "admin@campuscare.demo",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      department: "Campus Administration & Facilities",
      phone: "+91 98421 23456",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "student@campuscare.demo", // primary demo student
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      department: "Computer Science & Engineering",
      phone: "+91 97890 12345",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Rahul Verma",
      email: "rahul@campuscare.demo",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      department: "Electrical & Electronics Engineering",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: "Ananya Iyer",
      email: "ananya@campuscare.demo",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      department: "Mechanical Engineering",
      phone: "+91 99401 56789",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  console.log("Users created.");

  // 2. Categories
  const categoriesData = [
    { name: "IT Services", description: "Campus Wi-Fi, LAN, server portals, lab computers, projectors", icon: "Wifi" },
    { name: "Maintenance", description: "Carpentry, doors, windows, civil repair, furniture, air conditioning", icon: "Wrench" },
    { name: "Electrical", description: "Power cuts, switchboards, wiring, fans, lighting, lab circuits", icon: "Zap" },
    { name: "Plumbing", description: "Water leakages, tap repairs, washroom fittings, RO dispensers", icon: "Droplets" },
    { name: "Hostel", description: "Hostel rooms, water heaters, corridor lights, wardens assistance", icon: "Home" },
    { name: "Mess/Cafeteria", description: "Dining hall cleanliness, food quality, utensils, drinking water", icon: "Utensils" },
    { name: "Transport", description: "College buses, shuttles, route timings, driver assistance", icon: "Bus" },
    { name: "Cleanliness", description: "Garbage collection, classroom sweeping, washroom sanitation", icon: "Sparkles" },
    { name: "Security", description: "Campus checkpoints, gate pass, CCTV assistance, lighting", icon: "Shield" },
    { name: "Academic", description: "Lecture halls, smart boards, sound systems, examination desks", icon: "BookOpen" },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.name] = created;
  }
  console.log("Categories created.");

  // Helper date generators
  const now = new Date();
  const daysAgo = (d: number, h = 0) => new Date(now.getTime() - (d * 24 + h) * 60 * 60 * 1000);

  // 3. Complaints
  // CC-1001: Wi-Fi issue in Hostel Block B
  const c1 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1001",
      studentId: student1.id,
      categoryId: categories["IT Services"].id,
      title: "Wi-Fi not working in Hostel Block B, 3rd Floor",
      description: "Since yesterday evening, all students on the 3rd floor are unable to connect to the BIT-Student-WLAN. The router lights are blinking red constantly.",
      locationBuilding: "Hostel Block B",
      locationBlock: "Floor 3",
      locationRoom: "Rooms 301-320 Wing",
      priority: "HIGH",
      status: "IN_PROGRESS",
      assignedTeam: "IT Team",
      assignedAdminId: admin.id,
      createdAt: daysAgo(1, 4),
      updatedAt: daysAgo(0, 5),
    },
  });

  // CC-1002: Plumbing leak in Kaveri Hostel
  const c2 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1002",
      studentId: student2.id,
      categoryId: categories["Plumbing"].id,
      title: "Bathroom pipe leaking continuously in Kaveri Hostel",
      description: "Severe overhead pipe leakage in the 2nd floor common washroom. Water is accumulating on the floor causing a slip hazard.",
      locationBuilding: "Kaveri Hostel",
      locationBlock: "Block A",
      locationRoom: "2nd Floor Washroom",
      priority: "HIGH",
      status: "RESOLVED",
      assignedTeam: "Maintenance Team",
      assignedAdminId: admin.id,
      resolutionNote: "Maintenance plumber replaced the cracked PVC elbow joint and resealed the overhead inlet pipe. Verified no leakage remains.",
      createdAt: daysAgo(3, 2),
      updatedAt: daysAgo(1, 1),
      resolvedAt: daysAgo(1, 1),
    },
  });

  // CC-1003: Classroom projector
  const c3 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1003",
      studentId: student1.id,
      categoryId: categories["Academic"].id,
      title: "Classroom projector flickering in Mech Block Hall 204",
      description: "The ceiling HDMI connection flickers intermittently during lectures, making slide presentations unreadable.",
      locationBuilding: "Mechanical Block",
      locationBlock: "2nd Floor",
      locationRoom: "Lecture Hall 204",
      priority: "NORMAL",
      status: "CLOSED",
      assignedTeam: "IT Team",
      assignedAdminId: admin.id,
      resolutionNote: "Replaced faulty HDMI cable from console to ceiling projector and recalibrated display refresh rate.",
      createdAt: daysAgo(5, 6),
      updatedAt: daysAgo(2, 2),
      resolvedAt: daysAgo(3, 1),
      closedAt: daysAgo(2, 2),
    },
  });

  // CC-1004: Hostel water shortage (Critical)
  const c4 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1004",
      studentId: student3.id,
      categoryId: categories["Hostel"].id,
      title: "RO purifier water shortage in Amaravathi Hostel",
      description: "The drinking water RO dispenser on ground floor has run dry since 8:00 AM. 120 students depend on this unit.",
      locationBuilding: "Amaravathi Hostel",
      locationBlock: "Ground Floor",
      locationRoom: "Dining & Water Dispenser Lounge",
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      assignedTeam: "Hostel Team",
      assignedAdminId: admin.id,
      createdAt: daysAgo(1, 10),
      updatedAt: daysAgo(0, 3),
    },
  });

  // CC-1005: Street light near Gate 2
  const c5 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1005",
      studentId: student2.id,
      categoryId: categories["Electrical"].id,
      title: "Street light near Main Gate 2 blinking and dark",
      description: "Pole #14 LED lamp has failed. Pathway is completely pitch dark after 7:00 PM causing safety concerns for students walking back from the library.",
      locationBuilding: "Campus Grounds",
      locationBlock: "North Perimeter",
      locationRoom: "Near Gate 2 / Library Pathway",
      priority: "NORMAL",
      status: "RESOLVED",
      assignedTeam: "Electrical Team",
      assignedAdminId: admin.id,
      resolutionNote: "Replaced 60W LED driver unit and tested illumination cycle on automatic timer.",
      createdAt: daysAgo(4, 5),
      updatedAt: daysAgo(2, 4),
      resolvedAt: daysAgo(2, 4),
    },
  });

  // CC-1006: Mess hygiene issue
  const c6 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1006",
      studentId: student1.id,
      categoryId: categories["Mess/Cafeteria"].id,
      title: "Mess food counter hygiene & water dispenser cleaning",
      description: "Water cooler trays near Counter 3 in South Mess have scum buildup and need deep steam sanitation.",
      locationBuilding: "South Mess Complex",
      locationBlock: "Dining Hall 1",
      locationRoom: "Counter 3 area",
      priority: "HIGH",
      status: "PENDING",
      createdAt: daysAgo(0, 18),
      updatedAt: daysAgo(0, 18),
    },
  });

  // CC-1007: Transport bus AC
  const c7 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1007",
      studentId: student3.id,
      categoryId: categories["Transport"].id,
      title: "Route 7 college bus AC cooling not functioning",
      description: "Bus #TN-38-CC-4011 AC compressor cuts off after 10 minutes of running. Very suffocating in afternoon trips.",
      locationBuilding: "Campus Transport Depot",
      locationBlock: "Bus Bay 4",
      locationRoom: "Bus #TN-38-CC-4011",
      priority: "NORMAL",
      status: "CLOSED",
      assignedTeam: "Transport Team",
      assignedAdminId: admin.id,
      resolutionNote: "Serviced vehicle AC gas recharge and cleaned condenser coils.",
      createdAt: daysAgo(7, 3),
      updatedAt: daysAgo(4, 1),
      resolvedAt: daysAgo(5, 2),
      closedAt: daysAgo(4, 1),
    },
  });

  // CC-1008: Damaged electrical socket
  const c8 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1008",
      studentId: student2.id,
      categoryId: categories["Electrical"].id,
      title: "Damaged electrical socket with visible sparks at Circuit Lab",
      description: "Bench 6 socket board sparked when plugging in oscilloscope. Socket plastic is blackened and exposed wire is dangerous.",
      locationBuilding: "EEE Block",
      locationBlock: "First Floor",
      locationRoom: "Circuit Lab 102",
      priority: "CRITICAL",
      status: "PENDING",
      createdAt: daysAgo(0, 6),
      updatedAt: daysAgo(0, 6),
    },
  });

  // CC-1009: Library AC noise
  const c9 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1009",
      studentId: student1.id,
      categoryId: categories["Maintenance"].id,
      title: "Library 2nd floor air conditioning fan making loud screeching noise",
      description: "Central AC vent near silent study cubicles vibrates with high pitched noise, disturbing exam preparation.",
      locationBuilding: "Central Library",
      locationBlock: "Level 2",
      locationRoom: "Silent Study Wing B",
      priority: "NORMAL",
      status: "IN_PROGRESS",
      assignedTeam: "Maintenance Team",
      assignedAdminId: admin.id,
      createdAt: daysAgo(2, 8),
      updatedAt: daysAgo(1, 2),
    },
  });

  // CC-1010: Washroom drainage
  const c10 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1010",
      studentId: student3.id,
      categoryId: categories["Plumbing"].id,
      title: "Girls Hostel washroom drainage blockage in Block C",
      description: "Floor drain in 1st floor bathroom is clogged with standing water after morning hours.",
      locationBuilding: "Girls Hostel Block C",
      locationBlock: "Wing 1",
      locationRoom: "Washroom 104",
      priority: "HIGH",
      status: "RESOLVED",
      assignedTeam: "Maintenance Team",
      assignedAdminId: admin.id,
      resolutionNote: "Drain rodded and treated with enzymatic cleaner. Water flow restored completely.",
      createdAt: daysAgo(3, 4),
      updatedAt: daysAgo(1, 6),
      resolvedAt: daysAgo(1, 6),
    },
  });

  // CC-1011: Broken window latch
  const c11 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1011",
      studentId: student2.id,
      categoryId: categories["Maintenance"].id,
      title: "Broken glass window latch in Science Block 305",
      description: "Window pane bangs loudly in windy weather and cannot be locked shut safely.",
      locationBuilding: "Science Block",
      locationBlock: "3rd Floor",
      locationRoom: "Room 305",
      priority: "NORMAL",
      status: "PENDING",
      createdAt: daysAgo(0, 14),
      updatedAt: daysAgo(0, 14),
    },
  });

  // CC-1012: Parking gate sensor
  const c12 = await prisma.complaint.create({
    data: {
      complaintNumber: "CC-1012",
      studentId: student1.id,
      categoryId: categories["Security"].id,
      title: "Two-wheeler parking sensor gate not opening smoothly",
      description: "RFID tag scanner takes over 30 seconds to detect college ID card, creating congestion at student parking lot.",
      locationBuilding: "Campus Security",
      locationBlock: "South Gate",
      locationRoom: "Two-Wheeler Parking Lot A",
      priority: "NORMAL",
      status: "RESOLVED",
      assignedTeam: "Security Team",
      assignedAdminId: admin.id,
      resolutionNote: "Cleaned optical sensor glass and updated firmware on reader antenna.",
      createdAt: daysAgo(4, 9),
      updatedAt: daysAgo(2, 5),
      resolvedAt: daysAgo(2, 5),
    },
  });

  console.log("12 Complaints created.");

  // 4. Resolution Logs
  const resolutionLogs: Array<{
    complaintId: string;
    actorId: string;
    action: ResolutionAction;
    note: string;
    createdAt: Date;
  }> = [
    { complaintId: c1.id, actorId: student1.id, action: "SUBMITTED", note: "Complaint submitted by Student", createdAt: daysAgo(1, 4) },
    { complaintId: c1.id, actorId: admin.id, action: "REVIEWED", note: "Admin reviewed Wi-Fi coverage issue", createdAt: daysAgo(1, 1) },
    { complaintId: c1.id, actorId: admin.id, action: "ASSIGNED", note: "Assigned to IT Team (Lead Engineer S. Murugan)", createdAt: daysAgo(0, 5) },
    { complaintId: c1.id, actorId: admin.id, action: "STATUS_CHANGE", note: "Status changed to IN_PROGRESS", createdAt: daysAgo(0, 5) },

    { complaintId: c2.id, actorId: student2.id, action: "SUBMITTED", note: "Complaint submitted with urgent leak alert", createdAt: daysAgo(3, 2) },
    { complaintId: c2.id, actorId: admin.id, action: "ASSIGNED", note: "Assigned to Maintenance Team", createdAt: daysAgo(2, 6) },
    { complaintId: c2.id, actorId: admin.id, action: "STATUS_CHANGE", note: "Status changed to IN_PROGRESS", createdAt: daysAgo(2, 6) },
    { complaintId: c2.id, actorId: admin.id, action: "RESOLVED", note: "Plumber repaired PVC pipe joint", createdAt: daysAgo(1, 1) },

    { complaintId: c3.id, actorId: student1.id, action: "SUBMITTED", note: "Submitted HDMI flickering issue", createdAt: daysAgo(5, 6) },
    { complaintId: c3.id, actorId: admin.id, action: "ASSIGNED", note: "Assigned to IT Team", createdAt: daysAgo(4, 3) },
    { complaintId: c3.id, actorId: admin.id, action: "RESOLVED", note: "Replaced faulty HDMI cable", createdAt: daysAgo(3, 1) },
    { complaintId: c3.id, actorId: student1.id, action: "CLOSED", note: "Student tested in class and confirmed clear display", createdAt: daysAgo(2, 2) },

    { complaintId: c4.id, actorId: student3.id, action: "SUBMITTED", note: "Critical water shortage submitted", createdAt: daysAgo(1, 10) },
    { complaintId: c4.id, actorId: admin.id, action: "ASSIGNED", note: "Assigned to Hostel Team on emergency priority", createdAt: daysAgo(1, 8) },
    { complaintId: c4.id, actorId: admin.id, action: "STATUS_CHANGE", note: "Plumbing team dispatching replacement filters", createdAt: daysAgo(0, 3) },

    { complaintId: c5.id, actorId: student2.id, action: "SUBMITTED", note: "Dark pathway reported", createdAt: daysAgo(4, 5) },
    { complaintId: c5.id, actorId: admin.id, action: "ASSIGNED", note: "Assigned to Electrical Team", createdAt: daysAgo(3, 8) },
    { complaintId: c5.id, actorId: admin.id, action: "RESOLVED", note: "LED driver replaced", createdAt: daysAgo(2, 4) },

    { complaintId: c6.id, actorId: student1.id, action: "SUBMITTED", note: "Mess hygiene reported", createdAt: daysAgo(0, 18) },

    { complaintId: c7.id, actorId: student3.id, action: "SUBMITTED", note: "Bus AC failure reported", createdAt: daysAgo(7, 3) },
    { complaintId: c7.id, actorId: admin.id, action: "ASSIGNED", note: "Assigned to Transport Team", createdAt: daysAgo(6, 2) },
    { complaintId: c7.id, actorId: admin.id, action: "RESOLVED", note: "AC condenser cleaned and refilled", createdAt: daysAgo(5, 2) },
    { complaintId: c7.id, actorId: student3.id, action: "CLOSED", note: "Student verified bus trip comfortable", createdAt: daysAgo(4, 1) },
  ];

  for (const log of resolutionLogs) {
    await prisma.resolutionLog.create({ data: log });
  }
  console.log("Resolution logs created.");

  // 5. Feedbacks
  await prisma.feedback.create({
    data: {
      complaintId: c3.id,
      studentId: student1.id,
      rating: 5,
      comment: "Super fast response! The IT technician came within 24 hours and replaced the cable before our afternoon seminar. Thank you!",
      createdAt: daysAgo(2, 2),
    },
  });

  await prisma.feedback.create({
    data: {
      complaintId: c7.id,
      studentId: student3.id,
      rating: 4,
      comment: "AC is cooling well now. Would appreciate if bus inspections were done during weekends to prevent morning delays.",
      createdAt: daysAgo(4, 1),
    },
  });
  console.log("Feedbacks created.");

  // 6. Notifications
  const notifications = [
    {
      userId: student1.id,
      complaintId: c1.id,
      title: "Complaint In Progress",
      message: "Your complaint CC-1001 (Wi-Fi not working) has been assigned to IT Team and is in progress.",
      isRead: false,
      createdAt: daysAgo(0, 5),
    },
    {
      userId: student1.id,
      complaintId: c3.id,
      title: "Complaint Closed Successfully",
      message: "Complaint CC-1003 has been resolved and confirmed closed.",
      isRead: true,
      createdAt: daysAgo(2, 2),
    },
    {
      userId: student2.id,
      complaintId: c2.id,
      title: "Complaint Resolved",
      message: "Complaint CC-1002 has been marked as RESOLVED by Maintenance Team. Please verify and confirm resolution.",
      isRead: false,
      createdAt: daysAgo(1, 1),
    },
    {
      userId: student2.id,
      complaintId: c5.id,
      title: "Issue Resolved",
      message: "Street light repair completed near Gate 2. Please confirm if satisfied.",
      isRead: false,
      createdAt: daysAgo(2, 4),
    },
    {
      userId: admin.id,
      complaintId: c8.id,
      title: "CRITICAL: Electrical Sparks in Circuit Lab",
      message: "New critical complaint CC-1008 submitted in EEE Block. Immediate attention required!",
      isRead: false,
      createdAt: daysAgo(0, 6),
    },
    {
      userId: admin.id,
      complaintId: c6.id,
      title: "New Complaint Submitted",
      message: "Priya Sharma submitted complaint CC-1006 under Mess/Cafeteria.",
      isRead: false,
      createdAt: daysAgo(0, 18),
    },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({ data: notif });
  }
  console.log("Notifications created.");

  console.log("Seeding complete! Admin: admin@campuscare.demo / admin123 | Student: student@campuscare.demo / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
