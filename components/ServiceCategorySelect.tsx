"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { localized } from "@/lib/i18n";
import {
  SERVICE_CATEGORY_GROUPS,
  searchServiceCategories,
  type ServiceCategoryGroup,
} from "@/data/serviceCategories";
import { getServiceCategoryIcon } from "@/data/serviceCategoryIcons";

/** Browse mode starts with every main category collapsed: clicking a
 *  category header expands its sub-categories (accordion behavior). */
const ALL_COLLAPSED: Set<string> = new Set(
  SERVICE_CATEGORY_GROUPS.map((g) => g.category)
);

type Position = { top: number; left: number; width: number };

type Props = {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Commit free-typed values on blur (search experience). */
  allowCustom?: boolean;
  required?: boolean;
};

/**
 * Searchable two-level category picker.
 * Renders the category hierarchy as an accordion (main categories first,
 * click a header to reveal its nested sub-categories) and filters both levels
 * as the user types. The dropdown is rendered through a portal with fixed
 * positioning so it always floats above adjacent content (map, cards, modals).
 * The committed value is always a sub-category (canonical string), unless
 * `allowCustom` is enabled.
 */
export default function ServiceCategorySelect({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  allowCustom = false,
  required = false,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set(ALL_COLLAPSED));
  const [position, setPosition] = useState<Position | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const groups: ServiceCategoryGroup[] = useMemo(
    () => searchServiceCategories(query),
    [query]
  );

  const totalMatches = useMemo(
    () => groups.reduce((acc, g) => acc + g.subCategories.length, 0),
    [groups]
  );

  /* Anchor the dropdown to the input: fixed coordinates in the viewport
     keep it floating above every adjacent component and free it from any
     parent overflow/stacking-context clipping. */
  const updatePosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  const openDropdown = useCallback(() => {
    updatePosition();
    setOpen(true);
  }, [updatePosition]);

  /* Reposition on scroll/resize while the dropdown is open. */
  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  /* Focus: surface the current value in the input, open the list showing
     only the main categories, then expand the group of the selected value. */
  const handleFocus = () => {
    setQuery(value);
    openDropdown();
    const next = new Set(ALL_COLLAPSED);
    if (value) {
      const group = SERVICE_CATEGORY_GROUPS.find((g) =>
        g.subCategories.includes(value)
      );
      if (group) next.delete(group.category);
    }
    setCollapsed(next);
  };

  const handleChange = (v: string) => {
    setQuery(v);
    openDropdown();
  };

  /* Clear: instantly reset both the typed text and the committed
     category, then keep the list open so a new category can be
     picked with a single click. */
  const handleClear = () => {
    setQuery("");
    onChange("");
    openDropdown();
    inputRef.current?.focus();
  };

  /* Blur: commit a free-typed value when custom values are allowed,
     otherwise fall back to the committed value. */
  const handleBlur = () => {
    const q = query.trim();
    if (allowCustom && q && q !== value) onChange(q);
    setOpen(false);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setQuery("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
  };

  const toggleGroup = (category: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  /* While searching, matched groups are always shown expanded so
     results stay visible; the manual collapse state only applies
     to the unfiltered browse mode. */
  const searching = query.trim().length > 0;
  const isExpanded = (group: ServiceCategoryGroup) =>
    searching || !collapsed.has(group.category);

  return (
    <div>
      {label && (
        <label
          htmlFor={id ?? "service-category-select"}
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
        >
          {label}
        </label>
      )}
      <div ref={anchorRef} className="relative">
        <input
          ref={inputRef}
          id={id ?? "service-category-select"}
          name={name ?? "serviceCategory"}
          role="combobox"
          aria-expanded={open}
          aria-controls="service-category-options"
          aria-autocomplete="list"
          autoComplete="off"
          required={required}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 max-sm:min-h-12 placeholder:text-muted-foreground/50"
          value={open ? query : value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? t("search.servicePlaceholder")}
        />
        {query || value ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 transition-colors hover:text-zinc-300"
            aria-label={t("search.clearServiceCategory")}
          >
            <X size={18} />
          </button>
        ) : (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown size={18} className="text-zinc-500" />
          </div>
        )}
        {open &&
          position &&
          createPortal(
            <ul
              id="service-category-options"
              role="listbox"
              aria-multiselectable={false}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
              }}
              className="fixed z-[9999] max-h-72 overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-2xl shadow-black/20 dark:shadow-black/60"
            >
              {groups.map((group) => (
                <li key={group.category} role="presentation" className="px-1">
                  <button
                    type="button"
                    aria-expanded={isExpanded(group)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => toggleGroup(group.category)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 transition-colors hover:bg-[var(--cardeal-primary)] hover:text-white"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2.5">
                      <img
                        src={getServiceCategoryIcon(group.category)}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className="h-5 w-5 shrink-0 object-contain"
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {localized(t, "serviceCat", group.category)}
                      </span>
                    </span>
                    <ChevronDown
                      size={15}
                      className={`shrink-0 transition-transform duration-200 ${isExpanded(group) ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isExpanded(group) && (
                    <ul role="group" aria-label={localized(t, "serviceCat", group.category)}>
                      {group.subCategories.map((option) => (
                        <li
                          key={option}
                          role="option"
                          aria-selected={option === value}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelect(option)}
                          className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 pl-5 pr-3 text-[15px] text-foreground transition-colors hover:bg-[var(--cardeal-primary)] hover:text-white"
                        >
                          <span className="flex min-w-0 flex-1 items-center gap-2">
                            <img
                              src={getServiceCategoryIcon(option)}
                              alt=""
                              aria-hidden="true"
                              draggable={false}
                              className="h-5 w-5 shrink-0 object-contain"
                            />
                            <span className="min-w-0 flex-1">{localized(t, "serviceCat", option)}</span>
                          </span>
                          {option === value && <Check size={16} className="shrink-0 text-[var(--cardeal-primary)]" />}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {totalMatches === 0 && (
                <li className="px-4 py-2 text-sm text-muted-foreground">
                  {allowCustom ? t("search.noServiceMatches") : t("search.noMatches")}
                </li>
              )}
            </ul>,
            document.body
          )}
      </div>
    </div>
  );
}
