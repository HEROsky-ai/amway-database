'use client';

import React from 'react';
import { Database, Plus, Download, Cloud } from 'lucide-react';

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
    <header className="w-full border-b border-white/10 bg-slate-950/80 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Title & Count */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                安麗萬能資料庫
              </h1>
              <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-medium">
                {totalCount} 筆資料
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button onClick={onAddNew} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>新增資料</span>
          </button>

          <button
            onClick={onOpenCloudSync}
            className="btn-secondary"
            title="永久資料庫設定 (Supabase)"
          >
            <Cloud className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">永久存檔</span>
          </button>

          <button onClick={onExport} className="btn-secondary" title="匯出 JSON 備份">
            <Download className="w-4 h-4 text-slate-400" />
          </button>
        </div>

      </div>
    </header>
  );
};
