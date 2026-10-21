import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { AppProject } from '../types';

interface NewAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: AppProject) => void;
}

export const NewAuditModal: React.FC<NewAuditModalProps> = ({ isOpen, onClose, onAddProject }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Operasional & Bisnis');
  const [description, setDescription] = useState('');
  const [totalRows, setTotalRows] = useState(25000);
  const [dailyUsers, setDailyUsers] = useState(50);
  const [peakReq, setPeakReq] = useState(40);
  const [currentStackFE, setCurrentStackFE] = useState('HTML Service Google Apps Script');
  const [sourceSheetUrl, setSourceSheetUrl] = useState('');
  const [destinationSheetUrl, setDestinationSheetUrl] = useState('');
  const [gasScriptUrl, setGasScriptUrl] = useState('');
  const [webAppDeploymentUrl, setWebAppDeploymentUrl] = useState('');
  const [criticalNotes, setCriticalNotes] = useState('');
  const [leadRecommendationNotes, setLeadRecommendationNotes] = useState('');
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>([
    'lock_timeout',
    'mobile_offline',
  ]);

  if (!isOpen) return null;

  const toggleBottleneck = (id: string) => {
    if (selectedBottlenecks.includes(id)) {
      setSelectedBottlenecks(selectedBottlenecks.filter((b) => b !== id));
    } else {
      setSelectedBottlenecks([...selectedBottlenecks, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Heuristic calculations for the new project
    const errorRate = Math.min(18, Math.max(2, Math.round((peakReq / 10) + (totalRows > 40000 ? 5 : 1))));
    const avgLatency = Math.round(1800 + (totalRows / 1000) * 25);

    const newProject: AppProject = {
      id: `custom-app-${Date.now()}`,
      name: name.trim(),
      category: category,
      description: description.trim() || 'Aplikasi berbasis Google Sheets & Google Apps Script dalam supervisi Lead Developer.',
      supervisionStatus: 'audit',
      targetDatabase: 'postgresql',
      links: {
        sourceSheetUrl: sourceSheetUrl.trim(),
        destinationSheetUrl: destinationSheetUrl.trim(),
        gasScriptUrl: gasScriptUrl.trim(),
        webAppDeploymentUrl: webAppDeploymentUrl.trim(),
      },
      criticalNotes: criticalNotes.trim(),
      leadRecommendationNotes: leadRecommendationNotes.trim(),
      currentStack: {
        frontend: currentStackFE,
        backend: 'Google Apps Script (doGet / doPost Web App)',
        database: `Google Sheets (~${totalRows.toLocaleString()} baris)`,
        auth: 'Google Account / Script Session',
      },
      metrics: {
        dailyActiveUsers: dailyUsers,
        peakRequestsPerMinute: peakReq,
        totalRows: totalRows,
        avgLatencyMs: avgLatency,
        errorRatePercent: errorRate,
      },
      scores: [
        {
          label: 'Database Concurrency & ACID',
          currentScore: totalRows > 50000 ? 25 : 40,
          targetScore: 95,
          unit: 'Score',
          currentValue: 'Google Sheets (Single Lock Contention)',
          targetValue: 'PostgreSQL Relational ACID',
          status: 'critical',
        },
        {
          label: 'API Response Latency (TTFB)',
          currentScore: avgLatency > 3000 ? 30 : 45,
          targetScore: 95,
          unit: 'ms',
          currentValue: `${avgLatency.toLocaleString()} ms`,
          targetValue: '< 150 ms (Edge API)',
          status: 'critical',
        },
        {
          label: 'Mobile Offline Readiness',
          currentScore: selectedBottlenecks.includes('mobile_offline') ? 10 : 35,
          targetScore: 95,
          unit: 'Score',
          currentValue: 'Bergantung Koneksi Aktif',
          targetValue: 'Android Room DB Offline-First',
          status: 'critical',
        },
        {
          label: 'Quota & Scalability Safety',
          currentScore: totalRows > 40000 ? 35 : 55,
          targetScore: 90,
          unit: 'Score',
          currentValue: 'Ambang Batas Read/Write GAS',
          targetValue: 'Scalable Cloud SQL Pool',
          status: 'warning',
        },
      ],
      bottlenecks: [
        {
          id: `bn-custom-1`,
          category: 'database',
          title: 'I/O Overhead pada Spreadsheet saat Volume Bertambah',
          description: `Dengan ${totalRows.toLocaleString()} baris data, serialisasi data ke memori Apps Script memerlukan waktu tinggi dan membebani kuota harian.`,
          impact: 'Response time memanjang, UI terasa lagging saat memuat data.',
          severity: totalRows > 40000 ? 'critical' : 'high',
          gasLimitContext: 'Spreadsheet I/O latency meningkat drastis saat baris melebihi 20k.',
          recommendedSolution: 'Migrasikan tabel transaksi ke Cloud SQL PostgreSQL dengan index b-tree pada foreign keys.',
        },
        ...(selectedBottlenecks.includes('lock_timeout')
          ? [
              {
                id: `bn-custom-2`,
                category: 'concurrency' as const,
                title: 'LockService Contention pada Jam Sibuk',
                description: 'Permintaan serentak dari banyak pengguna berebut `LockService.getScriptLock()` dan memicu timeout 30 detik.',
                impact: 'Data transaksi gagal tersimpan, memunculkan keluhan dari pengguna lapangan.',
                severity: 'critical' as const,
                gasLimitContext: 'GAS tidak mendukung row-level lock concurrency.',
                recommendedSolution: 'Gunakan database relasional dengan isolasi transaksi ACID dan antrean background worker.',
              },
            ]
          : []),
        ...(selectedBottlenecks.includes('mobile_offline')
          ? [
              {
                id: `bn-custom-3`,
                category: 'mobile' as const,
                title: 'Kelemahan Koneksi Mobile di Lokasi Minim Sinyal',
                description: 'Pengguna lapangan kehilangan data formulir saat sinyal seluler drop di tengah proses pengiriman.',
                impact: 'Frustrasi pengguna, kehilangan data pesanan/laporan penting.',
                severity: 'critical' as const,
                gasLimitContext: 'Web App browser biasa tidak memiliki persistent local database queue.',
                recommendedSolution: 'Rilis Native Android App dengan Room Database lokal dan WorkManager automatic sync.',
              },
            ]
          : []),
      ],
      recommendations: [
        {
          id: `rec-custom-1`,
          domain: 'Database & Storage',
          title: 'Transisi Data ke PostgreSQL / Cloud SQL',
          summary: 'Bangun skema data relasional yang menampung beban harian, dengan integrasi ekspor berkala ke Google Sheets untuk kemudahan audit internal.',
          currentArchitecture: `Google Sheets dengan ~${totalRows.toLocaleString()} baris.`,
          proposedArchitecture: 'PostgreSQL Relational DB dengan indexing teroptimasi.',
          expectedGain: `Latency turun dari ${avgLatency}ms ke < 30ms, data integrity 100%.`,
          implementationEffort: 'Sedang (1-2 minggu)',
          priority: 'P0 - Urgent',
          keyTechStack: ['PostgreSQL', 'Drizzle ORM', 'Connection Pooling'],
          actionSteps: [
            'Normalisasi struktur kolom spreadsheet ke format tabel SQL.',
            'Jalankan pipeline ETL untuk migrasi data historis.',
            'Pasang mekanisme audit log untuk setiap perubahan record.',
          ],
        },
        {
          id: `rec-custom-2`,
          domain: 'Android & Mobile Client',
          title: 'Aplikasi Android Native Berkinerja Tinggi',
          summary: 'Kembangkan client Android modern dengan Kotlin & Jetpack Compose untuk pengalaman operasional tanpa hambatan jaringan.',
          currentArchitecture: currentStackFE,
          proposedArchitecture: 'Kotlin + Jetpack Compose + Room Local DB + WorkManager.',
          expectedGain: '0ms latency input form lokal, 100% data terselamatkan offline.',
          implementationEffort: 'Tinggi (3-4 minggu)',
          priority: 'P1 - High',
          keyTechStack: ['Android Kotlin', 'Jetpack Compose', 'Room DB', 'Retrofit'],
          actionSteps: [
            'Buat arsitektur MVVM dengan Single Source of Truth di Room Database.',
            'Implementasikan Retrofit dengan OkHttp caching dan auto-retry.',
            'Deploy ke internal distribution / Play Store Console.',
          ],
        },
      ],
      roadmap: [
        {
          phaseNumber: 1,
          name: 'Triage & Stabilisasi Akut',
          duration: 'Minggu 1',
          status: 'in_progress',
          objective: 'Mengeliminasi error timeout pada Apps Script eksisting.',
          deliverables: [
            'Optimasi script dengan memory batching array.',
            'Aktivasi CacheService untuk data referensi statis.',
          ],
          riskMitigation: 'Backup spreadsheet sebelum menerapkan modifikasi script.',
        },
        {
          phaseNumber: 2,
          name: 'Pembangunan API Gateway & Database',
          duration: 'Minggu 2 - 3',
          status: 'planned',
          objective: 'Mendirikan backend REST API dan basis data PostgreSQL.',
          deliverables: [
            'API Node.js/Express dengan JWT token.',
            'Sinkronisasi dua arah ke Google Sheets jika diperlukan.',
          ],
          riskMitigation: 'Jalankan pengujian beban (load test) dengan k6.',
        },
        {
          phaseNumber: 3,
          name: 'Peluncuran Android & Web Client Modern',
          duration: 'Minggu 4 - 5',
          status: 'planned',
          objective: 'Peluncuran aplikasi Android native dan cutover penuh.',
          deliverables: [
            'Rilis Android APK ke pengguna lapangan.',
            'Dashboard analitik web berkinerja tinggi.',
          ],
          riskMitigation: 'Rollout bertahap per wilayah/cabang kerja.',
        },
      ],
      codeSnippets: [
        {
          title: 'Batching Memory Array untuk Apps Script',
          language: 'javascript',
          description: 'Refactoring instan untuk menghemat kuota dan memangkas waktu eksekusi.',
          optimizedCode: `function submitDataBatch(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    return ContentService.createTextOutput(JSON.stringify({ error: "LOCKED" })).setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    var buffer = payload.items.map(function(item) {
      return [item.id, item.name, item.qty, new Date()];
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, buffer.length, buffer[0].length).setValues(buffer);
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`,
        },
      ],
    };

    onAddProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Daftarkan Web App / Sistem untuk Supervisi</h3>
            <p className="text-xs text-slate-400">
              Lead Developer akan langsung menganalisa profil sistem dan menerbitkan rekomendasi teknis
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nama Web App / Sistem *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Sistem Presensi Karyawan & Payroll, CRM Sales Toko"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Kategori Sistem</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Operasional & Bisnis">Operasional & Bisnis</option>
                <option value="Sales & Distribusi">Sales & Distribusi</option>
                <option value="Logistik & Gudang">Logistik & Gudang</option>
                <option value="Keuangan & Approval">Keuangan & Approval</option>
                <option value="HR & Presensi Lapangan">HR & Presensi Lapangan</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Frontend Saat Ini</label>
              <input
                type="text"
                value={currentStackFE}
                onChange={(e) => setCurrentStackFE(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Jumlah Baris Sheet</label>
              <input
                type="number"
                min="500"
                step="1000"
                value={totalRows}
                onChange={(e) => setTotalRows(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">User Aktif / Hari</label>
              <input
                type="number"
                min="5"
                value={dailyUsers}
                onChange={(e) => setDailyUsers(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Peak Req / Menit</label>
              <input
                type="number"
                min="5"
                value={peakReq}
                onChange={(e) => setPeakReq(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Deskripsi Singkat & Alur Kerja</label>
            <textarea
              rows={2}
              placeholder="Jelaskan peran aplikasi dan siapa penggunanya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Links Input Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              🔗 Tautan Resource (Sheets, GAS & Web Apps):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Link Sheet Sumber Data (Input)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={sourceSheetUrl}
                  onChange={(e) => setSourceSheetUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Link Sheet Tujuan (Laporan / Data Mart)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={destinationSheetUrl}
                  onChange={(e) => setDestinationSheetUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Link Google Apps Script (Script IDE)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/home/projects/.../edit"
                  value={gasScriptUrl}
                  onChange={(e) => setGasScriptUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  URL Web App Aktif (Deployment Exec)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webAppDeploymentUrl}
                  onChange={(e) => setWebAppDeploymentUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Notes Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-rose-300 font-semibold mb-1 text-[11px]">
                Catatan Kritis Masalah (Bottleneck yang Dikeluhkan)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Sering error 500 jam 09:00, formula VLOOKUP lemot..."
                value={criticalNotes}
                onChange={(e) => setCriticalNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 text-[11px]"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-1 text-[11px]">
                Catatan Rekomendasi Awal (Jika Ada)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Perlu migrasi ke PostgreSQL, buat app Android offline..."
                value={leadRecommendationNotes}
                onChange={(e) => setLeadRecommendationNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Kendala Akut yang Sering Dikeluhkan (Pilih yang relevan):
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-slate-950/70 p-2 rounded border border-slate-800">
                <input
                  type="checkbox"
                  checked={selectedBottlenecks.includes('lock_timeout')}
                  onChange={() => toggleBottleneck('lock_timeout')}
                  className="rounded text-emerald-500 accent-emerald-500"
                />
                <span>Sering error 500 / timeout saat banyak user input bersamaan di jam sibuk</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-slate-950/70 p-2 rounded border border-slate-800">
                <input
                  type="checkbox"
                  checked={selectedBottlenecks.includes('mobile_offline')}
                  onChange={() => toggleBottleneck('mobile_offline')}
                  className="rounded text-emerald-500 accent-emerald-500"
                />
                <span>User di lapangan mengeluh data hilang saat koneksi internet terputus di HP</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-slate-950/70 p-2 rounded border border-slate-800">
                <input
                  type="checkbox"
                  checked={selectedBottlenecks.includes('quota_limit')}
                  onChange={() => toggleBottleneck('quota_limit')}
                  className="rounded text-emerald-500 accent-emerald-500"
                />
                <span>Mendekati limit formula IMPORTRANGE / Kuota Email Google Apps Script</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
            >
              Terbitkan Supervisi & Rekomendasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
