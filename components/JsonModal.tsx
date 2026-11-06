"use client";

import React, { useState, useEffect } from "react";
import { VocabWord } from "@/types/vocabulary";
import defaultVocabulary from "@/data/vocabulary.json";
import { CrossIcon } from "./icons";

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabWord[];
  onUpdateWords: (newWords: VocabWord[]) => void;
  onResetToDefault: () => void;
}

export function JsonModal({
  isOpen,
  onClose,
  words,
  onUpdateWords,
  onResetToDefault,
}: JsonModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Clean up internal flags before showing raw json
      const cleaned = words.map(({ isLearned, isStillLearning, isBookmarked, ...rest }) => rest);
      setJsonText(JSON.stringify(cleaned, null, 2));
      setError(null);
      setCopySuccess(false);
    }
  }, [isOpen, words]);

  if (!isOpen) return null;

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of vocabulary objects.");
      }
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.word || !item.meaning) {
          throw new Error(`Item #${i + 1} must include at least "word" and "meaning".`);
        }
        if (!item.id) {
          item.id = String(i + 1);
        }
      }
      onUpdateWords(parsed);
      setError(null);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid JSON syntax.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocabulary.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-card-in">
      <div className="w-full max-w-2xl bg-[#faf7ee] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#ede5d4] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-[#e9e1d0]">
          <div>
            <h3 className="text-xl font-bold text-[#243c33]">
              JSON Vocabulary Source
            </h3>
            <p className="text-xs text-[#6e887f] mt-0.5">
              File: <code className="bg-[#eee7d6] px-1.5 py-0.5 rounded text-[#223a31]">data/vocabulary.json</code> ({words.length} items loaded)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6b857c] hover:text-[#243c33] hover:bg-[#ede5d4] transition-colors cursor-pointer"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="mt-3 p-2.5 bg-[#f5f1e5] border border-[#e4dcce] rounded-xl text-xs text-[#4b635a] leading-relaxed">
          <p>
            You can edit words below, or paste your own JSON. Only <span className="font-semibold text-[#253e34]">&quot;word&quot;</span> and <span className="font-semibold text-[#253e34]">&quot;meaning&quot;</span> are required (e.g. <span className="italic">&quot;haadha - This(M)&quot;</span>). Arabic script and examples are optional.
          </p>
        </div>

        {/* Textarea */}
        <div className="mt-3 flex-1 flex flex-col min-h-[240px]">
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            spellCheck={false}
            className="w-full flex-1 p-3.5 rounded-2xl bg-white border border-[#ded5c2] font-mono text-xs text-[#223930] focus:outline-hidden focus:ring-2 focus:ring-[#83bfae] leading-relaxed resize-y"
          />
          {error && (
            <p className="text-xs text-rose-600 font-medium mt-1.5 bg-rose-50 border border-rose-200 p-2 rounded-xl">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Modal actions */}
        <div className="flex flex-wrap items-center justify-between pt-4 gap-2 border-t border-[#e9e1d0] mt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#ede6d4] hover:bg-[#e4dcba] text-[#2c443b] transition-colors cursor-pointer"
            >
              {copySuccess ? "✓ Copied to clipboard!" : "Copy JSON"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#ede6d4] hover:bg-[#e4dcba] text-[#2c443b] transition-colors cursor-pointer"
            >
              Download JSON
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Reset current deck back to the default list (${defaultVocabulary.length} words)?`)) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="px-2.5 py-2 rounded-xl text-xs font-medium text-[#7d948b] hover:text-rose-600 transition-colors cursor-pointer"
            >
              Reset to Default
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#546e65] hover:bg-[#ede5d4] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b8c72] hover:bg-[#327a63] shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Apply JSON Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
