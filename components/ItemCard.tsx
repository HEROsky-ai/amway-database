'use client';

import React, { useState } from 'react';
import { DatabaseItem } from '@/lib/types';
import { Star, Copy, Edit2, Trash2, Check, ArrowRight } from 'lucide-react';

interface ItemCardProps {
  item: DatabaseItem;
  onSelect: (item: DatabaseItem) => void;
  onEdit: (item: DatabaseItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `【${item.title}】\n\n${item.summary}\n\n【重點亮點】\n${
      item.highlights?.map((h) => `• ${h}`).join('\n') || item.content
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="clean-card p-5 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Header: Subcategory & Favorite */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {item.subcategory}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Star
              className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed mb-4">
          {item.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
        <button
          onClick={handleCopy}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> 已複製
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> 複製文案
            </>
          )}
        </button>

        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1 hover:text-white"
            title="編輯"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`確定要刪除「${item.title}」嗎？`)) {
                onDelete(item.id);
              }
            }}
            className="p-1 hover:text-rose-400"
            title="刪除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <ArrowRight className="w-4 h-4 ml-1 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </div>
      </div>
    </div>
  );
};
