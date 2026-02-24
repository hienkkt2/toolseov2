import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Copy, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  LayoutDashboard,
  Zap,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import { generateSEOArticle, generateKeywordCluster } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'article' | 'cluster'>('article');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [apiBaseUrl, setApiBaseUrl] = useState(() => localStorage.getItem('gemini_api_base_url') || '');

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const handleApiBaseUrlChange = (val: string) => {
    setApiBaseUrl(val);
    localStorage.setItem('gemini_api_base_url', val);
  };

  // Article Inputs
  const [keyBlog, setKeyBlog] = useState('');
  const [keyPhu, setKeyPhu] = useState('');
  const [sanPhamLienQuan, setSanPhamLienQuan] = useState('');

  // Cluster Inputs
  const [keyChinh, setKeyChinh] = useState('');

  const handleGenerateArticle = async () => {
    if (!keyBlog) return;
    setLoading(true);
    setResult('');
    try {
      const output = await generateSEOArticle({
        keyBlog,
        keyPhu,
        sanPhamLienQuan
      }, apiKey, apiBaseUrl);
      setResult(output || '');
    } catch (error) {
      console.error(error);
      setResult('Đã có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCluster = async () => {
    if (!keyChinh) return;
    setLoading(true);
    setResult('');
    try {
      const output = await generateKeywordCluster(keyChinh, apiKey, apiBaseUrl);
      setResult(output || '');
    } catch (error) {
      console.error(error);
      setResult('Đã có lỗi xảy ra khi tạo Keyword Cluster. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Đình Hiển Marketing</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">SEO Strategy Expert</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('article'); setResult(''); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'article' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <FileText className="w-4 h-4" />
              Viết bài SEO
            </button>
            <button
              onClick={() => { setActiveTab('cluster'); setResult(''); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'cluster' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Target className="w-4 h-4" />
              Keyword Cluster
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <a 
              href="https://facebook.com/dinhhienmarketing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-slate-900">
                  {activeTab === 'article' ? 'Cấu hình bài viết' : 'Phân tích từ khóa'}
                </h2>
              </div>

              {activeTab === 'article' ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Gemini API Key (Tùy chọn)</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="Dán API Key của bạn vào đây..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 italic">* Để trống nếu muốn dùng API mặc định của hệ thống.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">KEY BLOG (Từ khóa chính)</label>
                    <input
                      type="text"
                      value={keyBlog}
                      onChange={(e) => setKeyBlog(e.target.value)}
                      placeholder="Ví dụ: Cách chọn máy lọc nước 2025"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">KEY PHỤ (Semantic Keywords)</label>
                    <textarea
                      value={keyPhu}
                      onChange={(e) => setKeyPhu(e.target.value)}
                      placeholder="Mỗi từ khóa một dòng..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">SẢN PHẨM LIÊN QUAN (Link/Tên)</label>
                    <input
                      type="text"
                      value={sanPhamLienQuan}
                      onChange={(e) => setSanPhamLienQuan(e.target.value)}
                      placeholder="Tên sản phẩm hoặc link trang đích"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <button
                    onClick={handleGenerateArticle}
                    disabled={loading || !keyBlog}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    Bắt đầu viết bài chuẩn SEO
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Gemini API Key (Tùy chọn)</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="Dán API Key của bạn vào đây..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">KEY CHÍNH (Seed Keyword)</label>
                    <input
                      type="text"
                      value={keyChinh}
                      onChange={(e) => setKeyChinh(e.target.value)}
                      placeholder="Ví dụ: Máy lọc nước ion kiềm"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <button
                    onClick={handleGenerateCluster}
                    disabled={loading || !keyChinh}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Phân tích Keyword Cluster
                  </button>
                </div>
              )}
            </div>

            {/* Checklist Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold">Tiêu chuẩn Rank Math 100</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Độ dài 1800 - 2500 từ chuyên sâu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Tối ưu mật độ từ khóa 1.2% - 1.8%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Có External Link & 3 Internal Links</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Cấu trúc HTML chuẩn WordPress Ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>FAQ Accordion & Bảng so sánh</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-600">Kết quả xử lý</span>
                </div>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Sao chép HTML
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 min-h-[500px]">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <div className="relative">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                      <Zap className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-900 font-medium">Đang xử lý dữ liệu...</p>
                      <p className="text-sm">AI đang đóng vai chuyên gia SEO 15 năm kinh nghiệm</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="markdown-body animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div dangerouslySetInnerHTML={{ __html: result }} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
                    <div className="bg-slate-100 p-6 rounded-full">
                      <FileText className="w-12 h-12" />
                    </div>
                    <div className="text-center max-w-xs">
                      <p className="font-medium text-slate-600">Chưa có nội dung</p>
                      <p className="text-sm">Nhập thông tin bên trái và nhấn nút để bắt đầu tạo nội dung chuẩn SEO.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">Đình Hiển Marketing</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} SEO Master Tool. Phát triển bởi chuyên gia Đình Hiển.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1">
                Hướng dẫn sử dụng <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1">
                Liên hệ hỗ trợ <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
