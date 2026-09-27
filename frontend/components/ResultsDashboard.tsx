"use client";
import { HealthReport } from "@/lib/types";
import MarkerChart from "./MarkerChart";

interface Props {
  report: HealthReport;
  onReset: () => void;
}

export default function ResultsDashboard({ report, onReset }: Props) {
  const abnormal = report.markers.filter((m) => m.status !== "Normal");
  const normal   = report.markers.filter((m) => m.status === "Normal");

  const score = Math.round((normal.length / report.markers.length) * 100);
  const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">

      {/* Top nav */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm">🏥</div>
          <span className="text-white font-semibold">Health Records AI</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all text-sm"
        >
          ← Upload Another
        </button>
      </div>

      {/* Report header */}
      <div className="glass rounded-2xl p-6 mb-6 glow-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {report.test_type}
              </span>
              <span className="text-slate-500 text-xs">{report.filename}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Analysis Results</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{report.overall_analysis}</p>
          </div>

          {/* Health Score */}
          <div className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl border border-slate-700/50 bg-slate-800/50 shrink-0">
            <span className="text-4xl font-bold" style={{ color: scoreColor }}>{score}%</span>
            <span className="text-slate-400 text-xs mt-1">Health Score</span>
            <span className="text-slate-600 text-xs">{normal.length}/{report.markers.length} normal</span>
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-4 mt-5 pt-5 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 text-sm">{normal.length} Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-slate-400 text-sm">{report.markers.filter(m => m.status === "High").length} High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-400 text-sm">{report.markers.filter(m => m.status === "Low").length} Low</span>
          </div>
          <div className="ml-auto text-slate-500 text-xs">{report.markers.length} markers analyzed</div>
        </div>
      </div>

      {/* Abnormal markers (prioritized) */}
      {abnormal.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Out-of-Range Markers
            <span className="text-xs text-slate-500 font-normal ml-1">({abnormal.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {abnormal.map((m) => <MarkerChart key={m.name} marker={m} />)}
          </div>
        </div>
      )}

      {/* Normal markers */}
      {normal.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Normal Markers
            <span className="text-xs text-slate-500 font-normal ml-1">({normal.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {normal.map((m) => <MarkerChart key={m.name} marker={m} />)}
          </div>
        </div>
      )}

      {/* Recommended Fixes */}
      {report.suggested_fixes.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-red-500/10">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-xl">💊</span> Recommended Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.suggested_fixes.map((fix, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-slate-600 text-xs mt-8">
        ⚕ This analysis is AI-generated for informational purposes only. Always consult a qualified healthcare professional.
      </p>
    </div>
  );
}
