"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { localized } from "@/lib/i18n";
import {
  searchServiceCategories,
  type ServiceCategoryGroup,
} from "@/data/serviceCategories";

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
 * Renders the category hierarchy (category header + sub-categories) and
 * filters both levels as the user types. The committed value is always a
 * sub-category (canonical string), unless `allowCustom` is enabled.
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
  const inputRef = useRef<HTMLInputElement>(null);

  const groups: ServiceCategoryGroup[] = useMemo(
    () => searchServiceCategories(query),
    [query]
  );

  const totalMatches = useMemo(
    () => groups.reduce((acc, g) => acc + g.subCategories.length, 0),
    [groups]
  );

  /* Focus: surface the current value in the input and open the list */
  const handleFocus = () => {
    setQuery(value);
    setOpen(true);
  };

  const handleChange = (v: string) => {
    setQuery(v);
    setOpen(true);
  };

  /* Clear: instantly reset both the typed text and the committed
     category, then keep the list open so a new category can be
     picked with a single click. */
  const handleClear = () => {
    setQuery("");
    onChange("");
    setOpen(true);
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
      <div className="relative">
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
        {open && (
          <ul
            id="service-category-options"
            role="listbox"
            aria-multiselectable={false}
            className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg shadow-black/10 dark:shadow-black/40"
          >
            {groups.map((group) => (
              <li key={group.category} role="presentation" className="px-1">
                <p
                  role="presentation"
                  className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70"
                >
                  {localized(t, "serviceCat", group.category)}
                </p>
                <ul role="group" aria-label={localized(t, "serviceCat", group.category)}>
                  {group.subCategories.map((option) => (
                    <li
                      key={option}
                      role="option"
                      aria-selected={option === value}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(option)}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-blue-500"
                    >
                      <span className="min-w-0 flex-1">{localized(t, "serviceCat", option)}</span>
                      {option === value && <Check size={15} className="shrink-0 text-blue-500" />}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {totalMatches === 0 && (
              <li className="px-4 py-2 text-sm text-muted-foreground">
                {allowCustom ? t("search.noServiceMatches") : t("search.noMatches")}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
