import React, { useState } from 'react';
import { Copy, Check, Code2, Terminal, Cpu } from 'lucide-react';

interface CodeSnippet {
  title: string;
  language: string;
  description: string;
  legacyGasCode?: string;
  optimizedCode: string;
}

interface CodePlaygroundTabProps {
  snippets: CodeSnippet[];
}

export const CodePlaygroundTab: React.FC<CodePlaygroundTabProps> = ({ snippets }) => {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeSnippet = snippets[activeSnippetIndex] || snippets[0];

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            Repositori Blueprint Kode & Pola Implementasi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Komparasi kode implementasi lama vs arsitektur target berkinerja tinggi
          </p>
        </div>

        {/* Snippet selector tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {snippets.map((snip, index) => (
            <button
              key={index}
              onClick={() => setActiveSnippetIndex(index)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeSnippetIndex === index
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{snip.title.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {activeSnippet && (
        <div className="space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                {activeSnippet.title}
              </h4>
              <span className="text-[11px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                {activeSnippet.language}
              </span>
            </div>
            <p className="text-xs text-slate-300">{activeSnippet.description}</p>
          </div>

          {activeSnippet.legacyGasCode ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Legacy Code */}
              <div className="bg-slate-950 border border-rose-900/40 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-rose-950/40 px-4 py-2 border-b border-rose-900/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Koleksi Pola Lama (Google Apps Script Berbahaya)
                  </span>
                  <button
                    onClick={() => handleCopy(activeSnippet.legacyGasCode!, 'legacy')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'legacy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'legacy' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 flex-1 bg-slate-950">
                  <pre>{activeSnippet.legacyGasCode}</pre>
                </div>
              </div>

              {/* Optimized Code */}
              <div className="bg-slate-950 border border-emerald-900/50 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-emerald-950/40 px-4 py-2 border-b border-emerald-900/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Pola Rekomendasi Lead Developer (Batching / High Perf)
                  </span>
                  <button
                    onClick={() => handleCopy(activeSnippet.optimizedCode, 'optimized')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'optimized' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'optimized' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-emerald-200/90 flex-1 bg-slate-950">
                  <pre>{activeSnippet.optimizedCode}</pre>
                </div>
              </div>
            </div>
          ) : (
            /* Single Column Code */
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Arsitektur Produksi Skala Tinggi ({activeSnippet.language.toUpperCase()})
                </span>
                <button
                  onClick={() => handleCopy(activeSnippet.optimizedCode, 'single')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                >
                  {copiedKey === 'single' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'single' ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>
              <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 bg-slate-950">
                <pre>{activeSnippet.optimizedCode}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
