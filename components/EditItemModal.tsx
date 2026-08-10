'use client';

import React, { useState, useEffect } from 'react';
import {
  DatabaseItem,
  CategoryType,
  CATEGORIES,
  QAItem,
  FileAttachment,
  MAX_FILE_SIZE_BYTES,
  formatFileSize,
} from '@/lib/types';
import { getCloudCredentials } from '@/lib/db';
import {
  X,
  Plus,
  Trash2,
  Save,
  Layers,
  Tag,
  Sparkles,
  HelpCircle,
  Paperclip,
  FileText,
  Upload,
  AlertCircle,
  File,
} from 'lucide-react';

interface EditItemModalProps {
  item: DatabaseItem | null;
  defaultCategory?: CategoryType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DatabaseItem) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  defaultCategory = 'nutrition',
  isOpen,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [qaList, setQaList] = useState<QAItem[]>([{ question: '', answer: '' }]);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setSubcategory(item.subcategory || '');
      setTitle(item.title || '');
      setSummary(item.summary || '');
      setContent(item.content || '');
      setTagsStr(item.tags ? item.tags.join(', ') : '');
      setHighlights(item.highlights && item.highlights.length > 0 ? item.highlights : ['']);
      setQaList(item.qa && item.qa.length > 0 ? item.qa : [{ question: '', answer: '' }]);
      setAttachments(item.attachments || []);
    } else {
      setCategory(defaultCategory);
      setSubcategory('');
      setTitle('');
      setSummary('');
      setContent('');
      setTagsStr('');
      setHighlights(['']);
      setQaList([{ question: '', answer: '' }]);
      setAttachments([]);
    }
    setFileError(null);
  }, [item, defaultCategory, isOpen]);

  if (!isOpen) return null;

  // 上傳與處理檔案 (單檔上限 500MB / 0.5GB)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFileError(null);
    setUploading(true);

    const creds = getCloudCredentials();
    const newAttachments: FileAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 檢查單檔大小 (不超過 0.5 GB = 500 MB = 524,288,000 Bytes)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
        setFileError(`❌ 檔案「${file.name}」大小為 ${sizeInMB} MB，已超過單檔上限 0.5 GB (500 MB)！`);
        setUploading(false);
        e.target.value = '';
        return;
      }

      try {
        let downloadUrl = '';

        // 1. 若設定了 Supabase，上傳至 Supabase Storage
        if (creds.url && creds.key) {
          const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const res = await fetch(`${creds.url}/storage/v1/object/amway-files/${fileName}`, {
            method: 'POST',
            headers: {
              apikey: creds.key,
              Authorization: `Bearer ${creds.key}`,
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: file,
          });

          if (res.ok) {
            downloadUrl = `${creds.url}/storage/v1/object/public/amway-files/${fileName}`;
          }
        }

        // 2. 備用：建立 Blob 預覽網址
        if (!downloadUrl) {
          downloadUrl = URL.createObjectURL(file);
        }

        newAttachments.push({
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          url: downloadUrl,
          size: file.size,
          type: file.type || 'application/octet-stream',
        });
      } catch (err) {
        console.error('檔案處理失敗:', err);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    setUploading(false);
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleAddHighlight = () => setHighlights([...highlights, '']);
  const handleUpdateHighlight = (index: number, val: string) => {
    const copy = [...highlights];
    copy[index] = val;
    setHighlights(copy);
  };
  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddQA = () => setQaList([...qaList, { question: '', answer: '' }]);
  const handleUpdateQA = (index: number, field: 'question' | 'answer', val: string) => {
    const copy = [...qaList];
    copy[index][field] = val;
    setQaList(copy);
  };
  const handleRemoveQA = (index: number) => {
    setQaList(qaList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('請填寫產品或內容標題');
      return;
    }

    const cleanedTags = tagsStr
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const savedItem: DatabaseItem = {
      id: item ? item.id : `item-${Date.now()}`,
      title: title.trim(),
      category,
      subcategory: subcategory.trim() || '通用資訊',
      tags: cleanedTags,
      summary: summary.trim(),
      content: content.trim(),
      highlights: highlights.map((h) => h.trim()).filter((h) => h.length > 0),
      qa: qaList.filter((q) => q.question.trim() && q.answer.trim()),
      attachments,
      isFavorite: item ? item.isFavorite : false,
      updatedAt: new Date().toISOString(),
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="clean-modal w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-white my-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Save className="w-4 h-4 text-emerald-400" />
            <span>{item ? '編輯資料條目' : '新增資料條目'}</span>
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                所屬分類頁籤 *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                子分類 (如: 核心保養/機型比較)
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="例如：基礎營養 / 故障排除"
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              標題名稱 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="輸入產品或問答標題..."
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              一句話重點摘要
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="用於卡片列表顯示的簡短摘要"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
            />
          </div>

          {/* Detailed Content */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              詳細說明內容
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="詳細產品資訊、規格說明或應答內容..."
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 resize-y"
            />
          </div>

          {/* File Attachments (0.5 GB Limit) */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-cyan-400" />
                上傳檔案附件 (簡報、PDF、影片、文檔)
              </label>
              <span className="text-[11px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                單檔上限 0.5 GB (500 MB)
              </span>
            </div>

            {/* Error banner */}
            {fileError && (
              <div className="p-2.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Upload Button */}
            <label className="button-secondary text-xs cursor-pointer inline-flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>{uploading ? '檔案處理中...' : '選擇檔案上傳 (不超過 500 MB)'}</span>
              <input
                type="file"
                multiple
                disabled={uploading}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {/* Uploaded File List */}
            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="p-2 bg-slate-950 rounded-lg border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <File className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate text-slate-200 font-medium">{file.name}</span>
                      <span className="text-slate-500 text-[11px]">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-300">核心亮點清單</label>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="text-xs text-emerald-400 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> 新增亮點
              </button>
            </div>
            <div className="space-y-1.5">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => handleUpdateHighlight(i, e.target.value)}
                    placeholder={`亮點 ${i + 1}`}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QA Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                常見問答 (Q&A)
              </label>
              <button
                type="button"
                onClick={handleAddQA}
                className="text-xs text-cyan-400 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> 新增 QA
              </button>
            </div>
            <div className="space-y-2">
              {qaList.map((qa, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400">QA #{idx + 1}</span>
                    {qaList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQA(idx)}
                        className="text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={qa.question}
                    onChange={(e) => handleUpdateQA(idx, 'question', e.target.value)}
                    placeholder="問題..."
                    className="w-full px-2.5 py-1 bg-slate-950 border border-white/10 rounded text-white"
                  />
                  <textarea
                    rows={2}
                    value={qa.answer}
                    onChange={(e) => handleUpdateQA(idx, 'answer', e.target.value)}
                    placeholder="回答內容..."
                    className="w-full px-2.5 py-1 bg-slate-950 border border-white/10 rounded text-white resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              標籤 (用逗號隔開)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="例如：Double X, 綜合維生素, 抗氧化"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" className="btn-primary">
              <Save className="w-4 h-4" /> 儲存資料
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
