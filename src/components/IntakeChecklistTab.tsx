import React, { useState } from 'react';
import {
  ClipboardList,
  Database,
  FileCode,
  Users,
  Smartphone,
  CheckCircle,
  Copy,
  Download,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const IntakeChecklistTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const checklistSections = [
    {
      id: 'data-layer',
      title: '1. Arsitektur Data & Struktur Spreadsheet (Data Layer)',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      description: 'Detail tentang model data, volume, dan relasi tabel di Google Sheets.',
      items: [
        {
          label: 'Daftar Nama Tab & Skema Kolom',
          detail: 'Nama setiap tab (misal: "Master_Barang", "Transaksi_Header", "Transaksi_Detail") beserta nama header kolom di baris pertama.',
          importance: 'Krusial untuk mendesain skema tabel normalisasi SQL (3NF/relasional) dan Primary Key.',
        },
        {
          label: 'Volume Data & Laju Pertumbuhan',
          detail: 'Jumlah baris aktif saat ini dan estimasi penambahan data baru per hari/minggu (misal: 40.000 baris, +300 baris/hari).',
          importance: 'Menentukan kapasitas batas 10 juta sel Google Sheets dan sizing database target.',
        },
        {
          label: 'Ketergantungan Formula Berat',
          detail: 'Apakah ada formula `IMPORTRANGE`, `QUERY`, `VLOOKUP`, atau `ARRAYFORMULA` yang berjalan terus-menerus?',
          importance: 'Formula berantai sering memicu status `#ERROR!` atau *calculation timeout* saat data membesar.',
        },
      ],
    },
    {
      id: 'script-logic',
      title: '2. Kode & Logika Google Apps Script (Logic & Execution Layer)',
      icon: <FileCode className="w-4 h-4 text-cyan-400" />,
      description: 'Implementasi backend script yang saat ini mengeksekusi data.',
      items: [
        {
          label: 'Fungsi Endpoint Mutasi (doGet / doPost)',
          detail: 'Potongan kode fungsi `doPost(e)` atau `doGet(e)` yang menerima kiriman data dari web/form.',
          importance: 'Untuk menganalisa apakah ada penulisan sel per-sel (sangat lambat) atau sudah batching memori.',
        },
        {
          label: 'Mekanisme Kunci (LockService)',
          detail: 'Apakah script menggunakan `LockService.getScriptLock()` dan berapa durasi `waitLock()` yang dipasang?',
          importance: 'Menjadi akar utama error 500 saat banyak pengguna klik submit pada menit yang sama.',
        },
        {
          label: 'Pemicu Otomatis (Triggers) & Kuota API',
          detail: 'Daftar Time-driven triggers (misal: sync tiap 15 menit) atau penggunaan `MailApp` dan `UrlFetchApp`.',
          importance: 'Mendeteksi apakah sistem mendekati batas eksekusi 6 menit atau kuota email Workspace harian.',
        },
      ],
    },
    {
      id: 'traffic-profile',
      title: '3. Profil Beban & Trafik Pengguna (Concurrency & Load Profile)',
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      description: 'Karakteristik interaksi pengguna di jam kerja.',
      items: [
        {
          label: 'DAU & Peak Concurrency',
          detail: 'Berapa pengguna aktif harian dan berapa pengguna yang klik/input bersamaan di jam tersibuk?',
          importance: 'Menentukan kebutuhan thread concurrency, connection pooling, dan kapasitas server API.',
        },
        {
          label: 'Rasio Baca vs Tulis (Read vs Write Ratio)',
          detail: 'Apakah aplikasi lebih banyak digunakan untuk melihat laporan (90% read) atau input pesanan cepat (heavy write)?',
          importance: 'Menentukan konfigurasi caching Redis (Cache-Aside) vs optimasi transaksi tulis database.',
        },
        {
          label: 'Kondisi Jaringan Pengguna',
          detail: 'Apakah pengguna berada di kantor dengan Wi-Fi stabil, atau petugas lapangan dengan sinyal 3G/4G sering putus?',
          importance: 'Kunci penentu apakah wajib menerapkan arsitektur Offline-First di Android.',
        },
      ],
    },
    {
      id: 'mobile-requirements',
      title: '4. Kebutuhan Aplikasi Android & Integrasi Hardware (Mobile Requirements)',
      icon: <Smartphone className="w-4 h-4 text-amber-400" />,
      description: 'Kebutuhan fitur spesifik untuk aplikasi mobile lapangan.',
      items: [
        {
          label: 'Akses Hardware & Sensor',
          detail: 'Apakah memerlukan scanner Barcode/QR, kamera upload foto bukti nota, GPS Geofencing, atau thermal printer bluetooth?',
          importance: 'Untuk integrasi library native CameraX, ML Kit, FusedLocationProvider, dan Bluetooth SPP.',
        },
        {
          label: 'Toleransi Offline (Offline-First)',
          detail: 'Berapa lama aplikasi harus tetap bisa dipakai tanpa sinyal, dan bagaimana aturan konflik data jika 2 sales mengubah item yang sama?',
          importance: 'Mendesain skema Room DB lokal dan *conflict resolution strategy* (Last-Write-Wins vs Manual Review).',
        },
        {
          label: 'Push Notifications (FCM)',
          detail: 'Apakah memerlukan notifikasi real-time ke ponsel pengguna saat ada pesanan baru atau status approval berubah?',
          importance: 'Pengaturan Firebase Cloud Messaging (FCM) dan channel prioritas tinggi di Android.',
        },
      ],
    },
    {
      id: 'governance',
      title: '5. Batasan Bisnis & Ekspektasi Transisi (Governance & Constraints)',
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      description: 'Aturan main transisi agar operasional perusahaan tidak terganggu.',
      items: [
        {
          label: 'Peran Google Sheets ke Depan',
          detail: 'Apakah Google Sheets harus tetap ter-update secara otomatis sebagai dashboard manajemen/finance?',
          importance: 'Menentukan apakah kita membangun arsitektur Full Cutover atau Hybrid Sync (Postgres → Sheet).',
        },
        {
          label: 'Ketersediaan Akun Cloud & Infrastruktur',
          detail: 'Apakah perusahaan sudah memiliki Google Cloud Platform (GCP), AWS, VPS, atau prefer serverless managed (Supabase / Cloud Run)?',
          importance: 'Memilih opsi deployment yang paling hemat biaya dan minim maintenance bagi tim Anda.',
        },
      ],
    },
  ];

  const fullIntakeTemplate = `
================================================================================
FORMULIR INTAKE DATA SUPERVISI & AUDIT ARSITEKTUR SISTEM
(Disiapkan untuk Lead Developer & Solutions Architect)
================================================================================

1. INFORMASI UMUM SISTEM:
- Nama Web App / Proyek      : [Contoh: Sistem Distribusi Lapangan & SFA]
- Fungsi & Alur Bisnis Utama : [Jelaskan apa yang dilakukan aplikasi ini]
- Jumlah Pengguna Harian     : [...] pengguna aktif/hari
- Jam Puncak (Peak Hour)     : [Contoh: 08:30 - 10:00 WIB]
- Pengguna Bersamaan di Peak : [...] user serentak

2. ARSITEKTUR DATA & SPREADSHEET:
- Jumlah Tab Utama           : [Sebutkan nama-nama tab penting]
- Estimasi Total Baris Data  : [...] baris saat ini
- Rata-rata Penambahan Data  : [...] baris baru per hari/minggu
- Rumus Berat yang Digunakan : [Ada IMPORTRANGE / QUERY / VLOOKUP?]
- Kendala Data Saat Ini      : [Contoh: Sheet mulai lemot saat dibuka, kalkulasi lama]

3. KODE & GOOGLE APPS SCRIPT:
- URL Web App / Tipe Script  : [Standalone Script / Container-bound di Spreadsheet]
- Potongan Kode doGet/doPost : [Tempelkan kode fungsi doGet / doPost jika ada]
- Penggunaan LockService     : [Ya/Tidak, berapa timeout-nya?]
- Triggers Terpasang         : [Ada trigger time-driven atau onEdit?]
- Pesan Error yang Muncul    : [Contoh: "Script timeout", "Exceeded maximum execution time", "HTTP 500"]

4. KEBUTUHAN APLIKASI ANDROID:
- Siapa Pengguna Mobile      : [Sales lapangan / Operator gudang / Driver / Manajemen]
- Akses Hardware Dibutuhkan  : [Barcode Scanner / Kamera / GPS Presensi / Printer Bluetooth]
- Kebutuhan Offline          : [Wajib bisa input saat tidak ada sinyal sama sekali? Ya/Tidak]
- Push Notification          : [Dibutuhkan untuk alert apa?]

5. PREFERENSI & BATASAN:
- Peran Google Sheets Nanti  : [Tetap ingin ada data di Sheet untuk laporan / Boleh ganti Web Admin]
- Preferensi Server/Cloud    : [Google Cloud / VPS / Supabase / Bebas rekomendasi Lead]
- Target Utama Paling Mendesak: [Contoh: Menghilangkan error timeout minggu ini]
================================================================================
`.trim();

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(fullIntakeTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
              Daftar Kebutuhan Informasi Lead Developer
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-400" />
              Informasi yang Diperlukan untuk Supervisi Detail & Presisi
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Agar hasil audit akurat dan rekomendasi arsitektur langsung aplikatif (*production-grade*), Anda cukup menyampaikan informasi sesuai 5 pilar berikut secara bertahap atau sekaligus.
            </p>
          </div>

          <button
            onClick={handleCopyTemplate}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 shrink-0 transition-all"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Format Tersalin!' : 'Salin Format Kuisioner'}</span>
          </button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="space-y-4">
        {checklistSections.map((sec) => (
          <div key={sec.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2 pb-2.5 border-b border-slate-800">
              <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                {sec.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                <p className="text-[11px] text-slate-400">{sec.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-200 block mb-1">
                      {item.label}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      {item.detail}
                    </p>
                  </div>
                  <div className="text-[11px] text-emerald-400/90 bg-emerald-950/30 border border-emerald-900/40 p-2 rounded">
                    <strong className="text-emerald-400 font-semibold block text-[10px] uppercase">
                      Mengapa Ini Krusial:
                    </strong>
                    <span>{item.importance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Guide */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs">
        <h4 className="font-bold text-white flex items-center gap-2 mb-2 text-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Tips Cara Penyampaian Data yang Mudah:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <strong className="text-white block mb-1">Opsi A: Kirim Deskripsi Bebas</strong>
            <p className="text-slate-400">
              Cukup ceritakan nama sistem, kendala paling menyebalkan saat ini, dan berapa jumlah baris spreadsheet-nya.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <strong className="text-white block mb-1">Opsi B: Tempel Potongan Kode</strong>
            <p className="text-slate-400">
              Salin fungsi `doPost` atau script Apps Script yang Anda rasa berjalan lambat atau sering error untuk saya review baris per baris.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <strong className="text-white block mb-1">Opsi C: Gunakan Format Kuisioner</strong>
            <p className="text-slate-400">
              Klik tombol hijau "Salin Format Kuisioner" di atas, isi poin-poinnya, dan kirimkan dalam chat ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
