"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Sparkles,
  Info,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export default function NewComplaintPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationBuilding, setLocationBuilding] = useState("");
  const [locationBlock, setLocationBlock] = useState("");
  const [locationRoom, setLocationRoom] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories.filter((c: any) => c.isActive !== false));
          setCategoryId(data.categories[0].id);
        }
      })
      .catch(() => {});
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "File must be smaller than 5MB" }));
      return;
    }

    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentPreview(reader.result as string);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!categoryId) newErrors.category = "Please select a category";
    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    if (!description.trim() || description.trim().length < 15) {
      newErrors.description = "Please describe the problem in at least 15 characters";
    }
    if (!locationBuilding.trim()) {
      newErrors.locationBuilding = "Building / Campus zone is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          title,
          description,
          locationBuilding,
          locationBlock,
          locationRoom,
          priority,
          attachmentUrl: attachmentPreview,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit complaint");
      }

      setSuccessId(data.complaint.id);
      setTimeout(() => {
        router.push(`/student/complaints/${data.complaint.id}`);
      }, 1500);
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to submit complaint. Try again." });
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/student/complaints"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Submit a Campus Complaint
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log an issue to be routed to campus maintenance, IT, hostel, or transport teams.
          </p>
        </div>
      </div>

      {successId && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Complaint Submitted Successfully!</p>
            <p className="text-xs text-emerald-700">
              Ticket created. Redirecting to your complaint timeline...
            </p>
          </div>
        </div>
      )}

      {errors.form && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 sm:p-8 space-y-6">
        {/* Category & Priority Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Complaint Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-campus w-full px-3 py-2.5 text-xs sm:text-sm font-semibold"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-[11px] mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Urgency Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "NORMAL", label: "Normal (72h)" },
                { val: "HIGH", label: "High (48h)" },
                { val: "CRITICAL", label: "Critical (24h)" },
              ].map((p) => (
                <button
                  type="button"
                  key={p.val}
                  onClick={() => setPriority(p.val)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    priority === p.val
                      ? p.val === "CRITICAL"
                        ? "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200"
                        : p.val === "HIGH"
                        ? "bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-200"
                        : "bg-purple-50 border-purple-500 text-purple-700 ring-2 ring-purple-200"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {priority === "CRITICAL" && (
              <p className="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Critical issues (safety hazard/power loss) require admin technical verification.
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Complaint Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Wi-Fi not working in Hostel Block B"
            className="input-campus w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium"
          />
          {errors.title && (
            <p className="text-red-500 text-[11px] mt-1">{errors.title}</p>
          )}
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Detailed Problem Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain the specific issue, what equipment is affected, and when it started occurring..."
            className="input-campus w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium"
          />
          {errors.description && (
            <p className="text-red-500 text-[11px] mt-1">{errors.description}</p>
          )}
        </div>

        {/* Location Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Location Details <span className="text-red-500">*</span>
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <input
                type="text"
                value={locationBuilding}
                onChange={(e) => setLocationBuilding(e.target.value)}
                placeholder="Building / Hostel *"
                className="input-campus w-full px-3 py-2 text-xs font-medium"
              />
              {errors.locationBuilding && (
                <p className="text-red-500 text-[10px] mt-1">{errors.locationBuilding}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={locationBlock}
                onChange={(e) => setLocationBlock(e.target.value)}
                placeholder="Block / Floor (e.g. Block B, 3rd Floor)"
                className="input-campus w-full px-3 py-2 text-xs font-medium"
              />
            </div>
            <div>
              <input
                type="text"
                value={locationRoom}
                onChange={(e) => setLocationRoom(e.target.value)}
                placeholder="Room / Area (e.g. Room 304, Circuit Lab)"
                className="input-campus w-full px-3 py-2 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Attachment Upload Box */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Attach Evidence or Photo (Optional)
          </label>

          {attachmentPreview ? (
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {attachmentPreview.startsWith("data:image") ? (
                  <img
                    src={attachmentPreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-purple-200"
                  />
                ) : (
                  <FileText className="w-8 h-8 text-purple-600" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900">{attachmentName || "Attached file"}</p>
                  <p className="text-[10px] text-slate-500">Ready for upload</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAttachmentPreview(null);
                  setAttachmentName(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-purple-50/30">
              <Upload className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Click to upload an image or PDF document
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or PDF up to 5MB</p>
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
          {errors.file && (
            <p className="text-red-500 text-[11px] mt-1">{errors.file}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/student/complaints"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading || Boolean(successId)}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Submit Complaint</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
