import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle, Zap, Activity, Clock, ShieldAlert } from 'lucide-react';

export const DiagnosticCalculatorTab: React.FC = () => {
  const [rows, setRows] = useState<number>(45000);
  const [columns, setColumns] = useState<number>(30);
  const [concurrentUsers, setConcurrentUsers] = useState<number>(60);
  const [dailyTransactions, setDailyTransactions] = useState<number>(2500);

  // Calculations
  const totalCells = rows * columns;
  const cellLimitPercent = Math.min(100, (totalCells / 10000000) * 100);

  // Estimated latency in GAS based on row size and cell-to-cell traversal
  const estimatedGasLatencyMs = Math.round(800 + (rows / 1000) * 35 + (concurrentUsers > 30 ? (concurrentUsers - 30) * 45 : 0));
  
  // Target latency with PostgreSQL + Redis
  const targetPostgresLatencyMs = Math.round(15 + Math.min(30, (rows / 50000) * 5));

  // Risk of LockService timeout during peak (heuristic estimation)
  const peakReqPerSec = (dailyTransactions / 8 / 3600) * 4; // peak factor 4x in 8 hours
  const lockContentionScore = Math.min(99, Math.round((concurrentUsers * 0.9) + (rows > 30000 ? 30 : 10)));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          Kalkulator Diagnostik & Stress-Test Risiko Google Apps Script
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulasikan volume data spreadsheet dan concurrent users untuk mendeteksi ambang kegagalan sistem sebelum terjadi crash di lapangan
        </p>
      </div>

      {/* Input Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Parameter Data & Beban Trafik
          </h4>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Jumlah Baris Aktif Spreadsheet</span>
              <span className="font-mono font-bold text-emerald-400">{rows.toLocaleString()} baris</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1k</span>
              <span>50k (Batas Aman GAS)</span>
              <span>200k</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Jumlah Kolom Per Baris</span>
              <span className="font-mono font-bold text-cyan-400">{columns} kolom</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Peak Concurrent Users (Pengguna Serentak)</span>
              <span className="font-mono font-bold text-amber-400">{concurrentUsers} user aktif</span>
            </div>
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={concurrentUsers}
              onChange={(e) => setConcurrentUsers(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 user</span>
              <span>30 user (Ambang antrian lock)</span>
              <span>300 user</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Estimasi Transaksi Mutasi Harian</span>
              <span className="font-mono font-bold text-indigo-400">{dailyTransactions.toLocaleString()} mutasi/hari</span>
            </div>
            <input
              type="range"
              min="100"
              max="20000"
              step="100"
              value={dailyTransactions}
              onChange={(e) => setDailyTransactions(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Prediction Output */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Hasil Analisa & Prediksi Bottleneck</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Algoritma Evaluasi Realtime
            </span>
          </h4>

          {/* Cell limit warning */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Beban Sel Spreadsheet vs Kuota Google (10 Juta Sel)</span>
              <span className="font-mono font-bold text-slate-200">
                {totalCells.toLocaleString()} sel ({cellLimitPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  cellLimitPercent > 50 ? 'bg-rose-500' : cellLimitPercent > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(3, cellLimitPercent)}%` }}
              />
            </div>
            {totalCells > 1000000 && (
              <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Sheet di atas 1 juta sel rentan mengalami crash formula VLOOKUP / QUERY!
              </p>
            )}
          </div>

          {/* Response Latency Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg text-center">
              <span className="text-[10px] text-rose-300 font-medium block mb-1">
                Prediksi Latensi GAS Saat Ini
              </span>
              <span className="text-2xl font-bold font-mono text-rose-400">
                {estimatedGasLatencyMs.toLocaleString()} ms
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {estimatedGasLatencyMs > 3000 ? '⚠️ Sangat Lambat (User Bounce)' : 'Lambat'}
              </span>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-lg text-center">
              <span className="text-[10px] text-emerald-300 font-medium block mb-1">
                Target Latensi PostgreSQL + Redis
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {targetPostgresLatencyMs} ms
              </span>
              <span className="text-[10px] text-emerald-300/80 block mt-1">
                ⚡ <strong>{Math.round(estimatedGasLatencyMs / targetPostgresLatencyMs)}x Lebih Cepat</strong>
              </span>
            </div>
          </div>

          {/* Lock Contention Danger */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Indeks Risiko LockService Collision & Error 500:
              </span>
              <span
                className={`font-mono font-bold ${
                  lockContentionScore > 70 ? 'text-rose-400' : lockContentionScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {lockContentionScore}% {lockContentionScore > 70 ? '(KRITIS)' : lockContentionScore > 40 ? '(WASPADA)' : '(AMAN)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              {lockContentionScore > 60
                ? 'Pada beban pengguna ini, GAS LockService kemungkinan besar akan timeout (30s) saat jam sibuk, memicu kegagalan input pesanan dan inkonsistensi stok.'
                : 'Beban saat ini masih dapat ditoleransi jika GAS menggunakan teknik batching memory dan LockService timeout 25 detik.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
