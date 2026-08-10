'use client';

import React, { useState } from 'react';
import { DatabaseItem, CATEGORIES, formatFileSize } from '@/lib/types';
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
  Paperclip,
  Download,
  FileText,
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
      <div className="clean-modal w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-white my-auto">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {catInfo.name} • {item.subcategory}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(item.updatedAt).toLocaleDateString('zh-TW')}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {item.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(item)} className="btn-secondary text-xs">
              <Edit2 className="w-3.5 h-3.5" /> 編輯
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10">
            <h4 className="font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 核心快訊與摘要
            </h4>
            <p className="text-slate-200 leading-relaxed">{item.summary}</p>
          </div>

          {/* Full Content */}
          <div>
            <h4 className="font-bold text-white mb-1.5 border-b border-white/10 pb-1">
              詳細說明與內容
            </h4>
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-white/5">
              {item.content}
            </div>
          </div>

          {/* File Attachments Section */}
          {item.attachments && item.attachments.length > 0 && (
            <div>
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-cyan-400" />
                下載檔案附件 (上限 0.5 GB)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    download={file.name}
                    className="p-3 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/50 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div className="overflow-hidden">
                        <div className="font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {file.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {item.highlights && item.highlights.length > 0 && (
            <div>
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                訴求關鍵亮點
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.highlights.map((h, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q&A Section */}
          {item.qa && item.qa.length > 0 && (
            <div>
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                常見顧客問答 (Q&A)
              </h4>
              <div className="space-y-2">
                {item.qa.map((qa, index) => (
                  <div key={index} className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-semibold text-cyan-300 flex items-start gap-1.5">
                        <span className="px-1 py-0.2 bg-cyan-500/20 rounded text-[10px] font-bold">Q</span>
                        {qa.question}
                      </h5>
                      <button
                        onClick={() => handleCopyQA(index, qa.question, qa.answer)}
                        className="text-[11px] px-2 py-0.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 flex items-center gap-1 shrink-0"
                      >
                        {copiedQaIndex === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedQaIndex === index ? '已複製' : '複製 QA'}
                      </button>
                    </div>
                    <p className="text-slate-300 pl-5 leading-relaxed">{qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <div className="flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md text-[10px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900 flex items-center justify-between">
          <button onClick={handleCopyFull} className="btn-primary text-xs">
            {copiedAll ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copiedAll ? '已複製完整內容' : '一鍵複製完整宣傳與 QA 文案'}
          </button>
          <button onClick={onClose} className="btn-secondary text-xs">
            關閉
          </button>
        </div>

      </div>
    </div>
  );
};
