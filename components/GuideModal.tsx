'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Gamepad2, Volume2, Sparkles, Shield, Heart } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto select-none"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-5 text-amber-950 flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-amber-900" />
            <h2 className="text-xl font-black">HƯỚNG DẪN BÉ THAM GIA</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-950 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Item 1: How to play */}
          <div className="flex items-start gap-3 p-3.5 bg-sky-50 rounded-2xl border border-sky-200">
            <span className="w-8 h-8 rounded-full bg-sky-500 text-white font-black flex items-center justify-center text-sm flex-shrink-0">
              1
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Hành trình 19 trạm an toàn</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Đồng hành cùng Bé An qua 19 trạm thử thách dọc con đường đến trường Tiểu học. Mỗi trạm là một câu hỏi thực tế quan trọng!
              </p>
            </div>
          </div>

          {/* Item 2: Controls */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm flex-shrink-0">
              2
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Thao tác siêu dễ</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Chạm vào màn hình hoặc bấm phím <strong>1, 2, 3, 4</strong> (hoặc <strong>A, B, C, D</strong>) trên bàn phím. Bấm <strong>Space / Enter</strong> để đi tiếp trạm mới.
              </p>
            </div>
          </div>

          {/* Item 3: Voice reader */}
          <div className="flex items-start gap-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-sm flex-shrink-0">
              3
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Cô giáo đọc to câu hỏi</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Bấm vào nút <strong>🔊 Đọc</strong> ở góc trên bên phải để nghe giọng đọc câu hỏi và các phương án nếu bé chưa kịp đọc chữ!
              </p>
            </div>
          </div>

          {/* Item 4: Badges */}
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 rounded-2xl border border-rose-200">
            <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-sm flex-shrink-0">
              4
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Sưu tầm Ngôi sao & Huy hiệu</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Trả lời đúng để nhận Ngôi sao vàng ⭐ và chuỗi combo điểm số cao để nhận danh hiệu <strong>Đại Sứ An Toàn Giao Thông 2026</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-sm rounded-2xl cursor-pointer shadow-md"
          >
            ĐÃ HIỂU - SẴN SÀNG CHƠI! 🚀
          </button>
        </div>
      </div>
    </motion.div>
  );
};
