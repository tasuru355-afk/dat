import React from 'react';
import { X, Sparkles, BookOpen, Shield, Zap } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[85vh]">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <h3 className="font-retro text-sm text-amber-400">Hướng Dẫn Chơi & Ôn Tập</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 font-body text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1: Cổng Phong Ấn & Chọn Chủ Đề */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-cyan-800/60">
            <h4 className="font-retro text-xs text-cyan-300 mb-2 flex items-center gap-1.5">
              <span>⚡</span> 1. Rào Chắn / Cổng Phong Ấn & Chọn Chủ Đề Ôn Tập
            </h4>
            <p className="text-slate-300">
              Trước khi bắt đầu, người chơi <strong>bấm chọn 1 chủ đề ôn tập</strong> mong muốn (Tin học, Toán học, Tiếng Anh, Lịch sử, Địa lý, Khoa học, hoặc Tổng hợp). Trò chơi sẽ <strong>chỉ lấy các câu hỏi thuộc chủ đề đã chọn</strong> để làm thử thách trong suốt màn chơi.
            </p>
            <div className="mt-3 p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/30 space-y-2">
              <div className="text-xs text-cyan-200 font-bold">
                🔒 Cơ chế Cổng Phong Ấn Kiến Thức:
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-xs">
                <li>
                  <strong className="text-cyan-300">Khi nhân vật chạm cổng:</strong> Game lập tức <strong>TẠM DỪNG (Pause)</strong>, quái vật và đạn đóng băng hoàn toàn. Bảng câu hỏi hiện lên (lấy ngẫu nhiên từ ngân hàng câu hỏi của chủ đề đã chọn).
                </li>
                <li>
                  <strong className="text-rose-400">Trả lời SAI:</strong> Báo lỗi, hiện gợi ý chi tiết, <strong>yêu cầu chọn lại cho đến khi nào đúng (không cho đi tiếp)</strong>.
                </li>
                <li>
                  <strong className="text-emerald-400">Trả lời ĐÚNG:</strong> Cổng phong ấn nổ tung/biến mất hoàn toàn, cộng +1500 điểm, hồi phục máu & mana, rơi tiếp tế vũ khí, và game <strong>tiếp tục chạy (Resume)</strong>.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <h4 className="font-retro text-xs text-cyan-300 mb-2 flex items-center gap-1.5">
              <span>🎯</span> 2. Phím Điều Khiển & Kỹ Năng Chiến Đấu
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-mono text-amber-400 font-bold">A / D hoặc ← / →</span> : Chạy trái / phải
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-mono text-amber-400 font-bold">W / Space / ↑</span> : Nhảy lên các bậc địa hình
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-mono text-amber-400 font-bold">S hoặc ↓</span> : Cúi người né đường đạn của quái vật
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-mono text-amber-400 font-bold">Phím J hoặc Click chuột</span> : Bắn đạn thẳng hoặc bắn chéo
              </div>
              <div className="p-2 bg-slate-900 rounded border border-sky-800/80 sm:col-span-2">
                <span className="font-mono text-cyan-300 font-bold">Phím K (35 Mana)</span> : Kích hoạt <strong>Kỹ năng Mana</strong> (Khiên hộ thể bất tử 6s hoặc Đạn nổ lớn càn quét)
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 sm:col-span-2">
                <span className="font-mono text-slate-300 font-bold">Phím L</span> : Đổi loại kỹ năng giữa <span className="text-sky-300">🛡️ Khiên Hộ Thể</span> và <span className="text-amber-300">💥 Đạn Nổ Lớn</span>
              </div>
            </div>
            
            {/* HP and Mana Info */}
            <div className="mt-3 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <span>❤️ Thanh Máu (HP = 100):</span>
                <span className="text-slate-300 font-normal">Trúng đạn/quái trừ HP. Khi hết 100 HP mới mất 1 mạng (Rest). Nhặt vàng/1UP/trả lời đúng sẽ hồi máu!</span>
              </div>
              <div className="flex items-center gap-2 text-sky-300 font-bold">
                <span>⚡ Thanh Mana (Năng lượng = 100):</span>
                <span className="text-slate-300 font-normal">Tự động tích tụ theo thời gian, tăng mạnh khi diệt quái (+10) hoặc trả lời đúng câu hỏi (+50). Dùng để kích hoạt chiêu phím K!</span>
              </div>
            </div>

            <p className="mt-2 text-slate-400 text-xs">
              * Trên điện thoại hoặc máy tính bảng: Bàn phím ảo D-Pad, nút Bắn (J), Nhảy (W), Kỹ năng (K) và Đổi chiêu (L) hiển thị trực tiếp để bạn chạm điều khiển dễ dàng!
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <h4 className="font-retro text-xs text-purple-300 mb-2 flex items-center gap-1.5">
              <span>📚</span> 3. Tự Do Quản Lý Bộ Câu Hỏi (CRUD)
            </h4>
            <p className="text-slate-300">
              Nhấn vào nút <strong>"Quản Lý Bộ Câu Hỏi"</strong> ở thanh menu để:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-300">
              <li>Thêm mới câu hỏi bài học của riêng bạn (Toán, Lý, Hóa, Văn, Sử, Địa, Tiếng Anh...).</li>
              <li>Chỉnh sửa nội dung, đáp án và lời giải thích bất cứ lúc nào.</li>
              <li>Xóa câu hỏi không cần thiết.</li>
              <li>Xuất & Nhập tệp câu hỏi định dạng <code>.json</code> để chia sẻ cho học sinh hoặc bạn bè.</li>
              <li>Sử dụng tính năng AI để tự động tạo đề thi theo chủ đề mong muốn!</li>
            </ul>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-retro text-xs rounded-lg"
          >
            ĐÃ HIỂU, VÀO GAME
          </button>
        </div>
      </div>
    </div>
  );
};
