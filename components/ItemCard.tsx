'use client';

import React, { useState } from 'react';
import { DatabaseItem, CATEGORIES } from '@/lib/types';
import { Star, Copy, Edit2, Trash2, ArrowRight, Check, HelpCircle, Layers } from 'lucide-react';

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

  const catInfo = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `【${item.title}】\n\n${item.summary}\n\n【核心亮點】\n${
      item.highlights?.map((h) => `• ${h}`).join('\n') || item.content
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="glass-panel group relative flex flex-col justify-between p-5 hover:bg-slate-800/90 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Top Background Gradient Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 opacity-80"
        style={{ backgroundColor: catInfo.color }}
      />

      <div>
        {/* Header Info: Subcategory & Favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            style={{
              backgroundColor: `${catInfo.color}20`,
              color: catInfo.color,
              border: `1px solid ${catInfo.color}40`,
            }}
          >
            <Layers className="w-3 h-3" />
            {item.subcategory}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
            title={item.isFavorite ? '取消精選' : '設為精選'}
          >
            <Star
              className={`w-4 h-4 ${
                item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-slate-300 text-xs line-clamp-3 mb-4 leading-relaxed">
          {item.summary}
        </p>

        {/* Q&A / Highlights Counter indicators */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-4">
          {item.highlights && item.highlights.length > 0 && (
            <span className="flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
              <Check className="w-3 h-3 text-emerald-400" />
              {item.highlights.length} 項亮點
            </span>
          )}
          {item.qa && item.qa.length > 0 && (
            <span className="flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              {item.qa.length} 組 QA 答辯
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 bg-slate-900/40 text-slate-400 rounded-md border border-white/5"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 4 && (
            <span className="text-[10px] text-slate-500 self-center">
              +{item.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {/* Copy Promo Button */}
          <button
            onClick={handleCopyText}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="複製產品簡介與亮點"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                已複製
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                複製文案
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="編輯內容"
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
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
            title="刪除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="ml-1 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
