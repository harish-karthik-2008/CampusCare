"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Building, Shield, Bell, Check, KeyRound } from "lucide-react";

export default function StudentProfilePage() {
  const [name, setName] = useState("Priya Sharma");
  const [email, setEmail] = useState("student@campuscare.demo");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [phone, setPhone] = useState("+91 97890 12345");
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSMS, setNotificationsSMS] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Profile & Preferences</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your campus identity, contact information, and notifications.</p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl ring-4 ring-purple-50">
            PS
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{name}</h2>
            <p className="text-xs text-slate-500">{department}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Verified Student Account
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-campus w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={email}
                className="input-campus w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Department / Faculty</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-campus w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-campus w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Resolution Alert Preferences
          </h3>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={notificationsEmail}
                onChange={(e) => setNotificationsEmail(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Send instant email updates when complaint status changes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={notificationsSMS}
                onChange={(e) => setNotificationsSMS(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Receive SMS alerts for critical facility escalations</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
