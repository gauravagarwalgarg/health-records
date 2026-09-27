"use client";
import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ResultsDashboard from "@/components/ResultsDashboard";
import { HealthReport } from "@/lib/types";

export default function Home() {
  const [report, setReport] = useState<HealthReport | null>(null);

  if (report) {
    return <ResultsDashboard report={report} onReset={() => setReport(null)} />;
  }

  return <UploadZone onResult={setReport} />;
}
