'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, BookOpen, ShieldAlert, Lightbulb } from 'lucide-react';
import { QUESTIONS_DATA, QuestionItem } from '@/data/questions';
import { TrafficSignSvg } from '@/components/TrafficSignSvg';
import { soundManager } from '@/lib/audio';

interface ReviewModalProps {
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ onClose }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'Tất cả (19 câu)' },
    { key: 'Biển báo giao thông', label: 'Biển báo (Câu 15-19)' },
    { key: 'Quy tắc qua đường', label: 'Qua đường' },
    { key: 'An toàn đi bộ & xe máy', label: 'Đi bộ & Xe máy' },
    { key: 'Đèn tín hiệu & Ưu tiên', label: 'Đèn tín hiệu' },
    { key: 'Quy định xe đạp', label: 'Đi xe đạp' },
  ];

  const filteredQuestions =
    filterCategory === 'all'
      ? QUESTIONS_DATA
      : QUESTIONS_DATA.filter((q) => q.category === filterCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm pointer-events-auto select-none"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-4 border-sky-400 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 md:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-yellow-300" />
            <div>
              <h2 className="text-lg md:text-xl font-black">
                ÔN TẬP BỘ 19 CÂU HỎI AN TOÀN GIAO THÔNG
              </h2>
              <p className="text-xs text-sky-100 font-medium">
                Tài liệu chuẩn kiến thức ngoại khóa dành cho học sinh tiểu học
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                soundManager.playClick();
                setFilterCategory(cat.key);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat.key
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border-2 border-slate-200 p-4 md:p-5 hover:border-sky-300 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">
                    {q.id}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {q.category}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-800 mb-3">
                {q.question}
              </h3>

              {/* Traffic sign illustration if question has one */}
              {q.signType && (
                <div className="my-3 flex items-center justify-center p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                  <TrafficSignSvg signType={q.signType} size={110} showStand={true} />
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {q.options.map((opt) => {
                  const isCorrect = opt.key === q.correctKey;
                  return (
                    <div
                      key={opt.key}
                      className={`p-2.5 rounded-xl border text-xs md:text-sm flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md font-extrabold flex items-center justify-center text-xs flex-shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs md:text-sm text-amber-950 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Giải thích: </span>
                  <span>{q.explanation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl cursor-pointer"
          >
            Đóng bảng ôn tập
          </button>
        </div>
      </div>
    </motion.div>
  );
};
