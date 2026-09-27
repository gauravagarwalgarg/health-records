"use client";
import { useCallback, useState } from "react";
import { analyzeReport } from "@/lib/api";
import { HealthReport } from "@/lib/types";

interface Props {
  onResult: (report: HealthReport) => void;
}

export default function UploadZone({ onResult }: Props) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setError(null);
    setLoading(true);
    setProgress("Extracting text from PDF...");
    try {
      setTimeout(() => setProgress("Analyzing with Gemini AI..."), 1500);
      const report = await analyzeReport(file);
      onResult(report);
    } catch (e: any) {
      setError(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
      setProgress("");
    }
  }, [onResult]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-indigo-400 border border-indigo-500/30">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          AI-Powered Medical Analysis
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Health Records
          <br />
          <span className="text-indigo-400">Test Analysis</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Upload your lab report PDF for instant AI-powered biomarker analysis and actionable health insights.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative w-full max-w-lg rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${dragging ? "border-indigo-400 bg-indigo-500/10 scale-105" : "border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5"}
          ${loading ? "pointer-events-none opacity-70" : ""}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !loading && document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
          {loading ? (
            <>
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-400 animate-spin" />
              <p className="text-indigo-300 font-medium text-lg">{progress || "Processing..."}</p>
              <p className="text-slate-500 text-sm">This may take 10–30 seconds</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-2">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-xl mb-1">Drop your lab report here</p>
                <p className="text-slate-400">or <span className="text-indigo-400 underline">click to browse</span></p>
              </div>
              <p className="text-slate-600 text-sm mt-2">Supports: CBC, Lipid Panel, Full Body Blood Tests · PDF only</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm max-w-lg w-full text-center">
          {error}
        </div>
      )}

      {/* Feature cards */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg w-full">
          {[
            { icon: "🔬", title: "Deep Analysis", desc: "Every biomarker extracted and evaluated" },
            { icon: "📊", title: "Visual Charts", desc: "Interactive range charts per marker" },
            { icon: "💊", title: "Action Plan", desc: "Specific dietary & lifestyle advice" },
          ].map((f) => (
            <div key={f.title} className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-white text-xs font-semibold mb-1">{f.title}</p>
              <p className="text-slate-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
