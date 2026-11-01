'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';

const TrafficScene3D = dynamic(
  () => import('@/components/TrafficScene3D').then((mod) => mod.TrafficScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 w-full h-full bg-sky-200 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);
import { TitleScreen } from '@/components/TitleScreen';
import { QuizCard } from '@/components/QuizCard';
import { GameHUD } from '@/components/GameHUD';
import { VictoryModal } from '@/components/VictoryModal';
import { ReviewModal } from '@/components/ReviewModal';
import { GuideModal } from '@/components/GuideModal';
import { QUESTIONS_DATA, QuestionItem } from '@/data/questions';
import { soundManager } from '@/lib/audio';

type GameState = 'title' | 'playing' | 'victory' | 'freeroam';
type GameMode = 'full' | 'signs' | 'freeroam';

export default function TrafficSafetyGamePage() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [gameMode, setGameMode] = useState<GameMode>('full');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'follow' | 'overview' | 'station'>('follow');
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Active questions set depending on mode
  const activeQuestions: QuestionItem[] = useMemo(() => {
    if (gameMode === 'signs') {
      // Questions 15 to 19 (Sign questions)
      return QUESTIONS_DATA.filter((q) => q.category === 'Biển báo giao thông');
    }
    // All 19 questions
    return QUESTIONS_DATA;
  }, [gameMode]);

  // Start game handler
  const handleStartGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setCurrentQuestionIdx(0);
    setScore(0);
    setStars(0);
    setStreak(0);
    setCorrectAnswersCount(0);
    setIsCelebrating(false);

    if (mode === 'freeroam') {
      setGameState('freeroam');
      setCameraMode('overview');
    } else {
      setGameState('playing');
      setCameraMode('follow');
      // Start gentle nursery BGM
      soundManager.startBgm();
    }
  }, []);

  // Answer selected handler
  const handleAnswerSelected = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setIsCelebrating(true);
      setStreak((prev) => prev + 1);
      const bonusMultiplier = streak >= 2 ? 2 : 1;
      const points = 100 * bonusMultiplier;
      setScore((prev) => prev + points);
      setStars((prev) => prev + (bonusMultiplier > 1 ? 2 : 1));
      setCorrectAnswersCount((prev) => prev + 1);

      // Reset celebration after 2.5s
      setTimeout(() => {
        setIsCelebrating(false);
      }, 2500);
    } else {
      setStreak(0);
      setIsCelebrating(false);
    }
  }, [streak]);

  // Next question handler
  const handleNextQuestion = useCallback(() => {
    setIsCelebrating(false);
    if (currentQuestionIdx + 1 < activeQuestions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Completed all questions!
      setGameState('victory');
      soundManager.stopBgm();
    }
  }, [currentQuestionIdx, activeQuestions.length]);

  // Restart to title
  const handleRestart = useCallback(() => {
    setGameState('title');
    setCurrentQuestionIdx(0);
    setScore(0);
    setStars(0);
    setStreak(0);
    setCorrectAnswersCount(0);
    setIsCelebrating(false);
    setCameraMode('follow');
    soundManager.stopBgm();
  }, []);

  const currentQuestion = activeQuestions[currentQuestionIdx] || activeQuestions[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sky-200 select-none">
      {/* 3D WebGL World Viewport (Always active in background, 60fps) */}
      <TrafficScene3D
        currentQuestionIndex={currentQuestionIdx}
        isCelebrating={isCelebrating}
        cameraMode={cameraMode}
      />

      {/* Screen Overlay Hierarchy */}
      <AnimatePresence mode="wait">
        {/* Title Screen State */}
        {gameState === 'title' && (
          <TitleScreen
            key="title-screen"
            onStartGame={handleStartGame}
            onOpenGuide={() => setShowGuideModal(true)}
          />
        )}

        {/* Active Quiz Card during Playing State */}
        {gameState === 'playing' && (
          <div
            key="playing-hud"
            className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-start pt-4 sm:pt-6 px-4 pb-24 overflow-y-auto"
          >
            <QuizCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionIndex={currentQuestionIdx}
              totalQuestions={activeQuestions.length}
              onAnswerSelected={handleAnswerSelected}
              onNextQuestion={handleNextQuestion}
              stars={stars}
              streak={streak}
            />
          </div>
        )}

        {/* Free Roam Exploration Mode HUD Banner */}
        {gameState === 'freeroam' && (
          <div
            key="freeroam-banner"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center gap-4 pointer-events-auto"
          >
            <span className="text-xs sm:text-sm font-extrabold text-emerald-900">
              🧭 Đang ở chế độ Khám Phá Phố 3D Tự Do
            </span>
            <button
              onClick={() => handleStartGame('full')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs cursor-pointer shadow"
            >
              Vào Thi Đố Vui
            </button>
            <button
              onClick={handleRestart}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Về Trang Chủ
            </button>
          </div>
        )}

        {/* Victory State Modal */}
        {gameState === 'victory' && (
          <VictoryModal
            key="victory-modal"
            score={score}
            totalQuestions={activeQuestions.length}
            correctAnswersCount={correctAnswersCount}
            stars={stars}
            onRestart={handleRestart}
            onReviewQuestions={() => setShowReviewModal(true)}
            onExploreTown={() => {
              setGameState('freeroam');
              setCameraMode('overview');
            }}
          />
        )}
      </AnimatePresence>

      {/* Collapsible Bottom Control Dock (Visible during Playing and Free Roam) */}
      {(gameState === 'playing' || gameState === 'freeroam') && (
        <GameHUD
          score={score}
          stars={stars}
          currentQuestionIndex={currentQuestionIdx}
          totalQuestions={activeQuestions.length}
          cameraMode={cameraMode}
          onCameraChange={setCameraMode}
          onOpenGuide={() => setShowGuideModal(true)}
          onRestart={handleRestart}
        />
      )}

      {/* Review All 19 Questions Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <ReviewModal
            key="review-modal"
            onClose={() => setShowReviewModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <GuideModal
            key="guide-modal"
            onClose={() => setShowGuideModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
