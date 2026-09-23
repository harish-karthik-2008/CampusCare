"use client";

import React, { useState, useEffect } from "react";
import { Tags, Plus, Check, X, Layers, AlertCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    if (!newCatName.trim()) {
      setAddError("Category name is required");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), description: newCatDesc.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");
      setNewCatName("");
      setNewCatDesc("");
      setShowAddForm(false);
      await fetchCategories();
    } catch (err: any) {
      setAddError(err.message);
    }
  }

  async function toggleCategory(id: string, currentActive: boolean) {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentActive } : c))
        );
      }
    } catch {
      alert("Failed to toggle category status");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Departments & Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure department classifications and service routing for student complaints.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Add Category Drawer/Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCategory}
          className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Create New Department Category</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {addError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>{addError}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Sports Equipment / Gym"
                className="input-campus w-full px-3 py-2 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scope Description
              </label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief description of matters covered under this category..."
                className="input-campus w-full px-3 py-2 text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 p-16 text-center text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-2" />
            Loading categories...
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {c.description || "General campus maintenance area."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{c._count?.complaints || 0} lifetime tickets</span>
                <button
                  type="button"
                  onClick={() => toggleCategory(c.id, c.isActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    c.isActive
                      ? "text-red-700 bg-red-50 hover:bg-red-100"
                      : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  {c.isActive ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
