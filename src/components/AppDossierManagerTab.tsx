import React, { useState } from 'react';
import { AppProject, SupervisionStatus, AttachedDocument } from '../types';
import {
  FolderKanban,
  ExternalLink,
  Copy,
  Check,
  Save,
  FileSpreadsheet,
  FileCode,
  Globe,
  AlertTriangle,
  ShieldCheck,
  GitBranch,
  Database,
  Smartphone,
  Edit3,
  Layers,
  Sparkles,
  FileUp,
  FileText,
  Download,
  Trash2,
  Paperclip
} from 'lucide-react';

interface AppDossierManagerTabProps {
  project: AppProject;
  onUpdateProject: (updated: AppProject) => void;
  onOpenNewAudit: () => void;
}

export const AppDossierManagerTab: React.FC<AppDossierManagerTabProps> = ({
  project,
  onUpdateProject,
  onOpenNewAudit,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: project.name,
    category: project.category,
    description: project.description,
    supervisionStatus: project.supervisionStatus || 'audit',
    targetDatabase: project.targetDatabase || 'postgresql',
    sourceSheetUrl: project.links?.sourceSheetUrl || '',
    destinationSheetUrl: project.links?.destinationSheetUrl || '',
    gasScriptUrl: project.links?.gasScriptUrl || '',
    webAppDeploymentUrl: project.links?.webAppDeploymentUrl || '',
    repoUrl: project.links?.repoUrl || '',
    criticalNotes: project.criticalNotes || '',
    leadRecommendationNotes: project.leadRecommendationNotes || '',
    attachedDocs: project.attachedDocs || [],
  });

  // Sync if project changes
  React.useEffect(() => {
    setFormData({
      name: project.name,
      category: project.category,
      description: project.description,
      supervisionStatus: project.supervisionStatus || 'audit',
      targetDatabase: project.targetDatabase || 'postgresql',
      sourceSheetUrl: project.links?.sourceSheetUrl || '',
      destinationSheetUrl: project.links?.destinationSheetUrl || '',
      gasScriptUrl: project.links?.gasScriptUrl || '',
      webAppDeploymentUrl: project.links?.webAppDeploymentUrl || '',
      repoUrl: project.links?.repoUrl || '',
      criticalNotes: project.criticalNotes || '',
      leadRecommendationNotes: project.leadRecommendationNotes || '',
      attachedDocs: project.attachedDocs || [],
    });
    setIsEditing(false);
  }, [project.id]);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const doc: AttachedDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/docx'),
          uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          dataUrl: reader.result as string,
        };
        setFormData((prev) => ({
          ...prev,
          attachedDocs: [...prev.attachedDocs, doc],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveDoc = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachedDocs: prev.attachedDocs.filter((d) => d.id !== id),
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: AppProject = {
      ...project,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      supervisionStatus: formData.supervisionStatus as SupervisionStatus,
      targetDatabase: formData.targetDatabase as any,
      attachedDocs: formData.attachedDocs.length > 0 ? formData.attachedDocs : undefined,
      links: {
        sourceSheetUrl: formData.sourceSheetUrl,
        destinationSheetUrl: formData.destinationSheetUrl,
        gasScriptUrl: formData.gasScriptUrl,
        webAppDeploymentUrl: formData.webAppDeploymentUrl,
        repoUrl: formData.repoUrl,
      },
      criticalNotes: formData.criticalNotes,
      leadRecommendationNotes: formData.leadRecommendationNotes,
    };

    onUpdateProject(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getStatusBadge = (status?: SupervisionStatus) => {
    switch (status) {
      case 'audit':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80">
            Audit & Analisa Awal
          </span>
        );
      case 'refactoring_gas':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            Refactoring Script GAS
          </span>
        );
      case 'database_migration':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80">
            Migrasi Cloud SQL / Postgres
          </span>
        );
      case 'android_dev':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80">
            Pengembangan Android Native
          </span>
        );
      case 'production_ready':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
            Produksi Siap & Stabil
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
            Dalam Supervisi
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/20 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2 py-0.5 rounded">
                Buku Kontrol Supervisi Proyek
              </span>
              {getStatusBadge(formData.supervisionStatus as SupervisionStatus)}
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-emerald-400" />
              Dossier & Inventaris Teknis: {formData.name}
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Pusat kendali URL sumber data, tautan editor Apps Script, deployment web apps, catatan kritis perbaikan, dan rekomendasi langsung dari Lead Developer.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                <Check className="w-4 h-4" /> Tersimpan!
              </span>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                isEditing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Batal Edit' : 'Edit Dossier & Link'}</span>
            </button>

            {isEditing && (
              <button
                onClick={() => handleSave()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        /* EDIT MODE FORM */
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              Edit Informasi Web App, Link & Catatan Supervisi
            </h4>
            <span className="text-slate-400 text-[11px]">Semua link dapat diakses kapan saja setelah disimpan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Web App / Sistem *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kategori / Domain</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Status Supervisi Saat Ini</label>
              <select
                value={formData.supervisionStatus}
                onChange={(e) => setFormData({ ...formData, supervisionStatus: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="audit">Audit & Analisa Awal</option>
                <option value="refactoring_gas">Refactoring Script GAS (Immediate Triage)</option>
                <option value="database_migration">Migrasi Database (PostgreSQL / Cloud SQL)</option>
                <option value="android_dev">Pengembangan Klien Android Native</option>
                <option value="production_ready">Produksi Siap & Stabil (Production-Ready)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Arsitektur Database</label>
              <select
                value={formData.targetDatabase}
                onChange={(e) => setFormData({ ...formData, targetDatabase: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="postgresql">PostgreSQL / Cloud SQL ACID (Rekomendasi Utama)</option>
                <option value="hybrid_sync">Arsitektur Hybrid (Postgres Primer + Sync Dua Arah ke Sheet)</option>
                <option value="firestore">Firebase Firestore (Realtime & Cloud Functions)</option>
                <option value="optimized_gas">Tetap Google Sheets (Hanya Dioptimasi Caching/Batching)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-semibold">Deskripsi Singkat & Alur Kerja</label>
              <span className="text-[10px] text-slate-400">Atau lampirkan file dokumen PDF/DOCX di bawah</span>
            </div>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 mb-2.5"
            />

            {/* Document Upload Area in Edit Mode */}
            <div className="space-y-2">
              <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer bg-slate-950/70 hover:bg-slate-900/80 transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <FileUp className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                      Unggah Dokumen Spesifikasi / BRD (.PDF atau .DOCX)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Mendukung file .pdf, .docx, .doc, .txt untuk detail kebutuhan teknis
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700 shrink-0 group-hover:border-slate-600">
                  Pilih Berkas
                </span>

                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded Documents List in Edit Mode */}
              {formData.attachedDocs.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" /> {formData.attachedDocs.length} Dokumen Terlampir:
                  </span>
                  {formData.attachedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-emerald-900/40 text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          doc.name.endsWith('.pdf') ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {doc.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
                        </span>
                        <span className="text-slate-200 font-medium truncate max-w-[280px]">
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({formatFileSize(doc.size)})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition-colors"
                        title="Hapus lampiran"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              🔗 Tautan Resource Eksternal (Sheets, GAS & Web Apps):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  Link Spreadsheet Sumber Data (Input Transaksi)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={formData.sourceSheetUrl}
                  onChange={(e) => setFormData({ ...formData, sourceSheetUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                  Link Spreadsheet Tujuan (Laporan / Data Mart)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={formData.destinationSheetUrl}
                  onChange={(e) => setFormData({ ...formData, destinationSheetUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  Link Editor Google Apps Script (Script IDE)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/home/projects/.../edit"
                  value={formData.gasScriptUrl}
                  onChange={(e) => setFormData({ ...formData, gasScriptUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  URL Web Apps Aktif (Deployment Exec URL / Custom Domain)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={formData.webAppDeploymentUrl}
                  onChange={(e) => setFormData({ ...formData, webAppDeploymentUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                URL Repositori Kode / Dokumentasi GitHub / GitLab (Opsional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/perusahaan/repo-nama"
                value={formData.repoUrl}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-rose-300 font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Catatan Kritis Masalah & Hal yang Memerlukan Perbaikan
              </label>
              <textarea
                rows={4}
                placeholder="- Sering timeout saat jam 09:00 WIB&#10;- Data hilang saat sinyal drop di HP&#10;- Formula IMPORTRANGE sering error"
                value={formData.criticalNotes}
                onChange={(e) => setFormData({ ...formData, criticalNotes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono text-[11px] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Catatan Rekomendasi Perbaikan Terperinci (Lead Developer)
              </label>
              <textarea
                rows={4}
                placeholder="1. Terapkan batching memory setValues()&#10;2. Migrasikan tabel transaksi ke PostgreSQL&#10;3. Rilis Android Room DB offline-first"
                value={formData.leadRecommendationNotes}
                onChange={(e) => setFormData({ ...formData, leadRecommendationNotes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-[11px] leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Simpan Pembaruan
            </button>
          </div>
        </form>
      ) : (
        /* READ MODE DOSSIER DISPLAY */
        <div className="space-y-4">
          {/* Quick Links Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Source Sheet */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    Sheet Sumber Data
                  </span>
                  <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    Input Data
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mb-3">
                  {formData.sourceSheetUrl ? formData.sourceSheetUrl : 'Belum diisi (Klik Edit Dossier)'}
                </p>
              </div>

              {formData.sourceSheetUrl ? (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <a
                    href={formData.sourceSheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buka Sheet</span>
                  </a>
                  <button
                    onClick={() => handleCopy(formData.sourceSheetUrl, 'srcSheet')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Salin URL"
                  >
                    {copiedKey === 'srcSheet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  + Tambah Link Sheet
                </button>
              )}
            </div>

            {/* Destination / Report Sheet */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    Sheet Tujuan / Report
                  </span>
                  <span className="text-[10px] uppercase font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                    Output Laporan
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mb-3">
                  {formData.destinationSheetUrl ? formData.destinationSheetUrl : 'Belum diisi (Klik Edit Dossier)'}
                </p>
              </div>

              {formData.destinationSheetUrl ? (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <a
                    href={formData.destinationSheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Buka Sheet</span>
                  </a>
                  <button
                    onClick={() => handleCopy(formData.destinationSheetUrl, 'destSheet')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Salin URL"
                  >
                    {copiedKey === 'destSheet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  + Tambah Link Report
                </button>
              )}
            </div>

            {/* GAS Script URL */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    Google Apps Script
                  </span>
                  <span className="text-[10px] uppercase font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded">
                    Script IDE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mb-3">
                  {formData.gasScriptUrl ? formData.gasScriptUrl : 'Belum diisi (Klik Edit Dossier)'}
                </p>
              </div>

              {formData.gasScriptUrl ? (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <a
                    href={formData.gasScriptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Buka Script IDE</span>
                  </a>
                  <button
                    onClick={() => handleCopy(formData.gasScriptUrl, 'gasScript')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Salin URL"
                  >
                    {copiedKey === 'gasScript' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  + Tambah Link GAS
                </button>
              )}
            </div>

            {/* Web App URL */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-400" />
                    Web App Live URL
                  </span>
                  <span className="text-[10px] uppercase font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
                    Deployment
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mb-3">
                  {formData.webAppDeploymentUrl ? formData.webAppDeploymentUrl : 'Belum diisi (Klik Edit Dossier)'}
                </p>
              </div>

              {formData.webAppDeploymentUrl ? (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <a
                    href={formData.webAppDeploymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Akses Web App</span>
                  </a>
                  <button
                    onClick={() => handleCopy(formData.webAppDeploymentUrl, 'webApp')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Salin URL"
                  >
                    {copiedKey === 'webApp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  + Tambah URL Web App
                </button>
              )}
            </div>
          </div>

          {/* Attached Specification Documents in Read Mode */}
          {formData.attachedDocs && formData.attachedDocs.length > 0 ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Dokumen Spesifikasi & Lampiran Teknis ({formData.attachedDocs.length})
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Berkas PDF / Word rujukan alur kerja dan kamus data sistem
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium bg-slate-800 px-2 py-1 rounded"
                >
                  <Edit3 className="w-3 h-3 text-emerald-400" />
                  <span>+ Tambah Dokumen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {formData.attachedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] font-mono shrink-0 ${
                        doc.name.endsWith('.pdf')
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                      }`}>
                        {doc.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-200 truncate" title={doc.name}>
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {formatFileSize(doc.size)} • {doc.uploadedAt}
                        </div>
                      </div>
                    </div>

                    {doc.dataUrl && (
                      <a
                        href={doc.dataUrl}
                        download={doc.name}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                        title="Unduh Berkas"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-500" />
                Belum ada dokumen spesifikasi PDF/DOCX yang dilampirkan.
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-1"
              >
                + Lampirkan Dokumen
              </button>
            </div>
          )}

          {/* Two-Column Logs: Critical Notes vs Lead Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Critical Notes */}
            <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-rose-900/30">
                <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Catatan Kritis Masalah & Hal yang Memerlukan Perbaikan
                </h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-rose-400/80 hover:text-rose-200 font-medium"
                >
                  Edit
                </button>
              </div>

              {formData.criticalNotes ? (
                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {formData.criticalNotes}
                </div>
              ) : (
                <div className="bg-slate-950/40 p-4 rounded-lg border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Belum ada catatan kritis. Klik tombol <strong>Edit Dossier & Link</strong> di atas untuk menambahkan kendala yang dialami.
                </div>
              )}
            </div>

            {/* Lead Recommendation Notes */}
            <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-emerald-900/30">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Catatan Rekomendasi Perbaikan Terperinci (Lead Developer)
                </h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-400/80 hover:text-emerald-200 font-medium"
                >
                  Edit
                </button>
              </div>

              {formData.leadRecommendationNotes ? (
                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-emerald-900/40 text-xs text-emerald-200/90 font-mono whitespace-pre-wrap leading-relaxed">
                  {formData.leadRecommendationNotes}
                </div>
              ) : (
                <div className="bg-slate-950/40 p-4 rounded-lg border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Belum ada catatan rekomendasi tersimpan. Klik tombol <strong>Edit Dossier & Link</strong> untuk mengisinya.
                </div>
              )}
            </div>
          </div>

          {/* Architecture Target & Strategy Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  Arah Target Arsitektur Database
                </span>
                <span className="font-semibold text-white">
                  {formData.targetDatabase === 'postgresql'
                    ? 'Cloud SQL / PostgreSQL Relational ACID'
                    : formData.targetDatabase === 'hybrid_sync'
                    ? 'Arsitektur Hybrid (PostgreSQL + Two-Way Sync ke Google Sheets)'
                    : formData.targetDatabase === 'firestore'
                    ? 'Firebase Firestore NoSQL Document & Auth'
                    : 'Optimasi Google Sheets (Batching & CacheService)'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                Ganti Target Arsitektur
              </button>
              <button
                onClick={onOpenNewAudit}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                + Tambah Web App Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
