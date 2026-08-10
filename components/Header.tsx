'use client';

import React from 'react';
import { Database, Plus, Download } from 'lucide-react';

interface HeaderProps {
  onAddNew: () => void;
  onExport: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onAddNew, onExport, totalCount }) => {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-logo">
          <div className="app-logo-icon">
            <Database size={20} />
          </div>
          <div>
            <div className="app-title">安麗萬能資料庫</div>
            <div className="app-subtitle">共 {totalCount} 筆知識筆記</div>
          </div>
        </div>

        <div className="header-actions">
          <button onClick={onAddNew} className="btn btn-green">
            <Plus size={15} />
            新增資料
          </button>
          <button onClick={onExport} className="btn btn-ghost" title="匯出 JSON 備份">
            <Download size={15} />
            <span className="hidden sm:inline">匯出</span>
          </button>
        </div>
      </div>
    </header>
  );
};
