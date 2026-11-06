"use client";

import React from "react";
import { VocabWord, ViewMode } from "@/types/vocabulary";
import { Flashcard } from "./Flashcard";
import { CheckIcon, CrossIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface DesktopWorkspaceProps {
  card: VocabWord;
  currentIndex: number;
  totalCards: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isRevealed: boolean;
  onToggleReveal: () => void;
  onToggleBookmark: (id: string | number) => void;
  onMarkStatus: (status: "learning" | "known") => void;
  onPrevious: () => void;
  onNext: () => void;
  onEdit: (card: VocabWord) => void;
  titleBadge?: string;
}

export function PhoneMockup({
  card,
  currentIndex,
  totalCards,
  viewMode,
  onViewModeChange,
  isRevealed,
  onToggleReveal,
  onToggleBookmark,
  onMarkStatus,
  onPrevious,
  onNext,
  onEdit,
  titleBadge,
}: DesktopWorkspaceProps) {
  const progressPercent = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title Badge if in comparison view */}
      {titleBadge && (
        <div className="mb-4 text-center">
          <span className="text-sm font-bold text-[#234237] tracking-wider uppercase bg-[#d9f0e8] border border-[#a8dfd3] px-5 py-2 rounded-full shadow-xs">
            {titleBadge}
          </span>
        </div>
      )}

      {/* Clean Full-Width Desktop Workspace Container */}
      <div className="w-full bg-[#bde5db] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_12px_36px_rgba(25,55,44,0.08)] border border-[#a2dfd1] flex flex-col justify-between transition-all duration-300">
        {/* Top Header Bar: View Mode Switcher + Progress Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-[#a8dec0]/40">
          {/* Segmented View Mode Switcher */}
          <div className="bg-[#a2d8cb] p-1.5 rounded-full flex items-center shadow-inner self-start">
            <button
              type="button"
              onClick={() => onViewModeChange("simple")}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                viewMode === "simple"
                  ? "bg-[#faf7ee] text-[#223931] shadow-xs scale-100"
                  : "text-[#3f5f54] hover:text-[#223931]"
              }`}
            >
              Simple View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("detailed")}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                viewMode === "detailed"
                  ? "bg-[#faf7ee] text-[#223931] shadow-xs scale-100"
                  : "text-[#3f5f54] hover:text-[#223931]"
              }`}
            >
              Detailed View
            </button>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-3.5 self-end sm:self-auto">
            <span className="text-xs sm:text-sm font-bold text-[#24453b] tracking-tight">
              {totalCards > 0 ? `Card ${currentIndex + 1} of ${totalCards}` : "0 / 0"}
            </span>
            <div className="w-28 sm:w-44 h-2 bg-[#95cdbf] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-[#1e4236] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Flashcard Component */}
        <div className="w-full my-2">
          <Flashcard
            card={card}
            viewMode={viewMode}
            isRevealed={isRevealed}
            onToggleReveal={onToggleReveal}
            onToggleBookmark={onToggleBookmark}
            onEdit={onEdit}
          />
        </div>

        {/* Bottom Desktop Actions & Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-[#a8dec0]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Study Feedback Ratings */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onMarkStatus("learning")}
              className={`flex-1 sm:flex-none py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-[0_4px_14px_rgba(223,103,99,0.28)] cursor-pointer ${
                card.isStillLearning
                  ? "bg-[#cb4f4b] text-white ring-2 ring-white/60"
                  : "bg-[#df6763] hover:bg-[#d45955] text-white"
              }`}
            >
              <span>Still learning</span>
              <CrossIcon className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => onMarkStatus("known")}
              className={`flex-1 sm:flex-none py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-[0_4px_14px_rgba(63,147,120,0.28)] cursor-pointer ${
                card.isLearned
                  ? "bg-[#2b775e] text-white ring-2 ring-white/60"
                  : "bg-[#3f9378] hover:bg-[#348369] text-white"
              }`}
            >
              <span>I know this</span>
              <CheckIcon className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onPrevious}
              className="flex-1 sm:flex-none py-3 px-6 rounded-full bg-[#faf7ee] hover:bg-[#f1ebd9] active:scale-95 text-xs sm:text-sm font-semibold text-[#274037] flex items-center justify-center gap-2 border border-[#ded8c9] shadow-xs transition-all cursor-pointer"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              className="flex-1 sm:flex-none py-3 px-6 rounded-full bg-[#faf7ee] hover:bg-[#f1ebd9] active:scale-95 text-xs sm:text-sm font-semibold text-[#274037] flex items-center justify-center gap-2 border border-[#ded8c9] shadow-xs transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export as FlashcardWorkspace as well
export { PhoneMockup as FlashcardWorkspace };
