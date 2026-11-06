"use client";

import React, { useState, useEffect } from "react";
import { VocabWord } from "@/types/vocabulary";
import { CrossIcon } from "./icons";

interface WordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (word: VocabWord) => void;
  onDelete?: (id: string | number) => void;
  initialWord?: VocabWord | null;
}

export function WordModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialWord,
}: WordModalProps) {
  const [word, setWord] = useState("");
  const [arabic, setArabic] = useState("");
  const [meaning, setMeaning] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [exampleArabic, setExampleArabic] = useState("");
  const [exampleTranslation, setExampleTranslation] = useState("");

  useEffect(() => {
    if (initialWord) {
      setWord(initialWord.word || "");
      setArabic(initialWord.arabic || "");
      setMeaning(initialWord.meaning || "");
      setPartOfSpeech(initialWord.partOfSpeech || "");
      setExampleArabic(initialWord.exampleSentence?.arabic || "");
      setExampleTranslation(initialWord.exampleSentence?.translation || "");
    } else {
      setWord("");
      setArabic("");
      setMeaning("");
      setPartOfSpeech("noun");
      setExampleArabic("");
      setExampleTranslation("");
    }
  }, [initialWord, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) {
      alert("Please provide at least the word and meaning.");
      return;
    }

    const updatedWord: VocabWord = {
      id: initialWord ? initialWord.id : Date.now().toString(),
      word: word.trim(),
      arabic: arabic.trim() || undefined,
      meaning: meaning.trim(),
      partOfSpeech: partOfSpeech.trim() || undefined,
      exampleSentence:
        exampleTranslation.trim() || exampleArabic.trim()
          ? {
              arabic: exampleArabic.trim() || undefined,
              translation: exampleTranslation.trim(),
            }
          : undefined,
      isLearned: initialWord?.isLearned,
      isStillLearning: initialWord?.isStillLearning,
      isBookmarked: initialWord?.isBookmarked,
    };

    onSave(updatedWord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-card-in">
      <div className="w-full max-w-md bg-[#faf7ee] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#ede5d4] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e9e1d0]">
          <h3 className="text-xl font-bold text-[#243c33]">
            {initialWord ? "Edit Vocabulary Word" : "Add New Vocabulary Word"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6b857c] hover:text-[#243c33] hover:bg-[#ede5d4] transition-colors"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5f7a70] mb-1.5">
              Word / Transliteration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. kitāb / kitābun or book"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded5c2] text-[#223930] placeholder-[#a6b8b1] focus:outline-hidden focus:ring-2 focus:ring-[#83bfae] text-sm"
            />
            <p className="text-[11px] text-[#7d978d] mt-1">
              Can be romanized/English (e.g. kitab / kitabun).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5f7a70] mb-1.5">
              Arabic Script <span className="text-[11px] font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              dir="rtl"
              placeholder="e.g. كِتَاب"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded5c2] text-[#223930] placeholder-[#a6b8b1] focus:outline-hidden focus:ring-2 focus:ring-[#83bfae] text-lg font-arabic font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5f7a70] mb-1.5">
                Meaning <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Book"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded5c2] text-[#223930] placeholder-[#a6b8b1] focus:outline-hidden focus:ring-2 focus:ring-[#83bfae] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5f7a70] mb-1.5">
                Part of Speech <span className="text-[11px] font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. noun, verb, adj"
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded5c2] text-[#223930] placeholder-[#a6b8b1] focus:outline-hidden focus:ring-2 focus:ring-[#83bfae] text-sm"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#ede5d4] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5f7a70] block">
              Example Sentence <span className="text-[11px] font-normal lowercase">(optional)</span>
            </span>

            <div>
              <input
                type="text"
                dir="rtl"
                placeholder="Arabic example: هَذَا كِتَابٌ جَدِيدٌ"
                value={exampleArabic}
                onChange={(e) => setExampleArabic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded5c2] text-[#223930] placeholder-[#a6b8b1] focus:outline-hidden focus:ring-2 focus:ring-[#83bfae] text-base font-arabic"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="English translation: (This is a new book)"
                value={exampleTranslation}
                onChange={(e) => setExampleTranslation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded5c2] text-[#223930] placeholder-[#a6b8b1] focus:outline-hidden focus:ring-2 focus:ring-[#83bfae] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 gap-3">
            {initialWord && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this word?")) {
                    onDelete(initialWord.id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#546e65] hover:bg-[#ede5d4] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3b8c72] hover:bg-[#327a63] shadow-md transition-all active:scale-95"
              >
                Save Word
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

