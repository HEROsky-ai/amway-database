'use client';

import React, { useState } from 'react';
import { DatabaseItem } from '@/lib/types';
import { Star, Copy, Check, Edit2, Trash2 } from 'lucide-react';

interface NoteCardProps {
  item: DatabaseItem;
  isSelected: boolean;
  onSelect: (item: DatabaseItem) => void;
  onEdit: (item: DatabaseItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `【${item.title}】\n\n${item.summary}\n\n${
      item.highlights?.length ? '【亮點】\n' + item.highlights.map((h) => `• ${h}`).join('\n') : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={`note-card${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(item)}
    >
      {/* Header */}
      <div className="note-header">
        <span className="note-subcategory">{item.subcategory}</span>
      </div>

      {/* Title + Summary */}
      <div>
        <div className="note-title">{item.title}</div>
        <div className="note-summary">{item.summary}</div>
      </div>

      {/* Footer */}
      <div className="note-footer">
        <button
          className={`note-copy-btn${copied ? ' copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '已複製' : '複製'}
        </button>

        <div className="note-actions">
          <button
            className={`note-action-btn favorite${item.isFavorite ? ' active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
            title="精選"
          >
            <Star size={14} className={item.isFavorite ? 'star-active' : ''} />
          </button>
          <button
            className="note-action-btn"
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            title="編輯"
          >
            <Edit2 size={14} />
          </button>
          <button
            className="note-action-btn danger"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`確定要刪除「${item.title}」嗎？`)) onDelete(item.id);
            }}
            title="刪除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
