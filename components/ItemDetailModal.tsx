'use client';

import React, { useState } from 'react';
import { CATEGORIES, DatabaseItem } from '@/lib/types';
import {
  Check,
  Copy,
  Edit2,
  ExternalLink,
  HelpCircle,
  Image as ImageIcon,
  Link,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';

const text = {
  updated: '\u66f4\u65b0',
  summary: '\u4e00\u53e5\u8a71\u6458\u8981',
  content: '\u8a73\u7d30\u5167\u5bb9',
  highlights: '\u91cd\u9ede\u6574\u7406',
  qa: '\u5e38\u898b\u554f\u7b54',
  imageText: '\u5716\u7247\u6587\u5b57',
  links: '\u76f8\u95dc\u9023\u7d50',
  copy: '\u8907\u88fd\u5168\u90e8',
  copied: '\u5df2\u8907\u88fd',
  edit: '\u7de8\u8f2f',
  close: '\u6536\u8d77',
  none: '\u7121',
};

interface ItemDetailModalProps {
  item: DatabaseItem | null;
  onClose: () => void;
  onEdit: (item: DatabaseItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onEdit }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedQaIndex, setCopiedQaIndex] = useState<number | null>(null);

  if (!item) return null;

  const catInfo = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];

  const handleCopyFull = async () => {
    const fullText = `${item.title}\n\n${text.summary}:\n${item.summary}\n\n${text.content}:\n${item.content}\n\n${text.highlights}:\n${
      item.highlights?.map((h) => `- ${h}`).join('\n') || text.none
    }\n\nQ&A:\n${item.qa?.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n') || text.none}\n\n${
      text.imageText
    }:\n${item.imageText || text.none}`;

    await navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1600);
  };

  const handleCopyQA = async (index: number, question: string, answer: string) => {
    await navigator.clipboard.writeText(`Q: ${question}\nA: ${answer}`);
    setCopiedQaIndex(index);
    window.setTimeout(() => setCopiedQaIndex(null), 1500);
  };

  return (
    <section className="detail-panel">
      <div className="detail-header">
        <div>
          <div className="brand-meta">
            <span className="tag-pill" style={{ color: catInfo.color }}>
              {catInfo.name} / {item.subcategory}
            </span>
            <span>
              {text.updated} {new Date(item.updatedAt).toLocaleDateString('zh-TW')}
            </span>
          </div>
          <h2 className="detail-title">{item.title}</h2>
        </div>
        <div className="mini-actions">
          <button className="btn-secondary" type="button" onClick={handleCopyFull}>
            {copiedAll ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copiedAll ? text.copied : text.copy}</span>
          </button>
          <button className="icon-btn" type="button" title={text.edit} onClick={() => onEdit(item)}>
            <Edit2 size={18} />
          </button>
          <button className="icon-btn" type="button" title={text.close} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <section className="section detail-summary">
          <h3 className="section-title">
            <Sparkles size={17} color="var(--primary)" />
            {text.summary}
          </h3>
          <p className="section-copy">{item.summary}</p>
        </section>

        <section className="section detail-content">
          <h3 className="section-title">{text.content}</h3>
          <p className="section-copy">{item.content}</p>
        </section>

        {!!item.highlights?.length && (
          <section className="section">
            <h3 className="section-title">
              <Check size={17} color="var(--primary)" />
              {text.highlights}
            </h3>
            <div className="highlight-grid">
              {item.highlights.map((highlight, index) => (
                <div className="highlight-item" key={`${highlight}-${index}`}>
                  <span className="index-dot">{index + 1}</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!!item.qa?.length && (
          <section className="section">
            <h3 className="section-title">
              <HelpCircle size={17} color="var(--cyan)" />
              {text.qa}
            </h3>
            <div className="qa-list">
              {item.qa.map((qa, index) => (
                <div className="qa-item" key={`${qa.question}-${index}`}>
                  <div className="form-row-between">
                    <p className="qa-question">Q. {qa.question}</p>
                    <button className="btn-secondary" type="button" onClick={() => handleCopyQA(index, qa.question, qa.answer)}>
                      {copiedQaIndex === index ? <Check size={15} /> : <Copy size={15} />}
                      <span>{copiedQaIndex === index ? text.copied : text.copy}</span>
                    </button>
                  </div>
                  <p className="qa-answer">A. {qa.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {item.imageText && (
          <section className="section">
            <h3 className="section-title">
              <ImageIcon size={17} color="var(--amber)" />
              {text.imageText}
            </h3>
            <p className="section-copy">{item.imageText}</p>
          </section>
        )}

        {!!item.links?.length && (
          <section className="section">
            <h3 className="section-title">
              <Link size={17} color="var(--indigo)" />
              {text.links}
            </h3>
            <div className="link-list">
              {item.links.map((linkItem) => (
                <a
                  className="text-link"
                  href={linkItem.url}
                  key={`${linkItem.label}-${linkItem.url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {linkItem.label}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};
