'use client';

import React from 'react';
import { Database, Plus, Download, Cloud, Sparkles } from 'lucide-react';

interface HeaderProps {
  onAddNew: () => void;
  onExport: () => void;
  onOpenCloudSync: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onAddNew,
  onExport,
  onOpenCloudSync,
  totalCount,
}) => {
  return (
    <header className="w-full pt-8 pb-6 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        
        {/* Title Section */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white mt-1">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                安麗萬能資料庫
              </h1>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                共 {totalCount} 筆資料
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              團隊共享知識庫：營養保健 • 淨水器 • 空氣清淨機 • 事業與起步問答
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onAddNew}
            className="button-primary"
            title="新增一筆資料或產品資訊"
          >
            <Plus className="w-4 h-4" />
            <span>新增資料</span>
          </button>

          <button
            onClick={onExport}
            className="button-secondary"
            title="將資料庫備份為 JSON 檔案"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">匯出備份</span>
          </button>

          <button
            onClick={onOpenCloudSync}
            className="button-secondary"
            title="設定 Vercel / Supabase 雲端多人共享"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">雲端共享</span>
          </button>
        </div>

      </div>
    </header>
  );
};
