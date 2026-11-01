'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Sparkles,
  RotateCcw,
  BookOpen,
  Award,
  CheckCircle,
  Star,
  Compass,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface VictoryModalProps {
  score: number;
  totalQuestions: number;
  correctAnswersCount: number;
  stars: number;
  onRestart: () => void;
  onReviewQuestions: () => void;
  onExploreTown: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  totalQuestions,
  correctAnswersCount,
  stars,
  onRestart,
  onReviewQuestions,
  onExploreTown,
}) => {
  const accuracy = Math.round((correctAnswersCount / totalQuestions) * 100);

  useEffect(() => {
    soundManager.playVictory();
    // Celebrate with cascading confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    import('canvas-confetti').then((m) => {
      const confetti = m.default;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#facc15', '#ef4444', '#3b82f6', '#10b981'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#facc15', '#ef4444', '#3b82f6', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }).catch(() => {});
  }, []);

  // Determine badge title
  let badgeTitle = 'Hiệp Sĩ Giao Thông Nhí';
  let badgeDescription = 'Bé đã hoàn thành xuất sắc các câu hỏi an toàn giao thông!';
  if (accuracy >= 90) {
    badgeTitle = 'Đại Sứ An Toàn Giao Thông 2026';
    badgeDescription = 'Tuyệt đỉnh! Bé nắm chắc 100% quy tắc và xứng đáng là tấm gương sáng cho cả trường!';
  } else if (accuracy >= 70) {
    badgeTitle = 'Chuyên Gia Giao Thông Cừ Khôi';
    badgeDescription = 'Bé rất thông minh và hiểu rõ các tình huống an toàn đường bộ!';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto select-none"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-6 text-center text-amber-950 border-b-2 border-amber-300 relative">
          <div className="w-20 h-20 mx-auto bg-white rounded-3xl border-4 border-amber-200 shadow-xl flex items-center justify-center -mt-2 mb-3">
            <Trophy className="w-12 h-12 text-amber-500 fill-amber-400 animate-bounce" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            XUẤT SẮC VỀ ĐÍCH!
          </h2>
          <p className="text-sm font-bold text-amber-900 mt-1">
            Bé An đã an toàn đến trường Tiểu học thân yêu! 🏫
          </p>
        </div>

        {/* Stats Grid */}
        <div className="p-6 flex flex-col gap-5">
          {/* Badge Display */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Huy Hiệu Vinh Danh</span>
            </div>
            <div className="text-lg md:text-xl font-black text-amber-950">
              {badgeTitle}
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {badgeDescription}
            </p>
          </div>

          {/* Numerical Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl">
              <span className="text-xs font-bold text-sky-700 block mb-0.5">Điểm số</span>
              <span className="text-xl md:text-2xl font-black text-sky-900 tabular-nums">
                {score}
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
              <span className="text-xs font-bold text-emerald-700 block mb-0.5">Trả lời đúng</span>
              <span className="text-xl md:text-2xl font-black text-emerald-900 tabular-nums">
                {correctAnswersCount}/{totalQuestions}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
              <span className="text-xs font-bold text-amber-700 block mb-0.5">Ngôi sao</span>
              <span className="text-xl md:text-2xl font-black text-amber-900 tabular-nums flex items-center justify-center gap-1">
                {stars} <Star className="w-4 h-4 fill-amber-400 text-amber-500 inline" />
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onRestart();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Chơi Lại Từ Đầu</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onReviewQuestions();
                }}
                className="py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Xem Lại 19 Câu Hỏi</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onExploreTown();
                }}
                className="py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Khám Phá Phố 3D</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
