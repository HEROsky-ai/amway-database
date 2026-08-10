'use client';

import React, { useState } from 'react';
import { DatabaseItem, CATEGORIES, formatFileSize } from '@/lib/types';
import {
  X, Edit2, Copy, Check, Share2, HelpCircle,
  FileText, Download, Paperclip, Sparkles, BookOpen,
} from 'lucide-react';

interface InlineDetailPanelProps {
  item: DatabaseItem;
  onClose: () => void;
  onEdit: (item: DatabaseItem) => void;
}

const getFileIcon = (type: string, name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (type.includes('pdf') || ext === 'pdf') return 'PDF';
  if (type.includes('presentation') || ['ppt', 'pptx'].includes(ext)) return 'PPT';
  if (type.startsWith('image/')) return 'IMG';
  return 'FILE';
};

const getFileClass = (type: string, name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (type.includes('pdf') || ext === 'pdf') return 'pdf';
  if (type.includes('presentation') || ['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (type.startsWith('image/')) return 'img';
  return 'file';
};

export const InlineDetailPanel: React.FC<InlineDetailPanelProps> = ({
  item,
  onClose,
  onEdit,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedQa, setCopiedQa] = useState<number | null>(null);

  const catInfo = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];

  const handleCopyAll = () => {
    const text = [
      `【${item.title}】`,
      '',
      `📌 摘要：\n${item.summary}`,
      '',
      `📝 內容：\n${item.content}`,
      item.highlights?.length ? `\n🌟 亮點：\n${item.highlights.map((h) => `• ${h}`).join('\n')}` : '',
      item.qa?.length ? `\n❓ 問答：\n${item.qa.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')}` : '',
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyQa = (idx: number, q: string, a: string) => {
    navigator.clipboard.writeText(`Q: ${q}\nA: ${a}`);
    setCopiedQa(idx);
    setTimeout(() => setCopiedQa(null), 1800);
  };

  return (
    <div className="detail-panel">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-title-block">
          <div className="detail-meta">
            <span
              className="detail-cat-badge"
              style={{ backgroundColor: catInfo.color + '20', color: catInfo.color, borderColor: catInfo.color + '50' }}
            >
              {catInfo.name}
            </span>
            <span className="detail-subcat-badge">{item.subcategory}</span>
            <span className="detail-date">
              {new Date(item.updatedAt).toLocaleDateString('zh-TW')}
            </span>
          </div>
          <div className="detail-title">{item.title}</div>
        </div>

        <div className="detail-header-actions">
          <button className="detail-icon-btn" onClick={() => onEdit(item)}>
            <Edit2 size={13} /> 編輯
          </button>
          <button className="detail-icon-btn close" onClick={onClose}>
            <X size={13} /> 關閉
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        {/* Summary */}
        <div className="detail-section">
          <div className="detail-section-label">
            <Sparkles size={12} /> 重點摘要
          </div>
          <div className="detail-summary-box">{item.summary}</div>
        </div>

        {/* Content */}
        <div className="detail-section">
          <div className="detail-section-label">
            <BookOpen size={12} /> 詳細說明
          </div>
          <div className="detail-content-box">{item.content}</div>
        </div>

        {/* Highlights */}
        {item.highlights && item.highlights.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-label">
              <Check size={12} /> 核心亮點
            </div>
            <div className="highlights-list">
              {item.highlights.map((h, idx) => (
                <div key={idx} className="highlight-item">
                  <span className="highlight-num">{idx + 1}</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q&A */}
        {item.qa && item.qa.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-label">
              <HelpCircle size={12} /> 常見問答 Q&A
            </div>
            <div className="qa-list">
              {item.qa.map((qa, idx) => (
                <div key={idx} className="qa-item">
                  <div className="qa-question">
                    <span className="qa-q-badge">Q</span>
                    <span style={{ flex: 1 }}>{qa.question}</span>
                    <button
                      className={`qa-copy-btn${copiedQa === idx ? ' copied' : ''}`}
                      onClick={() => handleCopyQa(idx, qa.question, qa.answer)}
                    >
                      {copiedQa === idx ? <Check size={11} /> : <Copy size={11} />}
                      {copiedQa === idx ? '已複製' : '複製'}
                    </button>
                  </div>
                  <div className="qa-answer">{qa.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {item.attachments && item.attachments.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-label">
              <Paperclip size={12} /> 附件檔案
            </div>
            <div className="attachments-grid">
              {item.attachments.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  download={file.name}
                  className="attachment-item"
                >
                  <div className={`attachment-icon ${getFileClass(file.type, file.name)}`}>
                    {getFileIcon(file.type, file.name)}
                  </div>
                  <div className="attachment-info">
                    <div className="attachment-name">{file.name}</div>
                    <div className="attachment-size">{formatFileSize(file.size)}</div>
                  </div>
                  <Download size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="detail-footer">
        <button
          className={`detail-copy-all-btn${copiedAll ? ' copied' : ''}`}
          onClick={handleCopyAll}
        >
          {copiedAll ? <Check size={14} /> : <Share2 size={14} />}
          {copiedAll ? '已複製完整內容' : '一鍵複製完整宣傳文案'}
        </button>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {item.tags?.map((t) => `#${t}`).join('  ')}
        </span>
      </div>
    </div>
  );
};
