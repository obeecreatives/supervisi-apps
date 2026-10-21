import React from 'react';
import { ShieldCheck, Database, Smartphone, Zap, FileText, GitBranch } from 'lucide-react';

interface HeaderProps {
  onOpenNewAudit: () => void;
  onExportReport: () => void;
  onOpenDeployGuide: () => void;
  activeProjectName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewAudit,
  onExportReport,
  onOpenDeployGuide,
  activeProjectName,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Lead Developer Supervisi
                </span>
                <span className="text-xs text-slate-400">Web Apps & Android Modernization</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Enterprise GAS & Database Modernization Hub
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Database className="w-3.5 h-3.5" /> Cloud SQL / Postgres
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-3.5 h-3.5" /> High Concurrency
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Smartphone className="w-3.5 h-3.5" /> Android Offline-First
              </span>
            </div>

            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors shadow-sm"
              title="Panduan push GitHub & deploy ke Vercel"
            >
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>Deploy GitHub & Vercel</span>
            </button>

            <button
              onClick={onExportReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors shadow-sm"
              title="Cetak atau unduh dokumen rekomendasi arsitektur"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Ekspor Rekomendasi</span>
            </button>

            <button
              onClick={onOpenNewAudit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>+ Supervisi Web App Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
