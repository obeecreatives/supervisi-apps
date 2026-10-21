import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import { AppProject } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose, project }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportMarkdown = `
# DOKUMEN REKOMENDASI TEKNIS & MODERNISASI ARSITEKTUR
**Sistem**: ${project.name}
**Kategori**: ${project.category}
**Tanggal Audit**: 20 Oktober 2026
**Peran**: Lead Developer / Software Architect

---

## 1. Ringkasan Eksekutif (Executive Summary)
Aplikasi saat ini beroperasi menggunakan tumpukan teknologi Google Apps Script (GAS) dan Google Sheets dengan volume data sebesar **${project.metrics.totalRows.toLocaleString()} baris** dan rata-rata latensi API **${project.metrics.avgLatencyMs.toLocaleString()} ms**.
Meskipun Google Sheets memberikan kemudahan di fase prototyping awal, sistem kini menghadapi kendala skalabilitas serius pada jam sibuk dengan tingkat kegagalan sebesar **${project.metrics.errorRatePercent}%**.

---

## 2. Profil Arsitektur Eksisting & Tautan Resource
- **Frontend**: ${project.currentStack.frontend}
- **Backend / API**: ${project.currentStack.backend}
- **Database Primer**: ${project.currentStack.database}
- **Target Arsitektur**: ${project.targetDatabase || 'PostgreSQL / Cloud SQL'}
- **Status Supervisi**: ${project.supervisionStatus || 'Dalam Audit'}
- **Tautan Sheet Sumber**: ${project.links?.sourceSheetUrl || 'Belum diisi'}
- **Tautan Sheet Tujuan/Report**: ${project.links?.destinationSheetUrl || 'Belum diisi'}
- **Tautan Script GAS**: ${project.links?.gasScriptUrl || 'Belum diisi'}
- **Tautan Web App Aktif**: ${project.links?.webAppDeploymentUrl || 'Belum diisi'}
- **Pengguna Aktif Harian (DAU)**: ${project.metrics.dailyActiveUsers} pengguna
- **Peak Request Rate**: ${project.metrics.peakRequestsPerMinute} req/menit

${project.criticalNotes ? `### Catatan Kritis Lapangan (Bottleneck User):\n${project.criticalNotes}\n` : ''}
${project.leadRecommendationNotes ? `### Catatan Arahan Lead Developer:\n${project.leadRecommendationNotes}\n` : ''}

---

## 3. Identifikasi Masalah & Bottleneck Kunci
${project.bottlenecks.map((b, i) => `### 3.${i + 1}. ${b.title} [Tingkat: ${b.severity.toUpperCase()}]
- **Deskripsi Masalah**: ${b.description}
- **Dampak Operasional**: ${b.impact}
- **Akar Limitasi Google Apps Script**: ${b.gasLimitContext}
- **Solusi Arsitektur Direkomendasikan**: ${b.recommendedSolution}
`).join('\n')}

---

## 4. Rekomendasi Teknis Spesifik (Target Arsitektur)
${project.recommendations.map((r, i) => `### 4.${i + 1}. [${r.domain}] ${r.title} (Prioritas: ${r.priority})
- **Ringkasan Solusi**: ${r.summary}
- **Arsitektur Sekarang**: ${r.currentArchitecture}
- **Target Arsitektur Baru**: ${r.proposedArchitecture}
- **Estimasi Efisiensi (Gain)**: ${r.expectedGain}
- **Tech Stack Kunci**: ${r.keyTechStack.join(', ')}
- **Langkah Tindakan**:
${r.actionSteps.map((s) => `  * ${s}`).join('\n')}
`).join('\n')}

---

## 5. Rencana Transisi & Roadmap Pelaksanaan
${project.roadmap.map((p) => `### Fase ${p.phaseNumber}: ${p.name} (${p.duration}) - Status: ${p.status.toUpperCase()}
- **Tujuan**: ${p.objective}
- **Deliverables**:
${p.deliverables.map((d) => `  * ${d}`).join('\n')}
- **Mitigasi Risiko**: ${p.riskMitigation}
`).join('\n')}

---
*Diterbitkan oleh Lead Developer & Engineering Architecture Team.*
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 relative shadow-2xl my-8 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Laporan Rekomendasi Teknis Arsitektur</h3>
              <p className="text-xs text-slate-400">Siap dicetak atau disalin untuk dokumentasi manajemen</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Markdown'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {reportMarkdown}
        </div>
      </div>
    </div>
  );
};
