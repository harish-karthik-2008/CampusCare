<div align="center">

  <img src="public/campuscare-logo.png" alt="CampusCare Logo" width="90" />

  # CampusCare 🏛️
  ### Smart Campus Complaint & Resolution Management System
  
  **Transforming university campus operations with a transparent, SLA-tracked, full-stack resolution system.**

  [Bannari Amman Institute of Technology](https://www.bitsathy.ac.in/) &bull; Smart Campus Initiative

  <br />

  [![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![SQLite](https://img.shields.io/badge/SQLite-Dev%20DB-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

  <br />

  [Explore Features](#-key-features) &bull;
  [View Screenshots](#-visual-walkthrough--screenshots) &bull;
  [Quick Start Guide](#-quick-start--setup-guide) &bull;
  [Demo Accounts](#-demo-credentials)

</div>

---

## 📖 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [The Problem vs. The CampusCare Solution](#-the-problem-vs-the-campuscare-solution)
3. [How It Works (Resolution Lifecycle)](#-how-it-works-5-stage-resolution-lifecycle)
4. [Key Features](#-key-features)
   - [Student Experience](#1-student-experience)
   - [Admin Command Center](#2-admin-command-center)
   - [Smart SLA & Priority Engine](#3-smart-sla--priority-engine)
5. [Visual Walkthrough & Screenshots](#-visual-walkthrough--screenshots)
6. [Technology Stack & Architecture](#-technology-stack--architecture)
7. [Demo Credentials](#-demo-credentials)
8. [Quick Start & Setup Guide](#-quick-start--setup-guide)
9. [REST API Endpoints](#-rest-api-endpoints)
10. [Project Directory Structure](#-project-directory-structure)

---

## 🌟 Executive Summary

**CampusCare** is a production-grade, full-stack campus management platform built specifically for college environments. It replaces outdated paper grievance registers and chaotic messaging groups with a unified digital ecosystem.

Students can report facility issues (Wi-Fi, Electrical, Plumbing, Hostel, Labs, Mess, Transport), monitor their real-time repair progress, and verify resolutions with feedback ratings. Concurrently, campus administrators gain an executive command console to prioritize emergency tickets, dispatch maintenance teams, enforce strict Service Level Agreements (SLAs), and analyze departmental performance trends.

---

## ⚡ The Problem vs. The CampusCare Solution

| Challenge in Traditional Campuses | How CampusCare Solves It |
| :--- | :--- |
| **Lost or Ignored Requests**: Complaints written in registers or sent via WhatsApp get forgotten without records. | **Centralized Database**: Every report generates a unique ticket ID (`CC-1001`), timestamp, and audit log. |
| **Zero Status Visibility**: Students have no idea if a technician was notified or when a fix is expected. | **Live 5-Stage Timeline**: Real-time progress bar (`SUBMITTED` &rarr; `REVIEWED` &rarr; `IN_PROGRESS` &rarr; `RESOLVED` &rarr; `CLOSED`). |
| **No Time Enforcement (SLA)**: Repairs drag on for weeks without accountability or escalation. | **Automated SLA Timers**: 24h for Critical, 48h for High, 72h for Normal with live countdowns and overdue tags. |
| **Premature Ticket Closure**: Staff mark tickets as "Done" without actually fixing the physical problem. | **Mandatory Notes & Verification**: Admins must document a resolution note, and students verify the fix before closing. |
| **No Operational Intelligence**: Campus leaders lack visibility into which blocks or departments fail most. | **Real-Time Analytics**: Visual charts for category breakdowns, resolution velocity, and student satisfaction index. |

---

## 🔄 How It Works: 5-Stage Resolution Lifecycle

```text
[1. SUBMIT]       ──► Student reports concern with building, room, photos & priority hint
[2. REVIEW]       ──► Campus administrator triages ticket & reviews urgency
[3. IN PROGRESS]  ──► Assigned to specialized technical team (e.g. IT, Electrical, Plumbing)
[4. RESOLVED]     ──► Technician documents mandatory remedy notes & marks issue as fixed
[5. CLOSED]       ──► Student verifies repair on-site & submits 1-to-5 star satisfaction rating
```

---

## 🚀 Key Features

### 1. Student Experience
- **One-Click Issue Reporting**: Structured form with department categorization, campus location (Building, Block, Room), priority selector, and evidence photo uploads.
- **Interactive Ticket Tracker**: Instant status pill filters (`All`, `Pending`, `In Progress`, `Resolved`, `Closed`), multi-keyword search, and SLA countdown clocks.
- **Visual Progress Timeline**: Step-by-step audit logs showing exact dates, assignees, and technician remarks.
- **Resolution Verification**: Two-button feedback control (*"Confirm Resolution"* or *"Report Issue Still Exists"*) with a 5-star rating system.
- **Notification Inbox**: Live alerts when complaints change status or receive staff comments.

### 2. Admin Command Center
- **Executive Overview Dashboard**: High-level counters for total tickets, pending reviews, active repairs, critical issues, and SLA breaches.
- **Automated Operational Insights**: Dynamic smart cards highlighting top-affected departments and overdue alerts.
- **Comprehensive Complaint Suite**: Complete management table with search, team filters, quick-assign group drawers, and status transition dialogs.
- **Strict Resolution Policy**: Server-side validation enforcing non-empty resolution notes when marking tickets `RESOLVED`.
- **Campus-Wide Analytics**: Interactive Recharts visualizations (Category Donut, Status Distribution Bar, 7-Day Inflow Area chart).
- **Directory & Category Controls**: Manage campus departments, teams, and registered campus users.

### 3. Smart SLA & Priority Engine
- **Critical Urgency**: 24-Hour SLA Target (Power outages, lab equipment hazards, safety risks).
- **High Urgency**: 48-Hour SLA Target (Hostel Wi-Fi failure, classroom projector breakdown, water supply).
- **Normal Urgency**: 72-Hour SLA Target (Furniture repairs, general campus amenities).
- **Automated Escalation**: Real-time badge indicators displaying remaining hours or `OVERDUE` warnings.

### 4. Layout & Device Responsiveness
- **Corner-Pinned Fixed Navbar**: Clean left navigation bar docked directly to the viewport edge (`left: 0, top: 0, bottom: 0`) that remains fixed while content scrolls.
- **Universal Mobile Adaptability**: On mobile screens (< 768px), large tables convert automatically into touch-friendly cards, with a smooth slide-out drawer and fixed bottom 1-thumb navigation bar.

---

## 📸 Visual Walkthrough & Screenshots

### 1. Public Landing & Fast Authentication
*Modern, high-converting entrance with institution branding, live stats, and 1-click demo role switchers.*

| Public Landing Page (`/`) | Quick Login & Role Picker (`/login`) |
| :---: | :---: |
| <img src="public/screenshots/01_landing_page.png" alt="Landing Page" width="550" /> | <img src="public/screenshots/02_login_page.png" alt="Login Page" width="550" /> |
| *Hero area, features breakdown, and quick access buttons.* | *Pre-configured quick login for Student and Admin roles.* |

---

### 2. Student Portal (`/student`)
*Intuitive student workspace for lodging concerns and tracking real-time technician progress.*

| Student Dashboard (`/student/dashboard`) | Submit New Concern (`/student/complaints/new`) |
| :---: | :---: |
| <img src="public/screenshots/03_student_dashboard.png" alt="Student Dashboard" width="550" /> | <img src="public/screenshots/04_student_new_complaint.png" alt="New Complaint Form" width="550" /> |
| *Greeting card, summary metrics, breakdown chart, and recent tickets.* | *Category selector, building/room inputs, urgency hints & photo uploader.* |

| My Complaints Tracker (`/student/complaints`) | Live Resolution Timeline (`/student/complaints/[id]`) |
| :---: | :---: |
| <img src="public/screenshots/05_student_complaints_list.png" alt="My Complaints List" width="550" /> | <img src="public/screenshots/06_student_complaint_detail.png" alt="Complaint Detail Timeline" width="550" /> |
| *1-Click status pill tabs, keyword search, and live SLA clock indicators.* | *5-Stage visual progress timeline, technician notes, confirm & 5-star rating.* |

| Notification Inbox (`/student/notifications`) | Student Profile & Settings (`/student/profile`) |
| :---: | :---: |
| <img src="public/screenshots/07_student_notifications.png" alt="Student Notifications" width="550" /> | <img src="public/screenshots/08_student_profile.png" alt="Student Profile" width="550" /> |
| *Real-time status updates and resolution alerts.* | *Student details, department affiliation, and contact info.* |

---

### 3. Administrator Management Console (`/admin`)
*Central command center for campus authorities to dispatch teams, enforce SLAs, and analyze trends.*

| Executive Command Dashboard (`/admin/dashboard`) | Complaint Management Suite (`/admin/complaints`) |
| :---: | :---: |
| <img src="public/screenshots/09_admin_dashboard.png" alt="Admin Dashboard" width="550" /> | <img src="public/screenshots/10_admin_complaints_management.png" alt="Admin Complaints Table" width="550" /> |
| *KPI cards, SLA overdue warnings, smart operational insights & charts.* | *Multi-filter management table with team assignment & resolve modals.* |

| Campus Analytics & Performance (`/admin/analytics`) | Campus User Directory (`/admin/users`) |
| :---: | :---: |
| <img src="public/screenshots/11_admin_analytics.png" alt="Campus Analytics" width="550" /> | <img src="public/screenshots/12_admin_users.png" alt="User Directory" width="550" /> |
| *Turnaround velocity, SLA compliance rate, and student satisfaction score.* | *Student & staff account management with activity statuses.* |

| Department Categories (`/admin/categories`) |
| :---: |
| <img src="public/screenshots/13_admin_categories.png" alt="Categories" width="550" /> |
| *Department routing config (IT Services, Electrical, Plumbing, Hostel, Mess, etc.).* |

---

### 4. Universal Mobile Experience (< 768px)
*Native app feel across all phones and tablets with slide-out navigation drawers and swipeable cards.*

| Mobile Student Dashboard | Mobile Complaints Touch Cards | Slide-Out Navigation Drawer |
| :---: | :---: | :---: |
| <img src="public/screenshots/14_mobile_student_dashboard.png" alt="Mobile Dashboard" width="300" /> | <img src="public/screenshots/15_mobile_complaints_cards.png" alt="Mobile Complaints Cards" width="300" /> | <img src="public/screenshots/16_mobile_drawer_navigation.png" alt="Mobile Drawer" width="300" /> |
| *Compact header, 2x2 metric cards & bottom nav.* | *Touch cards with badges & SLA indicators.* | *Full slide-out menu with smooth backdrop blur.* |

---

## 🛠️ Technology Stack & Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATION LAYER                 │
│   Next.js 14 App Router  •  React 18  •  Tailwind CSS       │
│   Lucide Icons  •  Recharts  •  Top Navigation Progress     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    SERVER API ROUTE HANDLERS                │
│   /api/auth/*     •   /api/complaints/*   •   /api/admin/*  │
│   JWT Session Validation  •  HTTP-Only Secure Cookies       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma ORM
┌──────────────────────────────▼──────────────────────────────┐
│                    PERSISTENCE DATA LAYER                   │
│   SQLite Database (prisma/dev.db)                           │
│   Models: User, Category, Complaint, ResolutionLog, Feedback│
└─────────────────────────────────────────────────────────────┘
```

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router with Server Components & Client Hooks)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated campus color palette (`#E9ECF3` primary canvas, `#7C52F6` brand violet, `#FFFFFF` cards)
- **Data Visualizations**: [Recharts](https://recharts.org/) for real-time analytics
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite relational persistence
- **Authentication**: Stateless JSON Web Tokens (JWT) stored in HTTP-only, SameSite secure cookies
- **Testing**: End-to-end automated validation via Node.js and headless browser test runners

---

## 🔑 Demo Credentials

CampusCare comes pre-seeded with realistic campus test data, tickets, resolution logs, and accounts:

| Portal Role | Demo Email | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@campuscare.demo` | `student123` | File new complaints, view ticket tracker, verify fixes, submit 5-star ratings |
| 🛡️ **Administrator** | `admin@campuscare.demo` | `admin123` | Assign technical groups, enforce SLAs, record mandatory resolution notes, view analytics |

> 💡 **Quick Switcher Tip**: You don't need to manually type credentials each time. Use the **Demo Switcher** button located in the top header and inside the left navigation bar to switch between Student and Admin in 1 click.

---

## 💻 Quick Start & Setup Guide

Follow these simple steps to run CampusCare locally on your machine:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18.17.0 or higher recommended).
```bash
node -v
npm -v
```

### 2. Clone the Repository
```bash
git clone https://github.com/harish-karthik-2008/CampusCare.git
cd CampusCare
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize Database & Seed Data
Generate your local SQLite database and populate it with sample categories, tickets, and user accounts:
```bash
npm run db:push
npm run db:seed
```

### 5. Run the Application

#### Option A: Production Mode (Recommended — Fastest Route Switching)
```bash
npm run build
npm start
```
*Open **`http://localhost:3000`** in your browser.*

#### Option B: Development Mode (Live Code Reloading)
```bash
npm run dev
```

---

### 6. Run Automated End-to-End Tests
Verify that all 9 critical workflows (authentication, complaint submission, admin triage, technician assignment, mandatory note enforcement, student verification, feedback rating, and analytics update) pass:
```bash
node scripts/test_demo_flow.mjs
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates user & issues HTTP-only JWT session | Public |
| `POST` | `/api/auth/logout` | Clears authentication session cookie | Public |
| `GET` | `/api/auth/me` | Returns current authenticated user session | Authenticated |
| `GET` | `/api/complaints` | Lists complaints with status, category & keyword search | Authenticated |
| `POST` | `/api/complaints` | Submits a new campus complaint | Student |
| `GET` | `/api/complaints/:id` | Fetches complete complaint record and timeline history | Authenticated |
| `POST` | `/api/complaints/:id/assign` | Assigns complaint to a specialized team & updates status | Admin |
| `POST` | `/api/complaints/:id/confirm` | Student confirms repair or reopens ticket | Student |
| `POST` | `/api/complaints/:id/feedback` | Submits 1-to-5 star rating with comments | Student |
| `GET` | `/api/admin/analytics` | Aggregates campus turnaround hours, SLA % & categories | Admin |
| `GET` | `/api/notifications` | Returns user alerts & unread counter | Authenticated |

---

## 📂 Project Directory Structure

```text
CampusCare/
├── prisma/
│   ├── schema.prisma           # Prisma relational database models
│   ├── seed.ts                 # Realistic campus database seeder script
│   └── dev.db                  # Local SQLite database
├── public/
│   ├── campuscare-logo.png     # Official Bannari Amman Institute of Technology mark
│   └── screenshots/            # High-resolution UI screenshots of all views
├── scripts/
│   ├── test_demo_flow.mjs      # 9-Step automated end-to-end verification script
│   └── capture_screenshots.mjs # Headless browser screenshot generator
├── src/
│   ├── app/
│   │   ├── (auth)/login/       # Authentication page with demo quick-fill
│   │   ├── admin/              # Admin Suite (Dashboard, Complaints, Analytics, Users, Categories)
│   │   ├── student/            # Student Portal (Dashboard, Complaints, Submission, Profile)
│   │   ├── api/                # RESTful API route handlers
│   │   ├── layout.tsx          # Root HTML layout with progress bar
│   │   └── page.tsx            # Main campus landing page
│   ├── components/
│   │   ├── layout/             # AppShell, Fixed Left Sidebar, Fixed Top Navbar, MobileNav
│   │   ├── dashboard/          # Recharts visualizations (Donut, Bar, Inflow area charts)
│   │   ├── complaints/         # 5-Stage visual progress timeline component
│   │   └── ui/                 # Reusable badges (StatusBadge, PriorityBadge, SLAIndicator)
│   └── lib/
│       ├── auth.ts             # JWT token signing, verification & cookie helpers
│       ├── prisma.ts           # Prisma client singleton
│       └── utils.ts            # Formatting utilities (time ago, date formatting)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🏛️ Institution & Credits

Developed for **Bannari Amman Institute of Technology (BIT)** as a Smart Campus Initiative.

- **Developer**: Harish Karthik ([@harish-karthik-2008](https://github.com/harish-karthik-2008))
- **Institution**: Bannari Amman Institute of Technology, Sathyamangalam, Tamil Nadu, India
- **Tagline**: *"Stay Ahead"* &bull; *"Smarter Complaints. Better Campus."*

All rights reserved &copy; 2026 CampusCare.
