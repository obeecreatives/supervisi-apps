import React, { useState } from 'react';
import { initialProjects } from './data/mockApps';
import { AppProject } from './types';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { BottlenecksList } from './components/BottlenecksList';
import { TechnicalRecommendationsTab } from './components/TechnicalRecommendationsTab';
import { RoadmapTab } from './components/RoadmapTab';
import { CodePlaygroundTab } from './components/CodePlaygroundTab';
import { ArchitectureComparisonTab } from './components/ArchitectureComparisonTab';
import { DiagnosticCalculatorTab } from './components/DiagnosticCalculatorTab';
import { IntakeChecklistTab } from './components/IntakeChecklistTab';
import { AppDossierManagerTab } from './components/AppDossierManagerTab';
import { NewAuditModal } from './components/NewAuditModal';
import { ExportReportModal } from './components/ExportReportModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import {
  Shield,
  Layers,
  AlertOctagon,
  FileCode2,
  Calendar,
  Database,
  Calculator,
  Smartphone,
  Zap,
  CheckCircle2,
  ArrowRight,
  ClipboardList,
  FolderKanban
} from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<AppProject[]>(() => {
    try {
      const saved = localStorage.getItem('gas_supervision_projects');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return initialProjects;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return projects[0]?.id || initialProjects[0].id;
  });

  const [activeTab, setActiveTab] = useState<
    'dossier' | 'audit' | 'recommendations' | 'roadmap' | 'comparison' | 'calculator' | 'code' | 'checklist'
  >('dossier');

  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || initialProjects[0];

  const handleAddProject = (newProject: AppProject) => {
    const updated = [newProject, ...projects];
    setProjects(updated);
    setActiveProjectId(newProject.id);
    setActiveTab('dossier');
    try {
      localStorage.setItem('gas_supervision_projects', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleUpdateProject = (updatedProj: AppProject) => {
    const updated = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    setProjects(updated);
    try {
      localStorage.setItem('gas_supervision_projects', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <Header
        activeProjectName={activeProject.name}
        onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
        onExportReport={() => setIsExportModalOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Lead Developer Role & Commitment Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Lead Developer Statement & Readiness
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Siap Melaksanakan Supervisi Penuh & Transformasi Arsitektur
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Saya bersedia dan siap bertindak sebagai <strong>Lead Developer & Solutions Architect</strong> untuk mengawasi seluruh ekosistem web apps berbasis Google Apps Script Anda. Fokus utama kita adalah <strong>eliminasi bottleneck latensi, mitigasi limit kuota/timeout GAS, migrasi ke database ACID (PostgreSQL / Cloud SQL) yang tangguh, serta pembangunan aplikasi Android Native (Offline-First) berkinerja tinggi</strong>.
              </p>
            </div>

            {/* Quick Pillars */}
            <div className="grid grid-cols-2 gap-2 text-xs shrink-0">
              <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-lg">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Database Tangguh
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">PostgreSQL ACID & Pool</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-lg">
                <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> Android Native
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Jetpack Compose + Room</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-lg">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Sub-150ms Latency
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Node.js API + Redis</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-lg">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Zero Data Loss
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Two-Way Safe Sync</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* App Switcher Tabs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Pilih Web App dalam Supervisi ({projects.length} Sistem Terdaftar):
            </span>
            <span className="text-[11px] text-slate-400">
              Sistem Aktif: <strong className="text-white">{activeProject.name}</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`text-left px-3.5 py-2 rounded-lg text-xs transition-all border flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-slate-800 border-emerald-500/70 text-white font-semibold shadow-sm ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-medium text-slate-200">{proj.name}</div>
                    <div className="text-[10px] text-slate-500">{proj.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Project Info Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  {activeProject.category}
                </span>
                <span className="text-xs text-slate-400">Status: Supervisi Aktif</span>
              </div>
              <h3 className="text-lg font-bold text-white">{activeProject.name}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-4xl">{activeProject.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800 shrink-0">
              <div>
                <span className="text-[10px] text-slate-500 block">Database Eksisting</span>
                <span className="font-mono text-slate-300 font-medium">{activeProject.currentStack.database}</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] text-slate-500 block">Backend</span>
                <span className="font-mono text-slate-300 font-medium">{activeProject.currentStack.backend}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-b border-slate-800 flex overflow-x-auto gap-1 sm:gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dossier'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-emerald-400" />
            <span>Dossier, Link & Catatan Proyek</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
              Hub
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-cyan-400" />
            <span>Panduan Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Audit & Temuan Bottleneck</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'recommendations'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Rekomendasi Teknis Terperinci</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Roadmap & Tahapan Eksekusi</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Komparasi Arsitektur Database</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Diagnostik Kuota</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Pola Kode (GAS vs Modern)</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'dossier' && (
            <AppDossierManagerTab
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              onOpenNewAudit={() => setIsNewAuditModalOpen(true)}
            />
          )}

          {activeTab === 'checklist' && (
            <IntakeChecklistTab />
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <MetricCards project={activeProject} />
              <BottlenecksList bottlenecks={activeProject.bottlenecks} />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <TechnicalRecommendationsTab recommendations={activeProject.recommendations} />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapTab roadmap={activeProject.roadmap} />
          )}

          {activeTab === 'comparison' && (
            <ArchitectureComparisonTab />
          )}

          {activeTab === 'calculator' && (
            <DiagnosticCalculatorTab />
          )}

          {activeTab === 'code' && (
            <CodePlaygroundTab snippets={activeProject.codeSnippets} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="text-slate-400">
            Enterprise Architecture & Modernization Console • Disiapkan untuk supervisi Google Apps Script, PostgreSQL, dan Android Native.
          </p>
          <p className="text-[11px] text-slate-600">
            Dikelola oleh Lead Developer & Engineering Architecture Team
          </p>
        </div>
      </footer>

      {/* Modals */}
      <NewAuditModal
        isOpen={isNewAuditModalOpen}
        onClose={() => setIsNewAuditModalOpen(false)}
        onAddProject={handleAddProject}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={activeProject}
      />

      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
