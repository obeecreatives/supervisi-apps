import React, { useState } from 'react';
import { X, Copy, Check, GitBranch, Globe, Terminal, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitSnippet = `git init
git add .
git commit -m "feat: initial commit lead developer supervision portal"
git branch -M main
git remote add origin https://github.com/USERNAME/gas-modernization-hub.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Panduan Deploy Mandiri ke GitHub & Vercel</h3>
            <p className="text-xs text-slate-400">
              Langkah menjadikan dashboard supervisi ini sebagai portal mandiri independen
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Recommendation summary */}
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3.5 text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              Preferensi Lead Developer: SANGAT DIREKOMENDASIKAN
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-200/90">
              Mendorong ke GitHub & Vercel memberikan Anda <strong>kepemilikan penuh (*full ownership*)</strong>, tautan produksi permanen (bisa dipasang domain custom resmi perusahaan Anda), serta integrasi CI/CD otomatis setiap ada perubahan kode. File <code>vercel.json</code> sudah otomatis saya siapkan di repositori ini!
            </p>
          </div>

          {/* Step 1: Push to GitHub */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                Inisialisasi & Push ke Repositori GitHub Anda
              </span>
              <button
                onClick={() => handleCopy(gitSnippet, 'git')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800"
              >
                {copiedKey === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'git' ? 'Tersalin' : 'Salin Perintah'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800/80">
              {gitSnippet}
            </pre>
          </div>

          {/* Step 2: Deploy to Vercel */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              Hubungkan ke Vercel (Hanya 1 Klik)
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1">
              <li>Buka <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-medium">vercel.com/new</a> dan login dengan akun GitHub Anda.</li>
              <li>Pilih repositori <strong>gas-modernization-hub</strong> yang baru saja di-push.</li>
              <li>Biarkan konfigurasi default (Framework Preset otomatis terdeteksi: <strong>Vite</strong>).</li>
              <li>Klik tombol <strong>Deploy</strong>. Dalam 30 detik web app Anda sudah aktif di internet!</li>
            </ol>
          </div>

          {/* Step 3: Environment Variables on Vercel */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
                Data Environment Variables untuk Vercel
              </span>
              <button
                onClick={() => handleCopy(`# Vercel Environment Variables
VITE_APP_URL="https://your-app-name.vercel.app"
NODE_VERSION="20.x"
# GEMINI_API_KEY="AIzaSy..." (Opsional jika menambahkan asisten server)`, 'env')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800"
              >
                {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'env' ? 'Tersalin' : 'Salin .env'}</span>
              </button>
            </div>
            
            <div className="text-[11px] text-slate-300 space-y-1">
              <p className="text-emerald-400 font-semibold">
                ✨ Zero-Config Build: Aplikasi ini dapat langsung di-deploy tanpa wajib mengisi env apapun!
              </p>
              <p className="text-slate-400">
                Namun jika Anda ingin mengatur variabel kustom di <strong>Vercel Settings → Environment Variables</strong>:
              </p>
            </div>

            <pre className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800/80">
{`# 1. URL domain aplikasi Vercel Anda (Opsional)
VITE_APP_URL="https://gas-modernization-hub.vercel.app"

# 2. Node.js runtime version (Opsional, Vercel default otomatis Node 20.x)
NODE_VERSION="20.x"

# 3. Gemini API Key (Opsional, hanya jika menggunakan fitur AI analysis di masa depan)
# GEMINI_API_KEY="AIzaSy..."`}
            </pre>
          </div>

          {/* Step 4: Multi-User Collaboration Note */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Catatan Penyimpanan Data:
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Saat ini data dossier dan link proyek tersimpan aman di <code>localStorage</code> peramban Anda. Ke depan, jika Anda ingin menghubungkan database cloud terpusat untuk kolaborasi multi-admin, kita tinggal menambahkan variable <code>DATABASE_URL</code> (PostgreSQL / Supabase).
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
            >
              Mengerti & Siap Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
