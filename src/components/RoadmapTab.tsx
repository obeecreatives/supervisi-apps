import React from 'react';
import { RoadmapPhase } from '../types';
import { Calendar, CheckCircle2, Circle, AlertCircle, ArrowRight } from 'lucide-react';

interface RoadmapTabProps {
  roadmap: RoadmapPhase[];
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({ roadmap }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Roadmap Strategis & Timeline Eksekusi (Phase-by-Phase)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Jadwal transisi bertahap untuk memastikan zero downtime dan zero data loss pada operasional bisnis
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
          </span>
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <Circle className="w-3.5 h-3.5 fill-cyan-400" /> Berjalan
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Circle className="w-3.5 h-3.5" /> Terencana
          </span>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {roadmap.map((phase) => (
          <div key={phase.phaseNumber} className="relative group">
            {/* Phase Node Dot */}
            <div
              className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[11px] font-bold ${
                phase.status === 'completed'
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                  : phase.status === 'in_progress'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-4 ring-cyan-500/20'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              {phase.phaseNumber}
            </div>

            {/* Card Content */}
            <div className="bg-slate-900/90 border border-slate-800 group-hover:border-slate-700 rounded-xl p-5 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    FASE {phase.phaseNumber}
                  </span>
                  <h4 className="text-base font-bold text-white">{phase.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 px-2.5 py-0.5 rounded font-mono font-semibold">
                    {phase.duration}
                  </span>
                  <span
                    className={`text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      phase.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-300'
                        : phase.status === 'in_progress'
                        ? 'bg-cyan-950 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {phase.status === 'in_progress' ? 'Sedang Berjalan' : phase.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/70 mb-3 text-xs">
                <span className="font-semibold text-slate-300">Tujuan Strategis: </span>
                <span className="text-slate-300">{phase.objective}</span>
              </div>

              {/* Deliverables */}
              <div className="mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Deliverable & Milestone Kunci:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {phase.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Mitigation */}
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-2.5 text-xs flex items-start gap-2 text-amber-200/90">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 font-semibold">Mitigasi Risiko: </strong>
                  <span>{phase.riskMitigation}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
