'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  Award,
  Clock,
} from 'lucide-react';
import { QuestionItem } from '@/data/questions';
import { TrafficSignSvg } from '@/components/TrafficSignSvg';
import { soundManager } from '@/lib/audio';

interface QuizCardProps {
  question: QuestionItem;
  questionIndex: number;
  totalQuestions: number;
  onAnswerSelected: (isCorrect: boolean, selectedKey: 'A' | 'B' | 'C' | 'D') => void;
  onNextQuestion: () => void;
  stars: number;
  streak: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswerSelected,
  onNextQuestion,
  stars,
  streak,
}) => {
  const [selectedKey, setSelectedKey] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers and voice on unmount
  useEffect(() => {
    return () => {
      soundManager.stopSpeaking();
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Handle TTS reading
  const handleToggleSpeak = useCallback(() => {
    if (isSpeaking) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${question.question}. Các lựa chọn là: ${question.options
        .map((opt) => `${opt.key}: ${opt.text}`)
        .join('. ')}`;
      soundManager.speakText(textToRead);
    }
  }, [isSpeaking, question]);

  // Advance to next question immediately
  const handleProceedNext = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    soundManager.playClick();
    onNextQuestion();
  }, [onNextQuestion]);

  // Handle answer selection
  const handleSelectAnswer = useCallback(
    (key: 'A' | 'B' | 'C' | 'D') => {
      if (isAnswered) return;

      soundManager.stopSpeaking();
      setIsSpeaking(false);
      setSelectedKey(key);
      setIsAnswered(true);

      const isCorrect = key === question.correctKey;
      if (isCorrect) {
        soundManager.playCorrect();
        soundManager.playStar();
        try {
          import('canvas-confetti').then((m) => {
            const confetti = m.default;
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#facc15', '#22c55e', '#38bdf8', '#f43f5e'],
            });
          }).catch(() => {});
        } catch {
          // Safe fallback
        }
      } else {
        soundManager.playIncorrect();
      }

      onAnswerSelected(isCorrect, key);

      // Auto-advance configuration:
      // Correct answer: 2.2 seconds (fun celebration, quick reading)
      // Incorrect answer: 3.8 seconds (time to absorb the correct explanation)
      const durationMs = isCorrect ? 2200 : 3800;
      const initialSeconds = isCorrect ? 2 : 4;
      setCountdownSeconds(initialSeconds);

      const startTime = Date.now();
      countdownIntervalRef.current = setInterval(() => {
        const elapsedSec = (Date.now() - startTime) / 1000;
        const remaining = Math.max(1, Math.ceil(initialSeconds - elapsedSec));
        setCountdownSeconds(remaining);
      }, 250);

      autoAdvanceTimerRef.current = setTimeout(() => {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        onNextQuestion();
      }, durationMs);
    },
    [isAnswered, question.correctKey, onAnswerSelected, onNextQuestion]
  );

  // Keyboard shortcut support (1-4 or A-D, Space to continue)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAnswered) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') handleSelectAnswer('A');
        else if (e.key === '2' || e.key.toLowerCase() === 'b') handleSelectAnswer('B');
        else if (e.key === '3' || e.key.toLowerCase() === 'c') handleSelectAnswer('C');
        else if (e.key === '4' || e.key.toLowerCase() === 'd') handleSelectAnswer('D');
      } else {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleProceedNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleSelectAnswer, handleProceedNext]);

  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col pointer-events-auto"
    >
      {/* Top Header Strip */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-5 py-3 border-b-2 border-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white/90 text-amber-900 font-extrabold text-sm rounded-full shadow-sm">
            {question.checkpointTitle}
          </span>
          <span className="text-xs font-bold text-amber-950/80 bg-amber-200/70 px-2.5 py-1 rounded-full">
            {question.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="flex items-center gap-1 text-xs font-black text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300 animate-bounce">
              🔥 Combo x{streak}!
            </span>
          )}
          <div className="flex items-center gap-1.5 font-black text-amber-900 text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
            <span>{stars} ⭐</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2">
        <div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-300 rounded-r-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="p-5 md:p-6 flex flex-col gap-4">
        {/* Question Title & TTS voice button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 text-white font-black flex items-center justify-center text-sm shadow">
              {questionIndex + 1}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
              {question.question}
            </h2>
          </div>

          <button
            onClick={handleToggleSpeak}
            title={isSpeaking ? 'Dừng đọc' : 'Nghe cô đọc câu hỏi'}
            className={`flex-shrink-0 p-2.5 rounded-2xl border-2 transition-all shadow-sm flex items-center gap-1 text-xs font-bold ${
              isSpeaking
                ? 'bg-rose-100 border-rose-400 text-rose-700 animate-pulse'
                : 'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Dừng' : 'Đọc'}</span>
          </button>
        </div>

        {/* 3D Traffic Sign Illustration if applicable */}
        {question.signType && (
          <div className="flex flex-col items-center justify-center py-2 bg-gradient-to-b from-sky-50 to-blue-50/50 rounded-2xl border-2 border-dashed border-sky-200">
            <span className="text-xs font-bold text-sky-600 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Biển báo trong câu hỏi:
            </span>
            <TrafficSignSvg signType={question.signType} size={130} showStand={true} />
          </div>
        )}

        {/* Options List */}
        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((option) => {
            const isSelected = selectedKey === option.key;
            const isCorrectOption = option.key === question.correctKey;

            let buttonStyle = 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-slate-700';

            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400 shadow-md';
              } else if (isSelected && !isCorrectOption) {
                buttonStyle = 'bg-rose-50 border-rose-400 text-rose-800 opacity-90 line-through';
              } else {
                buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option.key}
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(option.key)}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 relative cursor-pointer disabled:cursor-default font-medium ${buttonStyle}`}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center border ${
                    isAnswered && isCorrectOption
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : isAnswered && isSelected && !isCorrectOption
                      ? 'bg-rose-500 border-rose-600 text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  {option.key}
                </span>

                <span className="text-sm md:text-base flex-1 pt-0.5 leading-snug">
                  {option.text}
                </span>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 animate-bounce" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Station CTA with Auto-Advance */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-3 pt-2"
            >
              {/* Explanation Box */}
              <div
                className={`p-4 rounded-2xl border-2 ${
                  selectedKey === question.correctKey
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-sm mb-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>
                    {selectedKey === question.correctKey ? '🎉 Bé giỏi quá! Giải thích:' : '💡 Bé ghi nhớ nhé:'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed font-normal">{question.explanation}</p>
                <div className="mt-2 text-xs font-semibold text-slate-500 bg-white/70 p-2 rounded-xl flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>Mẹo an toàn: {question.funFact}</span>
                </div>
              </div>

              {/* Next Button with Auto-Advance Countdown */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleProceedNext}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>
                    {questionIndex + 1 >= totalQuestions
                      ? 'Xem Huy Hiệu Chiến Thắng! 🏆'
                      : `Sang Trạm Kế Tiếp`}
                  </span>
                  {countdownSeconds !== null && (
                    <span className="bg-white/25 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {countdownSeconds}s
                    </span>
                  )}
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-xs text-slate-400 font-medium">
                  ⚡ Tự động chuyển câu sau {countdownSeconds ?? 2} giây · Bấm nút hoặc nhấn Space để đi ngay
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
