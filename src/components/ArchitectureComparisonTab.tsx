import React from 'react';
import { Database, Check, X, AlertTriangle, Layers, Zap, HardDrive, Cpu } from 'lucide-react';

export const ArchitectureComparisonTab: React.FC = () => {
  const criteria = [
    {
      label: 'Model Database & Transaksi ACID',
      sheets: { value: 'Tidak ada ACID sejati. Hanya single lock script.', status: 'bad' },
      postgres: { value: 'Full ACID. Row-level lock, foreign keys, MVCC.', status: 'good' },
      firestore: { value: 'Document model. ACID per-dokumen & batch commit.', status: 'neutral' },
      hybrid: { value: 'PostgreSQL primer + export terjadwal ke Sheets.', status: 'good' },
    },
    {
      label: 'Kapasitas Volume Data (Row Capacity)',
      sheets: { value: 'Maks 10 juta sel (Mulai lag parah di > 30k baris).', status: 'bad' },
      postgres: { value: 'Ratusan juta baris tanpa degradasi performa.', status: 'good' },
      firestore: { value: 'Skala petabyte, horizontal partition otomatis.', status: 'good' },
      hybrid: { value: 'Data operasional di SQL, data visual di Sheets.', status: 'good' },
    },
    {
      label: 'Throughput & Concurrent Concurrency',
      sheets: { value: '~10-30 req/min. LockService queue bottleneck.', status: 'bad' },
      postgres: { value: '5.000 - 50.000 req/sec dengan connection pool.', status: 'good' },
      firestore: { value: '10.000+ write/detik (skala multi-region).', status: 'good' },
      hybrid: { value: 'Beban berat ditanggung PostgreSQL & Cache Redis.', status: 'good' },
    },
    {
      label: 'Latency / Waktu Respon API (TTFB)',
      sheets: { value: '1.800 ms - 5.000 ms (Cold start runtime GAS).', status: 'bad' },
      postgres: { value: '5 ms - 40 ms (Via Node.js API Gateway).', status: 'good' },
      firestore: { value: '30 ms - 80 ms (SDK langsung atau Edge).', status: 'good' },
      hybrid: { value: '< 25 ms untuk endpoint transaksi.', status: 'good' },
    },
    {
      label: 'Integrasi Android Offline-First',
      sheets: { value: 'Sangat sulit, butuh trik rumit dan rawan konflik.', status: 'bad' },
      postgres: { value: 'Sempurna via Room DB + REST API + Sync Worker.', status: 'good' },
      firestore: { value: 'Bawaan SDK (Offline persistence otomatis).', status: 'good' },
      hybrid: { value: 'Sempurna via Room DB dan Webhooks sinkronisasi.', status: 'good' },
    },
    {
      label: 'Batas Kuota Eksekusi Server (Timeout)',
      sheets: { value: '6 menit per eksekusi (Standard Google Account).', status: 'bad' },
      postgres: { value: 'Tanpa batas timeout eksekusi (Dikelola server).', status: 'good' },
      firestore: { value: 'Sesuai Cloud Functions/Run (hingga 60 menit).', status: 'good' },
      hybrid: { value: 'Bebas hambatan timeout Google Workspace.', status: 'good' },
    },
    {
      label: 'Kenyamanan Pengguna Bisnis (Spreadsheet UI)',
      sheets: { value: 'Sangat disukai manajemen (Tabel fleksibel, filter).', status: 'good' },
      postgres: { value: 'Perlu dashboard admin (React/Retool/Metabase).', status: 'neutral' },
      firestore: { value: 'Perlu dashboard admin khusus.', status: 'neutral' },
      hybrid: { value: 'Ideal: Manajemen tetap lihat Sheet, sistem stabil.', status: 'good' },
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'good') {
      return <Check className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (status === 'bad') {
      return <X className="w-4 h-4 text-rose-400 shrink-0" />;
    }
    return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          Matriks Komparasi Arsitektur Database & Backend
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Panduan pemilihan arsitektur target antara Google Sheets, PostgreSQL (Cloud SQL), Firebase Firestore, dan Arsitektur Hybrid
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold">
              <th className="p-3.5 w-1/4">Dimensi Evaluasi</th>
              <th className="p-3.5 w-1/4 bg-rose-950/20 text-rose-300 border-x border-slate-800">
                Google Sheets + GAS
                <span className="block text-[10px] font-normal text-slate-400">Arsitektur Eksisting</span>
              </th>
              <th className="p-3.5 w-1/4 bg-emerald-950/30 text-emerald-300 border-r border-slate-800">
                PostgreSQL / Cloud SQL
                <span className="block text-[10px] font-normal text-emerald-400/90 font-bold">Rekomendasi Utama Lead</span>
              </th>
              <th className="p-3.5 w-1/4 bg-cyan-950/20 text-cyan-300">
                Arsitektur Hybrid (Sync)
                <span className="block text-[10px] font-normal text-slate-400">Postgres + Two-Way Sheet</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {criteria.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-medium text-slate-200 bg-slate-900/60">
                  {item.label}
                </td>
                <td className="p-3.5 border-x border-slate-800 bg-rose-950/5">
                  <div className="flex items-start gap-2">
                    {getStatusBadge(item.sheets.status)}
                    <span className="text-slate-300 leading-snug">{item.sheets.value}</span>
                  </div>
                </td>
                <td className="p-3.5 border-r border-slate-800 bg-emerald-950/10">
                  <div className="flex items-start gap-2">
                    {getStatusBadge(item.postgres.status)}
                    <span className="text-emerald-200/90 font-medium leading-snug">{item.postgres.value}</span>
                  </div>
                </td>
                <td className="p-3.5 bg-cyan-950/5">
                  <div className="flex items-start gap-2">
                    {getStatusBadge(item.hybrid.status)}
                    <span className="text-cyan-200/90 leading-snug">{item.hybrid.value}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Strategic Takeaway Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-800/40 rounded-xl p-4 text-xs">
        <h4 className="font-bold text-white flex items-center gap-2 mb-1.5 text-sm">
          <Zap className="w-4 h-4 text-emerald-400" />
          Kesimpulan Rekomendasi Lead Developer:
        </h4>
        <p className="text-slate-300 leading-relaxed">
          Google Sheets sangat unggul sebagai <em>Reporting Dashboard & Visual Ledger</em> untuk tim operasional/finance, 
          tetapi <strong>berbahaya bila dijadikan OLTP Database harian</strong> untuk aplikasi transaksi web dan Android. 
          Strategi terbaik adalah memindahkan proses mutasi, query berat, dan API Android ke <strong>PostgreSQL dengan Express/Node.js</strong>, 
          kemudian menyinkronkan data agregat/summary kembali ke Google Sheets secara asynchronous via Google Sheets API v4.
        </p>
      </div>
    </div>
  );
};
