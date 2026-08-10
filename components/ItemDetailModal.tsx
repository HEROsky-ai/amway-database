'use client';

import React, { useState } from 'react';
import { DatabaseItem, CATEGORIES } from '@/lib/types';
import {
  X,
  Copy,
  Check,
  Edit2,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Tag,
  Clock,
  Share2,
} from 'lucide-react';

interface ItemDetailModalProps {
  item: DatabaseItem | null;
  onClose: () => void;
  onEdit: (item: DatabaseItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onEdit,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedQaIndex, setCopiedQaIndex] = useState<number | null>(null);

  if (!item) return null;

  const catInfo = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];

  const handleCopyFull = () => {
    const text = `【${item.title}】\n\n📌 摘要說明：\n${item.summary}\n\n📝 詳細資訊：\n${item.content}\n\n🌟 產品亮點：\n${
      item.highlights?.map((h) => `• ${h}`).join('\n') || '無'
    }\n\n❓ 常見問答：\n${
      item.qa?.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n') || '無'
    }`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyQA = (index: number, q: string, a: string) => {
    const text = `問：${q}\n答：${a}`;
    navigator.clipboard.writeText(text);
    setCopiedQaIndex(index);
    setTimeout(() => setCopiedQaIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="glass-modal w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-white my-auto">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-900/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${catInfo.color}25`,
                  color: catInfo.color,
                  border: `1px solid ${catInfo.color}40`,
                }}
              >
                {catInfo.name} • {item.subcategory}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(item.updatedAt).toLocaleDateString('zh-TW')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {item.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition-colors border border-white/10"
              title="編輯此筆資料"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-white/10 shadow-inner">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 核心快訊與摘要
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed">{item.summary}</p>
          </div>

          {/* Full Content */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 pb-1 border-b border-white/10 flex items-center gap-2">
              <span>詳細內容與說明</span>
            </h4>
            <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed space-y-2 bg-slate-950/40 p-4 rounded-xl border border-white/5">
              {item.content}
            </div>
          </div>

          {/* Highlights */}
          {item.highlights && item.highlights.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>產品 / 訴求關鍵亮點</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/50 border border-white/5 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-200 leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q&A Section */}
          {item.qa && item.qa.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>常見顧客問答 (Q&A)</span>
              </h4>
              <div className="space-y-3">
                {item.qa.map((qa, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h5 className="text-sm font-semibold text-cyan-300 flex items-start gap-2">
                        <span className="px-1.5 py-0.5 bg-cyan-500/20 rounded text-xs font-bold">Q</span>
                        {qa.question}
                      </h5>
                      <button
                        onClick={() => handleCopyQA(index, qa.question, qa.answer)}
                        className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded border border-white/10 flex items-center gap-1 shrink-0"
                        title="複製這條 QA 答辯"
                      >
                        {copiedQaIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            已複製
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            複製此 QA
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-slate-300 text-xs pl-6 leading-relaxed">
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {item.links && item.links.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-2">外部參考與延伸資源</h4>
              <div className="flex flex-wrap gap-2">
                {item.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags Footer */}
          <div className="flex items-center gap-2 pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <div className="flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[11px]"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleCopyFull}
            className="button-primary text-xs"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4" />
                已複製完整資料包
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                一鍵複製完整宣傳與 QA 文案
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="button-secondary text-xs"
          >
            關閉
          </button>
        </div>

      </div>
    </div>
  );
};
