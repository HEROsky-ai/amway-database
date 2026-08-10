'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DatabaseItem, CategoryType, CATEGORIES, QAItem, FileAttachment, MAX_FILE_SIZE_BYTES, formatFileSize } from '@/lib/types';
import { X, Plus, Trash2, Save, Layers, Sparkles, HelpCircle, Paperclip, AlertCircle } from 'lucide-react';

interface EditItemModalProps {
  item: DatabaseItem | null;
  defaultCategory?: CategoryType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DatabaseItem) => void;
}

const ACCEPT_TYPES = '.pdf,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg';

const getFileIconClass = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (file.type.includes('pdf') || ext === 'pdf') return 'pdf';
  if (file.type.includes('presentation') || ['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (file.type.startsWith('image/')) return 'img';
  return 'file';
};

const getFileIconLabel = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (file.type.includes('pdf') || ext === 'pdf') return 'PDF';
  if (file.type.includes('presentation') || ['ppt', 'pptx'].includes(ext)) return 'PPT';
  if (file.type.startsWith('image/')) return 'IMG';
  return 'FILE';
};

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
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [qaList, setQaList] = useState<QAItem[]>([{ question: '', answer: '' }]);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setSubcategory(item.subcategory || '');
      setTitle(item.title || '');
      setSummary(item.summary || '');
      setContent(item.content || '');
      setHighlights(item.highlights && item.highlights.length > 0 ? item.highlights : ['']);
      setQaList(item.qa && item.qa.length > 0 ? item.qa : [{ question: '', answer: '' }]);
      setAttachments(item.attachments || []);
    } else {
      setCategory(defaultCategory);
      setSubcategory('');
      setTitle('');
      setSummary('');
      setContent('');
      setHighlights(['']);
      setQaList([{ question: '', answer: '' }]);
      setAttachments([]);
    }
    setPendingFiles([]);
    setFileError('');
  }, [item, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFileError('');
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversized.length > 0) {
      setFileError(`以下檔案超過 0.5 GB 上限：${oversized.map((f) => f.name).join('、')}`);
      e.target.value = '';
      return;
    }
    const invalid = files.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      const allowed = ['pdf', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
      return !allowed.includes(ext);
    });
    if (invalid.length > 0) {
      setFileError(`不支援的格式：${invalid.map((f) => f.name).join('、')}。僅支援 PDF、PPT/PPTX、圖片`);
      e.target.value = '';
      return;
    }
    setPendingFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const convertFileToAttachment = async (file: File): Promise<FileAttachment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          url: reader.result as string,
          size: file.size,
          type: file.type || 'application/octet-stream',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('請填寫標題');
      return;
    }

    const cleanedHighlights = highlights.map((h) => h.trim()).filter((h) => h.length > 0);
    const cleanedQA = qaList.filter((q) => q.question.trim() && q.answer.trim());

    // Convert new pending files to attachments
    const newAttachments = await Promise.all(pendingFiles.map(convertFileToAttachment));
    const allAttachments = [...attachments, ...newAttachments];

    const savedItem: DatabaseItem = {
      id: item ? item.id : `item-${Date.now()}`,
      title: title.trim(),
      category,
      subcategory: subcategory.trim() || '通用資訊',
      tags: [],
      summary: summary.trim(),
      content: content.trim(),
      highlights: cleanedHighlights,
      qa: cleanedQA,
      attachments: allAttachments,
      isFavorite: item ? item.isFavorite : false,
      updatedAt: new Date().toISOString(),
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">
            <Save size={16} style={{ color: 'var(--accent)' }} />
            {item ? '編輯資料' : '新增資料'}
          </span>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Category + Subcategory */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <Layers size={12} style={{ color: 'var(--accent)' }} />
                所屬分類 <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">子分類標題</label>
              <input
                className="form-input"
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="例如：核心保養 / 故障排除"
              />
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              標題名稱 <span className="required">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：Double X 綜合營養片"
            />
          </div>

          {/* Summary */}
          <div className="form-group">
            <label className="form-label">
              <Sparkles size={12} style={{ color: 'var(--amber)' }} />
              一句話摘要
            </label>
            <input
              className="form-input"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="簡短說明重點（顯示在卡片預覽）"
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">詳細說明 / 完整內容</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="輸入詳細成分、規格、使用方法或心法..."
            />
          </div>

          <hr className="form-divider" />

          {/* Highlights */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>核心亮點清單</label>
              <button type="button" className="add-row-btn" onClick={() => setHighlights([...highlights, ''])}>
                <Plus size={12} /> 新增亮點
              </button>
            </div>
            <div className="repeat-list">
              {highlights.map((h, i) => (
                <div key={i} className="repeat-item">
                  <span className="repeat-idx">{i + 1}</span>
                  <input
                    className="form-input"
                    type="text"
                    value={h}
                    onChange={(e) => {
                      const copy = [...highlights];
                      copy[i] = e.target.value;
                      setHighlights(copy);
                    }}
                    placeholder="輸入一條產品或事業亮點..."
                  />
                  {highlights.length > 1 && (
                    <button type="button" className="repeat-remove" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QA */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                <HelpCircle size={12} style={{ color: 'var(--blue)' }} />
                常見問答 Q&A
              </label>
              <button type="button" className="add-row-btn" onClick={() => setQaList([...qaList, { question: '', answer: '' }])}>
                <Plus size={12} /> 新增 QA
              </button>
            </div>
            <div className="repeat-list">
              {qaList.map((qa, idx) => (
                <div key={idx} className="qa-pair">
                  <div className="qa-pair-header">
                    <span className="qa-pair-label">QA #{idx + 1}</span>
                    {qaList.length > 1 && (
                      <button type="button" className="repeat-remove" onClick={() => setQaList(qaList.filter((_, j) => j !== idx))}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <input
                    className="form-input"
                    type="text"
                    value={qa.question}
                    onChange={(e) => {
                      const copy = [...qaList];
                      copy[idx].question = e.target.value;
                      setQaList(copy);
                    }}
                    placeholder="問題，例如：孕婦可以食用嗎？"
                  />
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={qa.answer}
                    onChange={(e) => {
                      const copy = [...qaList];
                      copy[idx].answer = e.target.value;
                      setQaList(copy);
                    }}
                    placeholder="完整答辯內容..."
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="form-divider" />

          {/* File Upload */}
          <div className="form-group">
            <label className="form-label">
              <Paperclip size={12} />
              附件上傳（PDF / PPT / 圖片，每個檔案最大 0.5 GB）
            </label>

            {/* Existing attachments */}
            {attachments.length > 0 && (
              <div className="file-list">
                {attachments.map((att) => (
                  <div key={att.id} className="file-item">
                    <div className={`file-item-icon ${att.type.includes('pdf') ? 'pdf' : att.type.includes('presentation') ? 'ppt' : 'img'}`}
                      style={{ fontSize: '9px', fontWeight: 800, background: att.type.includes('pdf') ? 'rgba(248,81,73,0.12)' : att.type.includes('presentation') ? 'rgba(248,129,20,0.12)' : 'rgba(31,111,235,0.12)', color: att.type.includes('pdf') ? '#f85149' : att.type.includes('presentation') ? '#f88014' : 'var(--blue)', borderRadius: 5, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {att.type.includes('pdf') ? 'PDF' : att.type.includes('presentation') ? 'PPT' : 'IMG'}
                    </div>
                    <span className="file-item-name">{att.name}</span>
                    <span className="file-item-size">{formatFileSize(att.size)}</span>
                    <button type="button" className="file-item-remove" onClick={() => removeAttachment(att.id)}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pending new files */}
            {pendingFiles.length > 0 && (
              <div className="file-list">
                {pendingFiles.map((file, idx) => (
                  <div key={idx} className="file-item">
                    <div style={{ fontSize: '9px', fontWeight: 800, background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: 5, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {getFileIconLabel(file)}
                    </div>
                    <span className="file-item-name">{file.name}</span>
                    <span className="file-item-size">{formatFileSize(file.size)}</span>
                    <button type="button" className="file-item-remove" onClick={() => removePendingFile(idx)}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {fileError && (
              <div className="error-banner">
                <AlertCircle size={14} />
                {fileError}
              </div>
            )}

            <div className="upload-area" style={{ marginTop: attachments.length > 0 || pendingFiles.length > 0 ? 8 : 0 }}>
              <label className="upload-label-btn" style={{ cursor: 'pointer' }}>
                <Paperclip size={13} />
                選擇檔案
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_TYPES}
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </label>
              <div className="upload-hint">支援 PDF、PPT、PPTX、JPG、PNG、GIF、WebP，每個最大 500 MB</div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-green" onClick={handleSubmit as unknown as React.MouseEventHandler}>
            <Save size={14} />
            儲存資料
          </button>
        </div>
      </div>
    </div>
  );
};
