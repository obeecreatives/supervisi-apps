import React, { useState } from 'react';
import { TechnicalRecommendation } from '../types';
import { ShieldCheck, ArrowRight, CheckSquare, Layers, Clock, Zap, Database, Smartphone } from 'lucide-react';

interface TechnicalRecommendationsTabProps {
  recommendations: TechnicalRecommendation[];
}

export const TechnicalRecommendationsTab: React.FC<TechnicalRecommendationsTabProps> = ({ recommendations }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const categories = ['all', 'Database & Storage', 'API & Gateway', 'Android & Mobile Client', 'Backend Caching', 'Security & Auth'];

  const filtered = selectedFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.domain === selectedFilter);

  const getDomainIcon = (domain: TechnicalRecommendation['domain']) => {
    switch (domain) {
      case 'Database & Storage':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'API & Gateway':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Android & Mobile Client':
        return <Smartphone className="w-4 h-4 text-indigo-400" />;
      default:
        return <Layers className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Rekomendasi Teknis Terperinci (Lead Developer Blueprint)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Langkah terukur untuk migrasi dari spreadsheet ke sistem skala tinggi dan Android Native
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'Semua Domain' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  {getDomainIcon(rec.domain)}
                  {rec.domain}
                </span>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    rec.priority.startsWith('P0')
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : rec.priority.startsWith('P1')
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {rec.priority}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Estimasi: <strong className="text-slate-200">{rec.implementationEffort}</strong></span>
              </div>
            </div>

            <h4 className="text-base font-bold text-white mb-2">{rec.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{rec.summary}</p>

            {/* Architecture Diff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] font-semibold text-rose-400 block mb-1">
                  🔴 Arsitektur Saat Ini (Legacy GAS)
                </span>
                <p className="text-xs text-slate-400 leading-normal">{rec.currentArchitecture}</p>
              </div>

              <div className="bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-900/50">
                <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                  🟢 Target Arsitektur Baru (High Performance)
                </span>
                <p className="text-xs text-emerald-200/90 leading-normal">{rec.proposedArchitecture}</p>
              </div>
            </div>

            {/* Gain and Tech Stack */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/80 mb-4 text-xs">
              <div>
                <span className="text-slate-400">Keuntungan Terukur (ROI/Gain): </span>
                <strong className="text-emerald-400 font-semibold">{rec.expectedGain}</strong>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Tech Stack:</span>
                {rec.keyTechStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Steps */}
            <div>
              <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Langkah Eksekusi Lapangan (Tactical Action Steps):
              </h5>
              <div className="space-y-1.5">
                {rec.actionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
