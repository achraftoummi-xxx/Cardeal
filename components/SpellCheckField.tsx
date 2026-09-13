"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/components/TranslationProvider";
import { checkWordSpelling } from "@/lib/spellChecker";

interface SpellCheckInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  ref?: React.Ref<HTMLInputElement>;
}

export function SpellCheckInput({ value, onChange, className = "", ...props }: SpellCheckInputProps) {
  const { locale } = useTranslation();
  const [currentVal, setCurrentVal] = useState<string>(String(value ?? ""));
  const [errors, setErrors] = useState<{ word: string; index: number; suggestions: string[] }[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch device / screen size
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 640);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentVal(String(value));
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentVal) {
        setErrors([]);
        return;
      }
      const words = currentVal.split(/(\s+)/);
      const foundErrors: { word: string; index: number; suggestions: string[] }[] = [];

      words.forEach((w, idx) => {
        if (w.trim().length > 0) {
          const res = checkWordSpelling(w, locale);
          if (!res.isCorrect && res.suggestions.length > 0) {
            foundErrors.push({ word: w, index: idx, suggestions: res.suggestions });
          }
        }
      });

      setErrors(foundErrors);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentVal, locale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVal(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const handleApplySuggestion = (errIdx: number, suggestion: string) => {
    const words = currentVal.split(/(\s+)/);
    let targetCount = 0;
    const newWords = words.map((w) => {
      if (w.trim().length > 0) {
        if (targetCount === errIdx) {
          return suggestion;
        }
        targetCount++;
      }
      return w;
    });

    const newValue = newWords.join("");
    setCurrentVal(newValue);
    setActiveDropdown(null);
    setErrors([]);

    if (onChange && containerRef.current) {
      const inputEl = containerRef.current.querySelector("input");
      if (inputEl) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        if (nativeSetter) {
          nativeSetter.call(inputEl, newValue);
          inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    }
  };

  const hasErrors = errors.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        {...props}
        value={value !== undefined ? value : currentVal}
        onChange={handleChange}
        className={`${className} ${
          hasErrors
            ? "border-amber-500/80 focus:ring-amber-500/30 underline decoration-amber-500 decoration-wavy decoration-from-font"
            : ""
        }`}
      />

      {hasErrors && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {errors.map((err, idx) => (
            <div
              key={idx}
              className="relative"
              {...(isTouchDevice
                ? {}
                : {
                    onMouseEnter: () => setActiveDropdown(idx),
                    onMouseLeave: () => setActiveDropdown(null),
                  })}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                title={`Spelling suggestion for "${err.word}"`}
              >
                !
              </button>

              {activeDropdown === idx && (
                <div className="absolute right-0 bottom-full mb-2 z-50 w-48 rounded-xl border border-zinc-700 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 max-w-[calc(100vw-2rem)] translate-x-0">
                  <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 mb-1 truncate">
                    Suggestions: {err.word}
                  </div>
                  <div className="flex flex-col gap-1">
                    {err.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleApplySuggestion(idx, sug)}
                        className="text-left px-2.5 py-1.5 text-xs font-medium text-zinc-200 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{sug}</span>
                        <span className="text-[10px] text-zinc-500 shrink-0">replace</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SpellCheckTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export function SpellCheckTextarea({ value, onChange, className = "", ...props }: SpellCheckTextareaProps) {
  const { locale } = useTranslation();
  const [currentVal, setCurrentVal] = useState<string>(String(value ?? ""));
  const [errors, setErrors] = useState<{ word: string; index: number; suggestions: string[] }[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 640);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentVal(String(value));
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentVal) {
        setErrors([]);
        return;
      }
      const words = currentVal.split(/(\s+)/);
      const foundErrors: { word: string; index: number; suggestions: string[] }[] = [];

      words.forEach((w, idx) => {
        if (w.trim().length > 0) {
          const res = checkWordSpelling(w, locale);
          if (!res.isCorrect && res.suggestions.length > 0) {
            foundErrors.push({ word: w, index: idx, suggestions: res.suggestions });
          }
        }
      });

      setErrors(foundErrors);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentVal, locale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentVal(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const handleApplySuggestion = (errIdx: number, suggestion: string) => {
    const words = currentVal.split(/(\s+)/);
    let targetCount = 0;
    const newWords = words.map((w) => {
      if (w.trim().length > 0) {
        if (targetCount === errIdx) {
          return suggestion;
        }
        targetCount++;
      }
      return w;
    });

    const newValue = newWords.join("");
    setCurrentVal(newValue);
    setActiveDropdown(null);
    setErrors([]);

    if (onChange && containerRef.current) {
      const textareaEl = containerRef.current.querySelector("textarea");
      if (textareaEl) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        if (nativeSetter) {
          nativeSetter.call(textareaEl, newValue);
          textareaEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    }
  };

  const hasErrors = errors.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <textarea
        {...props}
        value={value !== undefined ? value : currentVal}
        onChange={handleChange}
        className={`${className} ${
          hasErrors
            ? "border-amber-500/80 focus:ring-amber-500/30 underline decoration-amber-500 decoration-wavy decoration-from-font"
            : ""
        }`}
      />

      {hasErrors && (
        <div className="absolute right-3 top-3 flex items-center gap-1">
          {errors.map((err, idx) => (
            <div
              key={idx}
              className="relative"
              {...(isTouchDevice
                ? {}
                : {
                    onMouseEnter: () => setActiveDropdown(idx),
                    onMouseLeave: () => setActiveDropdown(null),
                  })}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                title={`Spelling suggestion for "${err.word}"`}
              >
                !
              </button>

              {activeDropdown === idx && (
                <div className="absolute right-0 bottom-full mb-2 z-50 w-48 rounded-xl border border-zinc-700 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 max-w-[calc(100vw-2rem)] translate-x-0">
                  <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 mb-1 truncate">
                    Suggestions: {err.word}
                  </div>
                  <div className="flex flex-col gap-1">
                    {err.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleApplySuggestion(idx, sug)}
                        className="text-left px-2.5 py-1.5 text-xs font-medium text-zinc-200 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{sug}</span>
                        <span className="text-[10px] text-zinc-500 shrink-0">replace</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
