'use client';

import React from 'react';
import { Database, Download, Plus } from 'lucide-react';

const text = {
  title: '\u5b89\u9e97\u8cc7\u6599\u842c\u80fd\u5eab',
  subtitle: '\u7b46\u8a18\u3001\u554f\u7b54\u8207\u5716\u7247\u6587\u5b57\u7684\u5feb\u901f\u6aa2\u7d22\u5de5\u5177',
  add: '\u65b0\u589e\u7b46\u8a18',
  export: '\u532f\u51fa',
  count: '\u7b46\u8cc7\u6599',
};

interface HeaderProps {
  onAddNew: () => void;
  onExport: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onAddNew, onExport, totalCount }) => {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Database size={22} />
          </div>
          <div>
            <h1 className="brand-title">{text.title}</h1>
            <div className="brand-meta">
              <span>{text.subtitle}</span>
              <span className="count-pill">
                {totalCount} {text.count}
              </span>
            </div>
          </div>
        </div>

        <div className="actions">
          <button onClick={onAddNew} className="btn-primary" type="button">
            <Plus size={17} />
            <span>{text.add}</span>
          </button>
          <button onClick={onExport} className="btn-secondary" type="button">
            <Download size={17} />
            <span>{text.export}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
