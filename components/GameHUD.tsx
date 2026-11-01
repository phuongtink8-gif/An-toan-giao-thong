'use client';

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Camera,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Car,
  Eye,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface GameHUDProps {
  score: number;
  stars: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  cameraMode: 'follow' | 'overview' | 'station';
  onCameraChange: (mode: 'follow' | 'overview' | 'station') => void;
  onOpenGuide: () => void;
  onRestart: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  stars,
  currentQuestionIndex,
  totalQuestions,
  cameraMode,
  onCameraChange,
  onOpenGuide,
  onRestart,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isBgmActive, setIsBgmActive] = useState(soundManager.isBgmActive());

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playClick();
  };

  const handleToggleBgm = () => {
    const active = soundManager.toggleBgm();
    setIsBgmActive(active);
    soundManager.playClick();
  };

  const handleHonk = () => {
    soundManager.playHonk();
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-transform duration-300 pointer-events-auto"
      style={{
        maxWidth: 'min(940px, 94vw)',
        transform: `translate(-50%, ${isCollapsed ? 'calc(100% - 32px)' : '0px'})`,
      }}
    >
      {/* Collapse / Expand Tab Button */}
      <div className="hidden justify-center -mb-1">
        <button
          onClick={() => {
            soundManager.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="bg-white/90 hover:bg-white text-slate-700 text-xs font-bold px-4 py-1.5 rounded-t-xl border-t border-x border-slate-300 shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-500" />
              <span>Hiện Bảng Điều Khiển</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Thu Gọn HUD</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      <div className="hidden bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-300 shadow-xl px-4 py-2.5 flex-wrap items-center justify-between gap-3 md:gap-6">
        {/* Left Cluster: Progress & Stats */}
        <div className="flex items-center gap-3">
          {/* Station Badge */}
          <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-sky-900">
              Trạm <span className="text-sm font-extrabold text-sky-600 tabular-nums">{currentQuestionIndex + 1}</span>/{totalQuestions}
            </span>
          </div>

          {/* Star Counter */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs font-extrabold text-amber-900 tabular-nums">{stars} ⭐</span>
          </div>

          {/* Score */}
          <div className="hidden sm:flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold text-emerald-900 tabular-nums">{score} đ</span>
          </div>
        </div>

        {/* Center Cluster: Camera View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              soundManager.playClick();
              onCameraChange('follow');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              cameraMode === 'follow'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Góc nhìn theo chân Bé An"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Theo Bé An</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onCameraChange('overview');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              cameraMode === 'overview'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Toàn cảnh thành phố"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Toàn Phố</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onCameraChange('station');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              cameraMode === 'station'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Quan sát biển báo cận cảnh"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cận Cảnh</span>
          </button>
        </div>

        {/* Right Cluster: Interactive Audio & Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Fun Car Honk Button */}
          <button
            onClick={handleHonk}
            title="Bấm còi Bim Bim vui nhộn!"
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 shadow-sm cursor-pointer active:scale-95 transition-transform"
          >
            <Car className="w-4 h-4" />
          </button>

          {/* Cheerful Background Music Toggle */}
          <button
            onClick={handleToggleBgm}
            title={isBgmActive ? 'Tắt nhạc nền' : 'Bật nhạc nền thiếu nhi vui tươi'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBgmActive
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Master Sound FX Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              !isMuted
                ? 'bg-sky-100 border-sky-300 text-sky-800'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Help & Guide */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenGuide();
            }}
            title="Hướng dẫn chơi & bí kíp an toàn"
            className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 shadow-sm cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
