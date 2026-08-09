'use client';

import React, { useState, useEffect } from 'react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  SupabaseConfig,
} from '@/lib/db';
import {
  X,
  Cloud,
  Check,
  Upload,
  RefreshCw,
  Info,
  Server,
  ShieldCheck,
} from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportJSON: (jsonText: string) => void;
  onResetDefault: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onImportJSON,
  onResetDefault,
}) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [tableName, setTableName] = useState('amway_items');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      if (config) {
        setUrl(config.url);
        setKey(config.key);
        setTableName(config.tableName || 'amway_items');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      saveSupabaseConfig(null);
    } else {
      const config: SupabaseConfig = {
        url: url.trim(),
        key: key.trim(),
        tableName: tableName.trim() || 'amway_items',
      };
      saveSupabaseConfig(config);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onImportJSON(text);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="glass-modal w-full max-w-2xl flex flex-col overflow-hidden text-white my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Cloud className="w-5 h-5 text-cyan-400" />
            <span>Vercel 部署與多人共享設定</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Step 1: Vercel Deploy Instruction */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2 text-base">
              <Server className="w-4 h-4 text-emerald-400" />
              1. 如何部署到 Vercel 讓所有人開啟共享？
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
              <li>把此專案上傳至 GitHub，在 <strong className="text-white">Vercel.com</strong> 點擊 「Import Project」。</li>
              <li>點擊 <strong className="text-white">Deploy</strong>，數秒後即可獲得免費的高速 URL 網址。</li>
              <li>將生成好的 Vercel 網址傳給團隊夥伴，開啟網頁即可直接瀏覽與使用！</li>
            </ol>
          </div>

          {/* Step 2: Supabase Realtime Sync Option */}
          <form onSubmit={handleSaveConfig} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2 text-base">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                2. 綁定 Supabase 免費雲端資料庫 (多人即時同步)
              </h3>
              <span className="text-[11px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                可選進階
              </span>
            </div>

            <p className="text-xs text-slate-400">
              只要在下方填入免費 Supabase 的 URL 與 Anon Key，全體成員新增/修改內容時就會自動雲端即時同步！
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Supabase Project URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 設定已成功儲存！
                </span>
              )}
              <button
                type="submit"
                className="button-primary text-xs ml-auto"
              >
                儲存雲端連線設定
              </button>
            </div>
          </form>

          {/* Step 3: JSON Import / Export & Reset */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2 text-base">
              <Upload className="w-4 h-4 text-amber-400" />
              3. 資料備份、匯入與重置
            </h3>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Import File Button */}
              <label className="button-secondary text-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>匯入 JSON 備份檔</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Reset to Prototype Data */}
              <button
                onClick={() => {
                  if (confirm('確定要還原為初始雛形範例資料嗎？（自訂新增內容將會重置）')) {
                    onResetDefault();
                    onClose();
                  }
                }}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                還原為預設雛形範例
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex justify-end">
          <button onClick={onClose} className="button-secondary text-xs">
            關閉
          </button>
        </div>

      </div>
    </div>
  );
};
