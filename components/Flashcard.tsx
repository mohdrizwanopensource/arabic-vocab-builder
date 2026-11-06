"use client";

import React, { useState } from "react";
import { VocabWord, ViewMode } from "@/types/vocabulary";
import { SpeakerIcon, BookmarkIcon, EditIcon } from "./icons";

interface FlashcardProps {
  card: VocabWord;
  viewMode: ViewMode;
  isRevealed: boolean;
  onToggleReveal: () => void;
  onToggleBookmark: (id: string | number) => void;
  onEdit: (card: VocabWord) => void;
}

export function Flashcard({
  card,
  viewMode,
  isRevealed,
  onToggleReveal,
  onToggleBookmark,
  onEdit,
}: FlashcardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    // Prefer arabic speech if arabic text is available, otherwise speak the transliterated word
    const textToSpeak = card.arabic ? card.arabic : card.word;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (card.arabic) {
      utterance.lang = "ar-SA";
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 0.85;

    setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const hasArabic = Boolean(card.arabic && card.arabic.trim().length > 0);
  const hasExample = Boolean(
    card.exampleSentence &&
      (card.exampleSentence.translation || card.exampleSentence.arabic)
  );

  return (
    <div
      onClick={viewMode === "simple" ? onToggleReveal : undefined}
      className={`w-full min-h-[420px] md:min-h-[460px] bg-[#fdfcf9] rounded-3xl p-8 sm:p-10 md:p-12 shadow-[0_16px_40px_rgba(25,50,40,0.06)] border border-[#ede7d8] flex flex-col justify-between select-none transition-all duration-300 ${
        viewMode === "simple"
          ? "cursor-pointer hover:shadow-[0_20px_48px_rgba(25,50,40,0.1)] hover:border-[#ded6c3]"
          : ""
      }`}
    >
      {/* SIMPLE VIEW */}
      {viewMode === "simple" ? (
        <div className="flex-1 flex flex-col justify-between py-4 text-center">
          {/* Top: Word presentation */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            {hasArabic ? (
              <>
                <h2
                  className="font-arabic text-5xl sm:text-6xl md:text-7xl font-bold text-[#223830] tracking-wide mb-3 leading-normal dir-rtl"
                  dir="rtl"
                >
                  {card.arabic}
                </h2>
                <p className="text-xl sm:text-2xl font-medium text-[#5a746b] tracking-wide">
                  ({card.word})
                </p>
              </>
            ) : (
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#223830] tracking-tight">
                {card.word}
              </h2>
            )}
          </div>

          {/* Reveal Section */}
          <div className="w-full pt-6">
            <div className="w-3/4 max-w-md mx-auto border-t border-[#e8e2d4] mb-6" />

            {isRevealed ? (
              <div className="animate-card-in flex flex-col items-center justify-center min-h-[110px]">
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-bold text-[#8ca39a] mb-2">
                  <span>Reveal Meaning</span>
                  <span className="text-[#a4bbb3]">&bull;</span>
                  <span>Show Answer</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#223830] tracking-tight">
                  {card.meaning}
                </h3>
                {card.partOfSpeech && (
                  <p className="text-base sm:text-lg font-medium text-[#6e877e] mt-1.5">
                    ({card.partOfSpeech})
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[110px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleReveal();
                  }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#f4efe3] hover:bg-[#ece5d4] active:scale-95 text-sm sm:text-base font-semibold text-[#486359] tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  <span>Reveal Meaning</span>
                  <span className="opacity-40">&bull;</span>
                  <span>Show Answer</span>
                </button>
                <p className="text-xs text-[#93a79f] mt-3">
                  Click card or press <kbd className="px-1.5 py-0.5 bg-[#ece5d4] rounded text-[#334b41] font-mono">Space</kbd> to reveal
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* DETAILED VIEW */
        <div className="flex-1 flex flex-col justify-between py-2">
          {/* Top: Word presentation */}
          <div className="text-center pt-2 pb-6">
            {hasArabic ? (
              <>
                <h2
                  className="font-arabic text-5xl sm:text-6xl md:text-7xl font-bold text-[#223830] tracking-wide mb-2 leading-normal dir-rtl"
                  dir="rtl"
                >
                  {card.arabic}
                </h2>
                <p className="text-xl sm:text-2xl font-medium text-[#5a746b]">
                  ({card.word})
                </p>
              </>
            ) : (
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#223830] tracking-tight py-4">
                {card.word}
              </h2>
            )}
          </div>

          {/* Detailed Content Grid: Meaning & Example */}
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            {/* Meaning Section */}
            <div className="bg-[#f7f5ed]/90 rounded-2xl p-5 sm:p-6 border border-[#eee8db]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7e968d]">
                    Meaning
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#223830] tracking-tight">
                      {card.meaning}
                    </h3>
                    {card.partOfSpeech && (
                      <span className="text-sm sm:text-base text-[#6e877e] font-medium">
                        ({card.partOfSpeech})
                      </span>
                    )}
                  </div>
                </div>

                {/* Action icons: Audio & Bookmark */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    title="Listen to pronunciation"
                    aria-label="Listen to pronunciation"
                    onClick={handlePlayAudio}
                    className="p-2.5 rounded-xl text-[#5a736a] hover:text-[#223830] hover:bg-[#eae3d2] active:scale-95 transition-all cursor-pointer"
                  >
                    <SpeakerIcon className="w-6 h-6" isPlaying={isPlayingAudio} />
                  </button>
                  <button
                    type="button"
                    title={card.isBookmarked ? "Remove bookmark" : "Bookmark this word"}
                    aria-label={card.isBookmarked ? "Remove bookmark" : "Bookmark this word"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(card.id);
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#eae3d2] active:scale-95 transition-all cursor-pointer"
                  >
                    <BookmarkIcon className="w-6 h-6" active={card.isBookmarked} />
                  </button>
                </div>
              </div>
            </div>

            {/* Example Sentence Section */}
            <div className="bg-[#f7f5ed]/90 rounded-2xl p-5 sm:p-6 border border-[#eee8db]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7e968d]">
                  Example Sentence
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(card);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#658176] hover:text-[#223830] px-2.5 py-1 rounded-lg hover:bg-[#eae3d2] transition-colors cursor-pointer"
                >
                  <span>Edit</span>
                  <EditIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {hasExample ? (
                <div className="mt-2.5 space-y-1.5">
                  {card.exampleSentence?.arabic && (
                    <p
                      className="font-arabic text-2xl sm:text-3xl font-semibold text-[#223830] text-right dir-rtl leading-relaxed"
                      dir="rtl"
                    >
                      {card.exampleSentence.arabic}
                    </p>
                  )}
                  {card.exampleSentence?.translation && (
                    <p className="text-base sm:text-lg font-medium text-[#5a746b] italic">
                      ({card.exampleSentence.translation})
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#8c9f97] italic mt-2">
                  No example sentence provided yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
