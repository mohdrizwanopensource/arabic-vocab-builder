"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import defaultVocabulary from "@/data/vocabulary.json";
import { VocabWord, ViewMode, FilterMode } from "@/types/vocabulary";
import { PhoneMockup as DesktopWorkspace } from "@/components/PhoneMockup";
import { WordModal } from "@/components/WordModal";
import { JsonModal } from "@/components/JsonModal";
import { PlusIcon, JsonIcon, ShuffleIcon, ResetIcon } from "@/components/icons";

const STORAGE_KEY = "arabic_vocab_builder_cards";

export default function HomePage() {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("simple");
  const [isRevealed, setIsRevealed] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [displayMode, setDisplayMode] = useState<"single" | "comparison">("single");

  // Modals
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize and load from localStorage with intelligent sync
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultList = defaultVocabulary as VocabWord[];
          const progressMap = new Map<string, { isLearned?: boolean; isStillLearning?: boolean; isBookmarked?: boolean }>();
          const customWords: VocabWord[] = [];

          const defaultWordKeys = new Set(defaultList.map((w) => (w.word || "").toLowerCase().trim()));

          for (const item of parsed) {
            const key = (item.word || "").toLowerCase().trim();
            if (defaultWordKeys.has(key)) {
              progressMap.set(key, {
                isLearned: item.isLearned,
                isStillLearning: item.isStillLearning,
                isBookmarked: item.isBookmarked,
              });
            } else {
              // Custom user-added card in UI
              customWords.push(item);
            }
          }

          // Apply saved progress to default vocabulary
          const merged: VocabWord[] = defaultList.map((w) => {
            const key = (w.word || "").toLowerCase().trim();
            const progress = progressMap.get(key);
            if (progress) {
              return {
                ...w,
                isLearned: !!progress.isLearned,
                isStillLearning: !!progress.isStillLearning,
                isBookmarked: !!progress.isBookmarked,
              };
            }
            return w;
          });

          setWords([...merged, ...customWords]);
          setIsHydrated(true);
          return;
        }
      }
    } catch {
      // Fallback to default
    }
    // Default to the full vocabulary list
    setWords(defaultVocabulary as VocabWord[]);
    setIsHydrated(true);
  }, []);

  // Save to localStorage when words change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [words, isHydrated]);

  // Filtered list
  const filteredWords = useMemo(() => {
    switch (filterMode) {
      case "learning":
        return words.filter((w) => w.isStillLearning && !w.isLearned);
      case "known":
        return words.filter((w) => w.isLearned);
      case "bookmarked":
        return words.filter((w) => w.isBookmarked);
      case "all":
      default:
        return words;
    }
  }, [words, filterMode]);

  // Ensure current index is within bounds
  useEffect(() => {
    if (currentIndex >= filteredWords.length && filteredWords.length > 0) {
      setCurrentIndex(0);
      setIsRevealed(false);
    }
  }, [filteredWords.length, currentIndex]);

  const currentCard = filteredWords[currentIndex] || filteredWords[0] || null;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (filteredWords.length === 0) return;
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  }, [filteredWords.length]);

  const handlePrevious = useCallback(() => {
    if (filteredWords.length === 0) return;
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  }, [filteredWords.length]);

  const handleToggleReveal = useCallback(() => {
    setIsRevealed((prev) => !prev);
  }, []);

  const handleToggleBookmark = useCallback((id: string | number) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isBookmarked: !w.isBookmarked } : w))
    );
  }, []);

  const handleMarkStatus = useCallback(
    (status: "learning" | "known") => {
      if (!currentCard) return;
      setWords((prev) =>
        prev.map((w) => {
          if (w.id === currentCard.id) {
            return status === "known"
              ? { ...w, isLearned: true, isStillLearning: false }
              : { ...w, isStillLearning: true, isLearned: false };
          }
          return w;
        })
      );
      // Auto-advance to next card after rating
      setTimeout(() => {
        handleNext();
      }, 150);
    },
    [currentCard, handleNext]
  );

  // Shuffle deck
  const handleShuffle = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  // Reset progress stats
  const handleResetProgress = () => {
    if (confirm("Reset study progress (clears 'Still learning' and 'I know this' markers)?")) {
      setWords((prev) =>
        prev.map((w) => ({
          ...w,
          isLearned: false,
          isStillLearning: false,
        }))
      );
      setCurrentIndex(0);
      setIsRevealed(false);
    }
  };

  // Reset words to initial default JSON
  const handleResetToDefault = () => {
    setWords(defaultVocabulary as VocabWord[]);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  // Save / Update Word from modal
  const handleSaveWord = (savedWord: VocabWord) => {
    setWords((prev) => {
      const exists = prev.some((w) => w.id === savedWord.id);
      if (exists) {
        return prev.map((w) => (w.id === savedWord.id ? savedWord : w));
      }
      return [savedWord, ...prev];
    });
  };

  // Delete word
  const handleDeleteWord = (id: string | number) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if modal or input is active
      if (
        isWordModalOpen ||
        isJsonModalOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.tagName === "INPUT" ||
        (e.target as HTMLElement)?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleToggleReveal();
      } else if (e.key === "1") {
        e.preventDefault();
        handleMarkStatus("learning");
      } else if (e.key === "2") {
        e.preventDefault();
        handleMarkStatus("known");
      } else if (e.key.toLowerCase() === "s") {
        setViewMode("simple");
      } else if (e.key.toLowerCase() === "d") {
        setViewMode("detailed");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleNext,
    handlePrevious,
    handleToggleReveal,
    handleMarkStatus,
    isWordModalOpen,
    isJsonModalOpen,
  ]);

  // Counts for statistics
  const learnedCount = words.filter((w) => w.isLearned).length;
  const learningCount = words.filter((w) => w.isStillLearning && !w.isLearned).length;
  const bookmarkedCount = words.filter((w) => w.isBookmarked).length;

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-[#243932] px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex flex-col justify-between relative selection:bg-[#c2e4db]">
      {/* Background aesthetic pastel sparkles */}
      <div className="absolute top-10 left-12 text-[#d8cfbe] text-2xl select-none pointer-events-none opacity-40">
        ✦
      </div>
      <div className="absolute bottom-16 right-16 text-[#d8cfbe] text-4xl select-none pointer-events-none opacity-50">
        ✦
      </div>
      <div className="absolute top-1/2 right-10 text-[#d8cfbe] text-xl select-none pointer-events-none opacity-30">
        ✦
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center z-10">
        {/* Top Desktop App Navigation Header */}
        <header className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-[#e2dac8]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌿</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#223930]">
                Arabic Vocab Builder
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#d6eee6] text-[#285748] border border-[#b2e2d4]">
                Flashcards
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5f7870] mt-0.5">
              Clean pastel desktop flashcards &mdash; toggle seamlessly between Simple View &amp; Detailed View
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              title="Shuffle deck"
              className="px-3.5 py-2 rounded-xl bg-[#faf7ee] hover:bg-[#f1ebd9] active:scale-95 text-xs font-semibold text-[#2c453b] border border-[#ded5c3] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShuffleIcon className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              type="button"
              onClick={handleResetProgress}
              title="Reset progress stats"
              className="px-3.5 py-2 rounded-xl bg-[#faf7ee] hover:bg-[#f1ebd9] active:scale-95 text-xs font-semibold text-[#2c453b] border border-[#ded5c3] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ResetIcon className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingWord(null);
                setIsWordModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#3f9378] hover:bg-[#348369] active:scale-95 text-xs font-semibold text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Word</span>
            </button>

            <button
              type="button"
              onClick={() => setIsJsonModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#faf7ee] hover:bg-[#f1ebd9] active:scale-95 text-xs font-semibold text-[#2c453b] border border-[#ded5c3] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <JsonIcon className="w-3.5 h-3.5" />
              <span>JSON Source</span>
            </button>
          </div>
        </header>

        {/* Desktop Controls Bar: Layout Mode & Deck Filters */}
        <div className="w-full bg-[#efebe0]/80 backdrop-blur-xs border border-[#e2d9c7] rounded-2xl p-3 sm:p-4 mb-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Deck Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#6d857d] font-semibold mr-1">Filter:</span>
              {(["all", "learning", "known", "bookmarked"] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setFilterMode(mode);
                    setCurrentIndex(0);
                    setIsRevealed(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterMode === mode
                      ? "bg-[#28433a] text-white shadow-xs"
                      : "text-[#587369] hover:bg-[#e4ddcb]"
                  }`}
                >
                  {mode === "all" && `All (${words.length})`}
                  {mode === "learning" && `Still Learning (${learningCount})`}
                  {mode === "known" && `Known (${learnedCount})`}
                  {mode === "bookmarked" && `Bookmarked (${bookmarkedCount})`}
                </button>
              ))}
            </div>

          {/* Display Mode Switcher (Single vs Side-by-Side Comparison) */}
          <div className="flex items-center gap-3">
            <div className="bg-[#e2dac8] p-1 rounded-xl flex items-center">
              <button
                type="button"
                onClick={() => setDisplayMode("single")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  displayMode === "single"
                    ? "bg-[#faf7ee] text-[#223930] shadow-xs"
                    : "text-[#587369] hover:text-[#223930]"
                }`}
              >
                Single Card View
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode("comparison")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  displayMode === "comparison"
                    ? "bg-[#faf7ee] text-[#223930] shadow-xs"
                    : "text-[#587369] hover:text-[#223930]"
                }`}
              >
                Side-by-Side Comparison
              </button>
            </div>
          </div>
        </div>

        {/* Empty Filter State */}
        {filteredWords.length === 0 ? (
          <div className="bg-[#faf7ee] rounded-3xl p-10 border border-[#e2d8c5] text-center max-w-lg my-16 shadow-sm">
            <p className="text-lg font-bold text-[#223830] mb-2">
              No words match this filter.
            </p>
            <p className="text-sm text-[#6e887f] mb-6 leading-relaxed">
              {filterMode === "bookmarked"
                ? "You haven't bookmarked any words yet. Switch to Detailed View and click the bookmark ribbon icon."
                : filterMode === "learning"
                ? "No words currently marked as 'Still learning'."
                : "No words marked as known yet."}
            </p>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className="px-5 py-2.5 rounded-xl bg-[#3f9378] text-white text-xs sm:text-sm font-semibold hover:bg-[#348369] transition-colors cursor-pointer"
            >
              Show All Words
            </button>
          </div>
        ) : (
          /* Main Card Desktop Workspace */
          <div className="w-full flex justify-center">
            {displayMode === "single" ? (
              /* Single Desktop Flashcard Workspace */
              <DesktopWorkspace
                card={currentCard}
                currentIndex={currentIndex}
                totalCards={filteredWords.length}
                viewMode={viewMode}
                onViewModeChange={(mode) => setViewMode(mode)}
                isRevealed={isRevealed}
                onToggleReveal={handleToggleReveal}
                onToggleBookmark={handleToggleBookmark}
                onMarkStatus={handleMarkStatus}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onEdit={(c) => {
                  setEditingWord(c);
                  setIsWordModalOpen(true);
                }}
              />
            ) : (
              /* Side-by-Side Comparison Desktop View */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Simple View Desktop Workspace */}
                <DesktopWorkspace
                  titleBadge="Simple View"
                  card={currentCard}
                  currentIndex={currentIndex}
                  totalCards={filteredWords.length}
                  viewMode="simple"
                  onViewModeChange={() => {}}
                  isRevealed={isRevealed}
                  onToggleReveal={handleToggleReveal}
                  onToggleBookmark={handleToggleBookmark}
                  onMarkStatus={handleMarkStatus}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onEdit={(c) => {
                    setEditingWord(c);
                    setIsWordModalOpen(true);
                  }}
                />

                {/* Detailed View Desktop Workspace */}
                <DesktopWorkspace
                  titleBadge="Detailed View"
                  card={currentCard}
                  currentIndex={currentIndex}
                  totalCards={filteredWords.length}
                  viewMode="detailed"
                  onViewModeChange={() => {}}
                  isRevealed={isRevealed}
                  onToggleReveal={handleToggleReveal}
                  onToggleBookmark={handleToggleBookmark}
                  onMarkStatus={handleMarkStatus}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onEdit={(c) => {
                    setEditingWord(c);
                    setIsWordModalOpen(true);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Keyboard Shortcuts Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-[#718c81] bg-[#ece7da]/70 px-6 py-2.5 rounded-full border border-[#ded5c2]">
          <span className="font-semibold text-[#324a41]">Shortcuts:</span>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-[#fcfbf7] px-2 py-0.5 rounded border border-[#d6cdba] text-[#223930] font-mono shadow-2xs">Space</kbd>
            <span>reveal</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-[#fcfbf7] px-2 py-0.5 rounded border border-[#d6cdba] text-[#223930] font-mono shadow-2xs">&larr; / &rarr;</kbd>
            <span>prev / next</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-[#fcfbf7] px-2 py-0.5 rounded border border-[#d6cdba] text-[#223930] font-mono shadow-2xs">1</kbd>
            <span>still learning</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-[#fcfbf7] px-2 py-0.5 rounded border border-[#d6cdba] text-[#223930] font-mono shadow-2xs">2</kbd>
            <span>know this</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-[#fcfbf7] px-2 py-0.5 rounded border border-[#d6cdba] text-[#223930] font-mono shadow-2xs">S / D</kbd>
            <span>simple / detailed</span>
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-xs text-[#7d968d]">
        <p>
          Source data loaded from{" "}
          <button
            type="button"
            onClick={() => setIsJsonModalOpen(true)}
            className="font-mono text-[#243f36] underline hover:text-emerald-800 cursor-pointer"
          >
            data/vocabulary.json
          </button>
          {" "}({words.length} words). Word and meaning are all you need to start.
        </p>
      </footer>

      {/* Word Edit / Add Modal */}
      <WordModal
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        onSave={handleSaveWord}
        onDelete={handleDeleteWord}
        initialWord={editingWord}
      />

      {/* JSON Viewer / Editor Modal */}
      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        words={words}
        onUpdateWords={(newWords) => {
          setWords(newWords);
          setCurrentIndex(0);
          setIsRevealed(false);
        }}
        onResetToDefault={handleResetToDefault}
      />
    </main>
  );
}
