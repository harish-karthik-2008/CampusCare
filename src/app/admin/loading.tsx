import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-purple-100 rounded-xl" />
      </div>

      {/* 6 metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-12 bg-slate-200 rounded" />
              <div className="w-5 h-5 rounded bg-slate-100" />
            </div>
            <div className="h-7 w-10 bg-slate-200 rounded" />
            <div className="h-2.5 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs h-64 space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 text-xs">
              Loading metrics...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
