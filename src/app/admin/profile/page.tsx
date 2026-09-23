"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Building, Shield, Check } from "lucide-react";

export default function AdminProfilePage() {
  const [name, setName] = useState("Dr. Rajesh Kumar");
  const [email, setEmail] = useState("admin@campuscare.demo");
  const [department, setDepartment] = useState("Campus Administration & Facilities");
  const [phone, setPhone] = useState("+91 98421 23456");
  const [isSaved, setIsSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Profile & Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage administrative credentials, campus directory details, and system alerts.</p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Administrator settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl ring-4 ring-purple-50">
            RK
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{name}</h2>
            <p className="text-xs text-slate-500">{department}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Campus Chief Administrator
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Name</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Administrative Email</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Department Unit</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Office Phone</label>
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

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20"
          >
            Save Admin Settings
          </button>
        </div>
      </form>
    </div>
  );
}
