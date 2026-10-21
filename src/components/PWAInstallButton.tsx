import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Tablet,
  Laptop,
  CheckCircle2,
  X,
  Share,
  PlusSquare,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isMobile, isTablet, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeDeviceTab, setActiveDeviceTab] = useState<'desktop' | 'tablet' | 'mobile'>(
    isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  );

  // If already running inside standalone PWA window
  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Aplikasi Terpasang</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
        title="Pasang aplikasi di PC, Tablet atau HP"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <span>Pasang Aplikasi</span>
        <span className="hidden md:inline text-[10px] bg-emerald-400/20 text-emerald-300 px-1 rounded font-mono">
          PWA
        </span>
      </button>

      {/* Install Guidance Modal for PC, Tablet, Smartphone */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl my-8">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Pasang Aplikasi di Perangkat Anda</h3>
                <p className="text-xs text-slate-400">
                  Gunakan tanpa browser bar, lebih cepat, dan responsif di PC, Tablet, & HP
                </p>
              </div>
            </div>

            {/* Device Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4 text-xs font-medium">
              <button
                onClick={() => setActiveDeviceTab('desktop')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeDeviceTab === 'desktop'
                    ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>

              <button
                onClick={() => setActiveDeviceTab('tablet')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeDeviceTab === 'tablet'
                    ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet / iPad</span>
              </button>

              <button
                onClick={() => setActiveDeviceTab('mobile')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeDeviceTab === 'mobile'
                    ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>HP Android / iOS</span>
              </button>
            </div>

            {/* Content for Desktop */}
            {activeDeviceTab === 'desktop' && (
              <div className="space-y-3 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  Instalasi di Komputer (Windows, macOS, Linux):
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pl-1">
                  <li>
                    Di browser <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong>, perhatikan ikon <strong>Install App</strong> (<Download className="w-3 h-3 inline text-emerald-400" />) di ujung kanan bilah alamat (URL bar).
                  </li>
                  <li>
                    Atau klik menu titik tiga di kanan atas browser $\rightarrow$ pilih <strong>"Instal Supervisi Apps Hub"</strong>.
                  </li>
                  <li>
                    Klik <strong>Install</strong>. Aplikasi akan terbuka di jendela terpisah mandiri seperti aplikasi desktop native!
                  </li>
                </ol>

                {isInstallable && (
                  <button
                    onClick={() => {
                      install();
                      setShowGuideModal(false);
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Klik di Sini untuk Pasang Sekarang</span>
                  </button>
                )}
              </div>
            )}

            {/* Content for Tablet */}
            {activeDeviceTab === 'tablet' && (
              <div className="space-y-3 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Tablet className="w-4 h-4 text-cyan-400" />
                  Instalasi di Tablet Android atau iPad:
                </div>
                <div className="space-y-2.5 text-slate-300 leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-1">📱 iPad (Safari):</strong>
                    <span>1. Ketuk tombol <strong>Bagikan / Share</strong> (<Share className="w-3 h-3 inline text-cyan-400" />) di pojok atas Safari.<br />2. Gulir ke bawah lalu pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-1">🤖 Tablet Android (Chrome):</strong>
                    <span>1. Ketuk menu titik tiga di kanan atas.<br />2. Pilih <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Mobile */}
            {activeDeviceTab === 'mobile' && (
              <div className="space-y-3 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  Instalasi di Smartphone (Android & iPhone):
                </div>
                <div className="space-y-2.5 text-slate-300 leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-1">🤖 HP Android (Chrome):</strong>
                    <span>Ketuk tombol menu titik tiga $\rightarrow$ pilih <strong>"Instal Aplikasi"</strong>. Ikon aplikasi akan langsung muncul di beranda ponsel Anda dengan ukuran ringan (&lt; 2 MB).</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-1">🍎 iPhone (Safari):</strong>
                    <span>Ketuk tombol <strong>Share</strong> di bilah bawah Safari $\rightarrow$ pilih <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3 h-3 inline text-emerald-400" />).</span>
                  </div>
                </div>

                {isInstallable && (
                  <button
                    onClick={() => {
                      install();
                      setShowGuideModal(false);
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pasang di HP Sekarang</span>
                  </button>
                )}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Resmi PWA Standar Google & Apple
              </span>
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
