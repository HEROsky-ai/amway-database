'use client';

import React, { useState, useEffect } from 'react';
import { getCloudCredentials, setCloudCredentials } from '@/lib/db';
import { X, Cloud, Check, Copy, Database, RefreshCw, Upload } from 'lucide-react';

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
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getCloudCredentials();
      setUrl(creds.url);
      setKey(creds.key);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sqlCode = `create table if not exists amway_items (
  id text primary key,
  title text not null,
  category text not null,
  subcategory text,
  tags text[],
  summary text,
  content text,
  highlights text[],
  qa jsonb,
  "isFavorite" boolean default false,
  "updatedAt" text
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setCloudCredentials(url, key);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="clean-modal w-full max-w-xl flex flex-col overflow-hidden text-white my-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-400" />
            <span>設定永久雲端資料庫 (Supabase / Vercel)</span>
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Intro */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-slate-200">
            <p className="font-semibold text-emerald-300 mb-1">💡 如何建立真正的永久跨使用者共享資料庫？</p>
            <p className="text-slate-300">
              免費申請 **Supabase.com** 雲端資料庫，將專案的 URL 與 Key 貼在下方即可使所有存取此網頁的使用者共享永久資料！
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveConfig} className="space-y-3 p-4 bg-slate-900/60 rounded-xl border border-white/10">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Supabase URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Supabase Anon Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {savedSuccess ? (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-4 h-4" /> 已儲存雲端設定！
                </span>
              ) : (
                <span className="text-slate-500">輸入完畢點擊右側儲存即可生效</span>
              )}

              <button type="submit" className="btn-primary">
                儲存雲端連線
              </button>
            </div>
          </form>

          {/* SQL Generator */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                Supabase 建表 SQL 腳本
              </span>
              <button
                onClick={handleCopySql}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded flex items-center gap-1"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSql ? '已複製 SQL' : '複製 SQL'}
              </button>
            </div>
            <pre className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
              {sqlCode}
            </pre>
          </div>

          {/* Backup & Restore */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <label className="btn-secondary text-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>匯入 JSON 備份</span>
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('確定要恢復為初始雛形範例嗎？')) {
                  onResetDefault();
                  onClose();
                }
              }}
              className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 重置預設範例
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
