'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface TitleScreenProps {
  onStartGame: (mode: 'full' | 'signs' | 'freeroam') => void;
  onOpenGuide: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenGuide,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        soundManager.playClick();
        soundManager.playCorrect();
        onStartGame('full');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 pointer-events-none select-none">
      {/* Top Banner Tag */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-auto"
      >
        <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full border-2 border-amber-300 shadow-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs md:text-sm font-extrabold text-slate-700 tracking-wide">
            ÔN TẬP NGOẠI KHÓA AN TOÀN GIAO THÔNG TIỂU HỌC 2026
          </span>
        </div>
      </motion.div>

      {/* Center Hero Title Lockup with Bespoke Inline SVG over negative space */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.35 }}
        className="flex flex-col items-center text-center max-w-xl pointer-events-auto my-auto"
      >
        {/* Bespoke inline SVG Title Lockup */}
        <div className="w-full max-w-md filter drop-shadow-xl mb-2">
          <svg viewBox="0 0 460 110" className="w-full h-auto">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#FB923C" />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.25" />
              </filter>
            </defs>
            {/* Background pill ribbon */}
            <rect x="20" y="10" width="420" height="90" rx="30" fill="#FFFFFF" fillOpacity="0.94" stroke="#FDE047" strokeWidth="4" filter="url(#shadow)" />
            {/* Traffic road dashed line decoration */}
            <line x1="50" y1="92" x2="410" y2="92" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="14 8" strokeLinecap="round" />
            {/* Main title text */}
            <text x="230" y="52" textAnchor="middle" fill="url(#titleGrad)" stroke="url(#strokeGrad)" strokeWidth="3" fontSize="36" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
              BÉ VUI HỌC
            </text>
            <text x="230" y="84" textAnchor="middle" fill="#0284C7" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="3">
              AN TOÀN GIAO THÔNG 3D
            </text>
          </svg>
        </div>

        <p className="text-slate-700 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-sky-200 text-sm md:text-base font-semibold shadow-sm mb-6">
          🌟 Cùng Bé An đội mũ bảo hiểm và vượt qua 19 trạm thử thách đến trường!
        </p>

        {/* Primary Start CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundManager.playCorrect();
            onStartGame('full');
          }}
          className="w-full sm:w-auto min-w-[280px] py-4 px-8 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xl shadow-2xl border-4 border-white flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-7 h-7 fill-amber-950 text-amber-950" />
          <span>BẮT ĐẦU CHƠI NGAY</span>
        </motion.button>

        {/* Secondary Mode Options */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame('signs');
            }}
            className="px-4 py-2 bg-white/90 hover:bg-white text-sky-800 text-xs md:text-sm font-bold rounded-2xl border-2 border-sky-300 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Thử Thách Biển Báo (5 câu)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame('freeroam');
            }}
            className="px-4 py-2 bg-white/90 hover:bg-white text-emerald-800 text-xs md:text-sm font-bold rounded-2xl border-2 border-emerald-300 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Khám Phá Phố 3D Tự Do</span>
          </button>
        </div>
      </motion.div>

      {/* Bottom Flat Control Hint Line according to Game Craft Guidelines */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-auto flex flex-col sm:flex-row items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-300 shadow-md text-xs font-semibold text-slate-600"
      >
        <span className="font-bold text-slate-800 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Phím 1-4 hoặc A-D: Chọn đáp án
        </span>
        <span className="hidden sm:inline text-slate-300">·</span>
        <span>Phím Space / Enter: Bắt đầu & Tiếp tục</span>
        <span className="hidden sm:inline text-slate-300">·</span>
        <span>Esc: Menu</span>
      </motion.div>
    </div>
  );
};
