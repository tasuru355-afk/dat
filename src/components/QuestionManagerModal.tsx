import React, { useState, useRef, useMemo } from 'react';
import { Question, QuestionCategory, QuestionDifficulty } from '../types/question';
import { QuestionStore } from '../utils/questionStore';
import { generateAIQuestions } from '../utils/aiGenerator';
import { 
  X, Plus, Edit3, Trash2, Download, Upload, RotateCcw, 
  Search, Sparkles, Check, AlertCircle, BookOpen, Layers,
  Database, HelpCircle, ArrowLeft, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface QuestionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsUpdated: () => void;
}

const DEFAULT_CATEGORIES: string[] = [
  'Tin học',
  'Toán học',
  'Tiếng Anh',
  'Lịch sử',
  'Địa lý',
  'Khoa học',
  'Văn học',
  'Tổng hợp',
];

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  isOpen,
  onClose,
  onQuestionsUpdated,
}) => {
  const [questions, setQuestions] = useState<Question[]>(() => QuestionStore.getQuestions());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete Confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctIndex: number;
    category: string;
    isCustomCategory: boolean;
    customCategoryName: string;
    difficulty: QuestionDifficulty;
    explanation: string;
  }>({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    category: 'Tin học',
    isCustomCategory: false,
    customCategoryName: '',
    difficulty: 'medium',
    explanation: '',
  });

  const [formError, setFormError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [lastSavedTime, setLastSavedTime] = useState<string>('vừa xong');

  // AI Generator state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState('Tin học');
  const [showAiPanel, setShowAiPanel] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract all existing unique categories
  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    questions.forEach(q => {
      if (q.category) set.add(q.category);
    });
    return Array.from(set);
  }, [questions]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: questions.length };
    allCategories.forEach(cat => {
      counts[cat] = questions.filter(q => q.category === cat).length;
    });
    return counts;
  }, [questions, allCategories]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch = 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.explanation && q.explanation.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [questions, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      category: selectedCategory !== 'all' ? selectedCategory : 'Tin học',
      isCustomCategory: false,
      customCategoryName: '',
      difficulty: 'medium',
      explanation: '',
    });
    setFormError('');
    setIsEditing(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingId(q.id);
    const isCustom = !DEFAULT_CATEGORIES.includes(q.category);
    setFormData({
      question: q.question,
      optionA: q.options[0] || '',
      optionB: q.options[1] || '',
      optionC: q.options[2] || '',
      optionD: q.options[3] || '',
      correctIndex: q.correctIndex,
      category: isCustom ? 'custom' : q.category,
      isCustomCategory: isCustom,
      customCategoryName: isCustom ? q.category : '',
      difficulty: q.difficulty || 'medium',
      explanation: q.explanation || '',
    });
    setFormError('');
    setIsEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }
    if (!formData.optionA.trim() || !formData.optionB.trim() || !formData.optionC.trim() || !formData.optionD.trim()) {
      setFormError('Vui lòng điền đầy đủ cả 4 phương án A, B, C, D.');
      return;
    }

    const finalCategory = formData.isCustomCategory 
      ? (formData.customCategoryName.trim() || 'Tổng hợp') 
      : formData.category;

    if (editingId) {
      // SỬA (Update): cập nhật trực tiếp vào danh sách và localStorage
      QuestionStore.updateQuestion(editingId, {
        question: formData.question.trim(),
        options: [formData.optionA.trim(), formData.optionB.trim(), formData.optionC.trim(), formData.optionD.trim()],
        correctIndex: formData.correctIndex,
        category: finalCategory,
        difficulty: formData.difficulty,
        explanation: formData.explanation.trim() || 'Không có giải thích chi tiết.',
      });
      showNotification('Đã cập nhật câu hỏi thành công vào bộ nhớ trình duyệt!');
    } else {
      // THÊM MỚI (Create): lưu trực tiếp vào danh sách và localStorage
      QuestionStore.addQuestion({
        question: formData.question.trim(),
        options: [formData.optionA.trim(), formData.optionB.trim(), formData.optionC.trim(), formData.optionD.trim()],
        correctIndex: formData.correctIndex,
        category: finalCategory,
        difficulty: formData.difficulty,
        explanation: formData.explanation.trim() || 'Không có giải thích chi tiết.',
        source: 'user',
      });
      showNotification('Đã thêm câu hỏi mới thành công vào bộ nhớ trình duyệt!');
    }

    setQuestions(QuestionStore.getQuestions());
    setIsEditing(false);
    onQuestionsUpdated();
  };

  // XÓA (Delete): Xóa câu hỏi khỏi chủ đề
  const confirmDelete = () => {
    if (!deleteTarget) return;
    QuestionStore.deleteQuestion(deleteTarget.id);
    setQuestions(QuestionStore.getQuestions());
    showNotification(`Đã xóa câu hỏi khỏi chủ đề "${deleteTarget.category}".`);
    setDeleteTarget(null);
    onQuestionsUpdated();
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách câu hỏi gốc mặc định? Dữ liệu câu hỏi tự thêm sẽ được đưa về mẫu chuẩn.')) {
      const reset = QuestionStore.resetToDefaults();
      setQuestions(reset);
      showNotification('Đã khôi phục ngân hàng câu hỏi mặc định!');
      onQuestionsUpdated();
    }
  };

  const handleExport = () => {
    const dataStr = QuestionStore.exportJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contra_mario_de_thi_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Đã xuất tệp câu hỏi JSON thành công!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const result = QuestionStore.importJSON(content);
        if (result.success) {
          setQuestions(QuestionStore.getQuestions());
          showNotification(`Đã nhập thành công ${result.count} câu hỏi vào localStorage!`);
          onQuestionsUpdated();
        } else {
          alert(result.error || 'Lỗi nhập tệp JSON.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      alert('Vui lòng nhập chủ đề câu hỏi bạn muốn AI tạo.');
      return;
    }

    setIsAiLoading(true);
    try {
      const generated = await generateAIQuestions(aiTopic, 3, aiCategory);
      generated.forEach(q => {
        QuestionStore.addQuestion(q);
      });
      setQuestions(QuestionStore.getQuestions());
      showNotification(`AI đã tạo và lưu thành công ${generated.length} câu hỏi mới!`);
      setAiTopic('');
      setShowAiPanel(false);
      onQuestionsUpdated();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi khi tạo câu hỏi với AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Quản Lý Câu Hỏi / Cài Đặt Đề Thi
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-retro text-[10px]">
                  {questions.length} CÂU
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Database className="w-3.5 h-3.5" />
                  <span>Tự động lưu vào trình duyệt (localStorage)</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">Tải lại (F5) không mất</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success toast notification */}
        {successMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">{successMsg}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80">Lưu lúc: {lastSavedTime}</span>
          </div>
        )}

        {/* Toolbar & Actions */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Câu Hỏi Mới</span>
            </button>

            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="px-3.5 py-2 bg-purple-600/90 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-purple-500/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Tạo Đề Bằng AI</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              title="Xuất ngân hàng câu hỏi thành tệp .json để chia sẻ hoặc sao lưu"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Xuất JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Nhập bộ đề thi câu hỏi từ tệp JSON"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Nhập JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={handleResetDefaults}
              title="Khôi phục ngân hàng câu hỏi gốc mặc định"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Generator Panel */}
        {showAiPanel && (
          <div className="bg-purple-950/40 border-b border-purple-800/40 px-5 py-3.5 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-xs text-purple-300 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trợ lý AI soạn câu hỏi trắc nghiệm tự động (Google Gemini):</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="text"
                value={aiTopic}
                onChange={e => setAiTopic(e.target.value)}
                placeholder="Nhập chủ đề (VD: Lập trình Python, Chiến dịch Điện Biên Phủ, Từ vựng Unit 5...)"
                className="flex-1 w-full bg-slate-900 border border-purple-700/60 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <select
                value={aiCategory}
                onChange={e => setAiCategory(e.target.value)}
                className="w-full sm:w-36 bg-slate-900 border border-purple-700/60 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                {allCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiLoading}
                className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {isAiLoading ? 'Đang tạo...' : 'Tạo 3 câu'}
              </button>
            </div>
          </div>
        )}

        {/* Lọc & Phân Loại Chủ Đề Bar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Category Tabs with dynamic counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Chủ đề:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>Tất cả</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}>
                {categoryCounts['all'] || 0}
              </span>
            </button>

            {allCategories.map(cat => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {isEditing ? (
            /* FORM THÊM MỚI / CHỈNH SỬA CÂU HỎI */
            <form onSubmit={handleSaveForm} className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>{editingId ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Mới Câu Hỏi Vào Chủ Đề'}</span>
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Hủy bỏ
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Chọn Chủ Đề & Độ Khó */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chủ đề môn học *
                  </label>
                  {!formData.isCustomCategory ? (
                    <div className="flex gap-2">
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {allCategories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isCustomCategory: true })}
                        className="px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 bg-slate-800 rounded-lg border border-slate-700 whitespace-nowrap cursor-pointer"
                      >
                        + Khác
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.customCategoryName}
                        onChange={e => setFormData({ ...formData, customCategoryName: e.target.value })}
                        placeholder="Nhập tên chủ đề mới..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isCustomCategory: false })}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 whitespace-nowrap cursor-pointer"
                      >
                        Chọn có sẵn
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Độ khó
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({ ...formData, difficulty: e.target.value as QuestionDifficulty })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="easy">Dễ (Học sinh lớp cơ bản)</option>
                    <option value="medium">Trung bình (Tiêu chuẩn)</option>
                    <option value="hard">Khó (Thử thách nâng cao)</option>
                  </select>
                </div>
              </div>

              {/* 2. Nội Dung Câu Hỏi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nội dung câu hỏi ôn tập *
                </label>
                <textarea
                  rows={2}
                  value={formData.question}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Ví dụ: Trong máy tính, RAM là viết tắt của cụm từ nào?..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-body"
                />
              </div>

              {/* 3. 4 Phương Án A - B - C - D và Chọn Đáp Án Đúng */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    4 Phương án A - B - C - D (Bấm vào nút tròn để chọn đáp án ĐÚNG) *
                  </label>
                  <span className="text-[11px] text-amber-400 font-medium">
                    Đáp án đúng: {['A', 'B', 'C', 'D'][formData.correctIndex]}
                  </span>
                </div>

                {[
                  { key: 'optionA' as const, label: 'A', idx: 0 },
                  { key: 'optionB' as const, label: 'B', idx: 1 },
                  { key: 'optionC' as const, label: 'C', idx: 2 },
                  { key: 'optionD' as const, label: 'D', idx: 3 },
                ].map(item => {
                  const isChecked = formData.correctIndex === item.idx;
                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, correctIndex: item.idx })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-retro text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300 scale-105'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                        }`}
                        title={`Bấm để chọn ${item.label} làm đáp án đúng`}
                      >
                        {item.label}
                      </button>
                      <input
                        type="text"
                        value={formData[item.key]}
                        onChange={e => setFormData({ ...formData, [item.key]: e.target.value })}
                        placeholder={`Phương án ${item.label}`}
                        className={`flex-1 bg-slate-950 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-colors ${
                          isChecked ? 'border-emerald-500/80 ring-1 ring-emerald-500/40' : 'border-slate-700 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 4. Gợi Ý & Lời Giải Thích */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Gợi ý / Giải thích chi tiết kiến thức</span>
                  <span className="text-[11px] text-slate-400 font-normal">Hiển thị khi học sinh trả lời</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Cung cấp kiến thức hoặc mẹo ghi nhớ bổ ích..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-body"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  <span>Sẽ tự động lưu vào localStorage ngay khi bấm</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingId ? 'Lưu Thay Đổi' : 'Lưu Câu Hỏi Mới'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* DANH SÁCH CÂU HỎI */
            <div className="space-y-3">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">Không tìm thấy câu hỏi nào trong chủ đề này.</p>
                  <button
                    onClick={handleOpenAdd}
                    className="mt-3 px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm câu hỏi đầu tiên</span>
                  </button>
                </div>
              ) : (
                filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-slate-400">
                          <span className="font-retro text-[10px] text-amber-400">#{idx + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold border border-slate-700 text-[11px]">
                            {q.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400 capitalize text-[11px]">
                            {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'hard' ? 'Khó' : 'Trung bình'}
                          </span>
                          {q.source === 'user' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/20">
                              Người dùng thêm
                            </span>
                          )}
                          {q.source === 'ai' && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] border border-purple-500/30 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> AI
                            </span>
                          )}
                          {q.timesAnswered && q.timesAnswered > 0 ? (
                            <span className="text-emerald-400 text-[11px]">
                              Tỉ lệ đúng: {Math.round(((q.timesCorrect || 0) / q.timesAnswered) * 100)}% ({q.timesCorrect}/{q.timesAnswered})
                            </span>
                          ) : null}
                        </div>

                        {/* Question Content */}
                        <h4 className="text-sm font-semibold text-slate-100 font-body mb-2.5 leading-relaxed">
                          {q.question}
                        </h4>

                        {/* 4 Choices */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = optIdx === q.correctIndex;
                            return (
                              <div
                                key={optIdx}
                                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                                  isCorrect
                                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 font-medium'
                                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-retro font-bold shrink-0 ${
                                  isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-black/40 text-amber-300'
                                }`}>
                                  {['A', 'B', 'C', 'D'][optIdx]}
                                </span>
                                <span className="truncate">{opt}</span>
                                {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="mt-2.5 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                            <span className="font-semibold text-amber-400">💡 Gợi ý / Giải thích:</span>{' '}
                            <span>{q.explanation}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons (Sửa & Xóa) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 hover:border-amber-500/40 transition-colors cursor-pointer"
                          title="Sửa câu hỏi này"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Sửa</span>
                        </button>

                        <button
                          onClick={() => setDeleteTarget(q)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                          title="Xóa câu hỏi này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL XÁC NHẬN XÓA (Delete Confirmation Dialog) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500/60 rounded-2xl shadow-2xl p-5 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Xác nhận xóa câu hỏi?</h4>
                <p className="text-xs text-slate-400">Chủ đề: {deleteTarget.category}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800 line-clamp-3 leading-relaxed">
              "{deleteTarget.question}"
            </p>

            <p className="text-xs text-slate-400 mb-5">
              Câu hỏi này sẽ được xóa vĩnh viễn khỏi ngân hàng câu hỏi và tự động cập nhật ngay vào bộ nhớ trình duyệt (localStorage).
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs cursor-pointer font-bold shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
