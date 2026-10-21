import React from 'react';
import { BottleneckItem } from '../types';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, Cpu } from 'lucide-react';

interface BottlenecksListProps {
  bottlenecks: BottleneckItem[];
}

export const BottlenecksList: React.FC<BottlenecksListProps> = ({ bottlenecks }) => {
  const getSeverityBadge = (severity: BottleneckItem['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            CRITICAL BOTTLENECK
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            HIGH RISK
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400 bg-yellow-950/80 border border-yellow-800/80 px-2 py-0.5 rounded">
            <Info className="w-3 h-3 text-yellow-400" />
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
            LOW
          </span>
        );
    }
  };

  const getCategoryBadge = (category: BottleneckItem['category']) => {
    const labels = {
      database: 'Database & Sheets I/O',
      api: 'API Latency & Gateway',
      concurrency: 'Locking & Concurrency',
      mobile: 'Mobile Client & Offline',
      security: 'Security & Auth',
    };
    return (
      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-800/90 px-2 py-0.5 rounded">
        {labels[category] || category}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            Temuan Bottleneck & Vulnerabilitas Arsitektur Teridentifikasi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar kelemahan struktural pada Google Apps Script & Spreadsheet yang menghambat skalabilitas
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
          Total {bottlenecks.length} Isu Terdeteksi
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {bottlenecks.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                {getSeverityBadge(item.severity)}
                {getCategoryBadge(item.category)}
              </div>
              <span className="text-[11px] font-mono text-slate-500">ID: {item.id}</span>
            </div>

            <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800/70 mb-3">
              <div>
                <span className="font-semibold text-rose-400 flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Dampak Operasional & Bisnis:
                </span>
                <p className="text-slate-300 leading-normal">{item.impact}</p>
              </div>
              <div>
                <span className="font-semibold text-amber-400 flex items-center gap-1 mb-1">
                  <Cpu className="w-3.5 h-3.5" /> Konteks Limitasi Google Apps Script:
                </span>
                <p className="text-slate-400 leading-normal">{item.gasLimitContext}</p>
              </div>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-3 text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Rekomendasi Solusi Lead Developer:
              </span>
              <p className="text-emerald-200/90 leading-relaxed">{item.recommendedSolution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
