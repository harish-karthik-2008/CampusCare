import React from "react";

export default function StudentLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 rounded-lg" />
          <div className="h-4 w-80 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-purple-100 rounded-xl" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
            <div className="h-8 w-12 bg-slate-200 rounded-md" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl flex items-center px-4 gap-4">
              <div className="h-4 w-16 bg-purple-100 rounded" />
              <div className="h-4 w-48 bg-slate-200 rounded flex-1" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
