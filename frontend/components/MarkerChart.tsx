"use client";
import {
  ComposedChart, Bar, Cell, ReferenceLine, ReferenceArea,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from "recharts";
import { Marker } from "@/lib/types";

interface Props {
  marker: Marker;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs">
        <p className="text-slate-400">Patient Value</p>
        <p className="text-white font-bold text-base">{payload[0]?.value} {payload[0]?.payload?.unit}</p>
      </div>
    );
  }
  return null;
};

export default function MarkerChart({ marker }: Props) {
  const isNormal = marker.status === "Normal";
  const isHigh = marker.status === "High";
  const isLow = marker.status === "Low";

  const barColor = isNormal ? "#10b981" : isHigh ? "#ef4444" : "#f59e0b";
  const statusBg = isNormal ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : isHigh ? "bg-red-500/10 text-red-400 border-red-500/30"
    : "bg-amber-500/10 text-amber-400 border-amber-500/30";

  // Determine Y axis domain with padding
  const rangeSpan = marker.max_range - marker.min_range;
  const padding = rangeSpan * 0.5;
  const yMin = Math.max(0, Math.min(marker.min_range, marker.patient_value) - padding);
  const yMax = Math.max(marker.max_range, marker.patient_value) + padding;

  const data = [{ name: marker.name, value: marker.patient_value, unit: marker.unit }];

  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-3 hover:border-indigo-500/30 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">{marker.name}</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Normal: {marker.min_range}–{marker.max_range} {marker.unit}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${statusBg}`}>
          {isNormal ? "✓" : isHigh ? "↑" : "↓"} {marker.status}
        </div>
      </div>

      {/* Value display */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold" style={{ color: barColor }}>
          {marker.patient_value}
        </span>
        <span className="text-slate-400 text-sm">{marker.unit}</span>
      </div>

      {/* Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" hide />
            <YAxis domain={[yMin, yMax]} tick={{ fill: "#64748b", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {/* Green normal range band */}
            <ReferenceArea
              y1={marker.min_range}
              y2={marker.max_range}
              fill="#10b981"
              fillOpacity={0.12}
              stroke="#10b981"
              strokeOpacity={0.3}
              strokeDasharray="4 4"
            />
            {/* Patient value bar */}
            <Bar dataKey="value" maxBarSize={48} radius={[6, 6, 0, 0]}>
              <Cell fill={barColor} />
            </Bar>
            {/* Min/Max reference lines */}
            <ReferenceLine y={marker.min_range} stroke="#10b981" strokeOpacity={0.5} strokeDasharray="4 4" />
            <ReferenceLine y={marker.max_range} stroke="#10b981" strokeOpacity={0.5} strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
