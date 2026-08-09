'use client';

import React, { useState } from 'react';
import { DatabaseItem } from '@/lib/types';
import { Check, Copy, Edit2, FileText, Star, Trash2 } from 'lucide-react';

const text = {
  uncategorized: '\u4e00\u822c\u7b46\u8a18',
  favoriteOn: '\u53d6\u6d88\u6536\u85cf',
  favoriteOff: '\u52a0\u5165\u6536\u85cf',
  keyPoints: '\u91cd\u9ede\u6574\u7406',
  copied: '\u5df2\u8907\u88fd',
  copy: '\u8907\u88fd\u6458\u8981',
  edit: '\u7de8\u8f2f',
  delete: '\u522a\u9664',
  confirmDelete: '\u78ba\u5b9a\u8981\u522a\u9664\u9019\u7b46\u8cc7\u6599\u55ce\uff1f',
  open: '\u958b\u555f\u7b46\u8a18',
};

interface ItemCardProps {
  item: DatabaseItem;
  isSelected?: boolean;
  onSelect: (item: DatabaseItem) => void;
  onEdit: (item: DatabaseItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const highlights = item.highlights?.length
      ? item.highlights.map((h) => `- ${h}`).join('\n')
      : item.content;
    const textToCopy = `${item.title}\n\n${item.summary}\n\n${text.keyPoints}:\n${highlights}`;

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className={`item-card note-card ${isSelected ? 'selected' : ''}`}>
      <button className="card-main" type="button" onClick={() => onSelect(item)} title={text.open}>
        <div className="card-top">
          <span className="note-type">
            <FileText size={15} />
            {item.subcategory || text.uncategorized}
          </span>
          <span className="note-date">{new Date(item.updatedAt).toLocaleDateString('zh-TW')}</span>
        </div>
        <h2 className="card-title line-clamp-2">{item.title}</h2>
        <p className="card-summary line-clamp-3">{item.summary || item.content}</p>
      </button>

      <div className="card-footer">
        <button
          type="button"
          onClick={handleCopy}
          className={copied ? 'btn-secondary favorite-toggle active' : 'btn-secondary'}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? text.copied : text.copy}</span>
        </button>

        <div className="mini-actions">
          <button
            type="button"
            className="icon-btn"
            title={item.isFavorite ? text.favoriteOn : text.favoriteOff}
            onClick={() => onToggleFavorite(item.id)}
          >
            <Star
              size={17}
              color={item.isFavorite ? '#b7791f' : 'currentColor'}
              fill={item.isFavorite ? '#b7791f' : 'none'}
            />
          </button>
          <button type="button" className="icon-btn" title={text.edit} onClick={() => onEdit(item)}>
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="icon-btn"
            title={text.delete}
            onClick={() => {
              if (window.confirm(text.confirmDelete)) onDelete(item.id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};
