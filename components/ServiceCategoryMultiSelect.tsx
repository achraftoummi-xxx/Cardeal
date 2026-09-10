"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X, Square, CheckSquare, MinusSquare } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { localized } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  SERVICE_CATEGORY_GROUPS,
  searchServiceCategories,
  type ServiceCategoryGroup,
} from "@/data/serviceCategories";
import { getServiceCategoryIcon } from "@/data/serviceCategoryIcons";

const ALL_COLLAPSED: Set<string> = new Set(
  SERVICE_CATEGORY_GROUPS.map((g) => g.category)
);

type Position = { top: number; left: number; width: number };

type Props = {
  id?: string;
  name?: string;
  label?: string;
  value: string[]; // Array of selected main and sub-categories
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
};

export default function ServiceCategoryMultiSelect({
  id,
  name,
  label,
  value = [],
  onChange,
  placeholder,
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

  const handleFocus = () => {
    openDropdown();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setQuery("");
    openDropdown();
  };

  const toggleGroupSelection = (group: ServiceCategoryGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    const allSubs = group.subCategories;
    const mainSelected = value.includes(group.category);
    const allSubsSelected = allSubs.every((sub) => value.includes(sub));

    let next = new Set(value);
    if (mainSelected || allSubsSelected) {
      // Unselect main and all its subcategories
      next.delete(group.category);
      allSubs.forEach((sub) => next.delete(sub));
    } else {
      // Select main and all its subcategories
      next.add(group.category);
      allSubs.forEach((sub) => next.add(sub));
    }
    onChange([...next]);
  };

  const toggleSubSelection = (sub: string, group: ServiceCategoryGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    let next = new Set(value);
    if (next.has(sub)) {
      next.delete(sub);
      // If none of the subs are selected, also unselect main category
      const anySubLeft = group.subCategories.some((s) => next.has(s));
      if (!anySubLeft) {
        next.delete(group.category);
      }
    } else {
      next.add(sub);
      // Automatically select main category when a sub is selected
      next.add(group.category);
    }
    onChange([...next]);
  };

  const toggleGroupCollapse = (category: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const searching = query.trim().length > 0;
  const isExpanded = (group: ServiceCategoryGroup) =>
    searching || !collapsed.has(group.category);

  const displayText = useMemo(() => {
    if (value.length === 0) return "";
    const mainCategoriesCount = SERVICE_CATEGORY_GROUPS.filter((g) => value.includes(g.category)).length;
    const subCategoriesCount = value.filter((v) => !SERVICE_CATEGORY_GROUPS.some((g) => g.category === v)).length;
    
    const parts = [];
    if (mainCategoriesCount > 0) {
      parts.push(`${mainCategoriesCount} catégorie${mainCategoriesCount > 1 ? 's' : ''} principale${mainCategoriesCount > 1 ? 's' : ''}`);
    }
    if (subCategoriesCount > 0) {
      parts.push(`${subCategoriesCount} prestation${subCategoriesCount > 1 ? 's' : ''}`);
    }
    return parts.join(", ");
  }, [value]);

  return (
    <div>
      {label && (
        <label
          htmlFor={id ?? "service-category-multiselect"}
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div ref={anchorRef} className="relative">
        <div
          id={id ?? "service-category-multiselect"}
          role="combobox"
          aria-expanded={open}
          onClick={openDropdown}
          className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            {value.length === 0 ? (
              <span className="text-muted-foreground/50">{placeholder || t("search.servicePlaceholder")}</span>
            ) : (
              <span className="truncate font-medium text-foreground">{displayText}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            {value.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
                aria-label={t("search.clearServiceCategory")}
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown size={18} className="text-muted-foreground transition-transform duration-200" />
          </div>
        </div>

        {open &&
          position &&
          createPortal(
            <div
              role="listbox"
              aria-multiselectable={true}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
              }}
              className="fixed z-[9999] max-h-80 overflow-y-auto rounded-xl border border-border bg-card py-2 shadow-2xl shadow-black/20 dark:shadow-black/60"
            >
              <div className="px-3 pb-2 mb-2 border-b border-border">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher une catégorie ou prestation..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-blue-500/50"
                  autoFocus
                />
              </div>

              <div className="space-y-1 px-1">
                {groups.map((group) => {
                  const mainSelected = value.includes(group.category);
                  const allSubs = group.subCategories;
                  const selectedSubsCount = allSubs.filter((sub) => value.includes(sub)).length;
                  const allSubsSelected = selectedSubsCount === allSubs.length;
                  const someSubsSelected = selectedSubsCount > 0 && !allSubsSelected;

                  return (
                    <div key={group.category} className="rounded-lg overflow-hidden">
                      {/* Main Category Header */}
                      <div
                        onClick={(e) => toggleGroupSelection(group, e)}
                        className={cn(
                          "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors select-none",
                          mainSelected || allSubsSelected
                            ? "bg-[var(--cardeal-primary)]/15 text-foreground font-semibold"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <button
                            type="button"
                            className="text-[var(--cardeal-primary)] shrink-0"
                            aria-label="Toggle category"
                          >
                            {allSubsSelected ? (
                              <CheckSquare size={18} className="text-[var(--cardeal-primary)]" />
                            ) : someSubsSelected ? (
                              <MinusSquare size={18} className="text-[var(--cardeal-primary)]" />
                            ) : (
                              <Square size={18} className="text-muted-foreground" />
                            )}
                          </button>
                          <img
                            src={getServiceCategoryIcon(group.category)}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                            className="h-5 w-5 shrink-0 object-contain dark:brightness-0 dark:invert"
                          />
                          <span className="min-w-0 flex-1 truncate text-xs uppercase tracking-wider font-bold">
                            {localized(t, "serviceCat", group.category)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroupCollapse(group.category);
                          }}
                          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isExpanded(group) ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Sub-categories */}
                      {isExpanded(group) && (
                        <div className="pl-6 pr-2 py-1 space-y-1">
                          {group.subCategories.map((sub) => {
                            const subSelected = value.includes(sub);
                            return (
                              <div
                                key={sub}
                                onClick={(e) => toggleSubSelection(sub, group, e)}
                                className={cn(
                                  "flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors select-none text-xs",
                                  subSelected
                                    ? "bg-[var(--cardeal-primary)]/10 text-foreground font-medium"
                                    : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span className="text-[var(--cardeal-primary)] shrink-0">
                                    {subSelected ? (
                                      <CheckSquare size={15} className="text-[var(--cardeal-primary)]" />
                                    ) : (
                                      <Square size={15} className="text-muted-foreground/60" />
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1 truncate">{localized(t, "serviceCat", sub)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {groups.length === 0 && (
                  <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                    Aucun service trouvé
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
