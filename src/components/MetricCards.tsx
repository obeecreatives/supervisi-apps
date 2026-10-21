import React from 'react';
import { AppProject } from '../types';
import { Activity, Clock, AlertTriangle, Layers, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  project: AppProject;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ project }) => {
  return (
    <div className="space-y-4">
      {/* Top Level Vital Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Baris Spreadsheet</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {project.metrics.totalRows.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-amber-400/90 flex items-center gap-1 font-medium">
            <span>Ambang bahaya {'>'} 50k baris</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rata-Rata Latensi API</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {project.metrics.avgLatencyMs.toLocaleString()} <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
          <div className="mt-2 text-xs text-cyan-400/90 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Target arsitektur: &lt; 150 ms</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Peak Concurrency</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {project.metrics.peakRequestsPerMinute} <span className="text-sm font-normal text-slate-400">req/min</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span>{project.metrics.dailyActiveUsers} Pengguna Aktif/Hari</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Tingkat Kegagalan (Error)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            {project.metrics.errorRatePercent}%
          </div>
          <div className="mt-2 text-xs text-rose-300/80 flex items-center gap-1 font-medium">
            <span>Mayoritas timeout LockService</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Architecture Readiness Gap Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Indeks Kesiapan Arsitektur Produksi (Architecture Readiness Index)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Analisa komparatif kondisi riil Google Apps Script vs Target Arsitektur Performa Tinggi
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded">
            Audit Level: Lead Architect Review
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.scores.map((score, idx) => (
            <div key={idx} className="bg-slate-950/60 rounded-lg p-3.5 border border-slate-800/70">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-200">{score.label}</span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {score.currentScore}/100 <span className="text-slate-500 font-normal">→ Target {score.targetScore}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2 relative">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    score.currentScore < 40
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                      : score.currentScore < 70
                      ? 'bg-gradient-to-r from-amber-500 to-cyan-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${score.currentScore}%` }}
                />
              </div>

              <div className="flex items-start justify-between text-[11px] gap-2 pt-1 border-t border-slate-800/50">
                <div className="text-slate-400">
                  <span className="text-rose-400 font-medium">Kondisi Kini:</span> {score.currentValue}
                </div>
                <div className="text-right text-emerald-400 font-medium">
                  <span>Target:</span> {score.targetValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
