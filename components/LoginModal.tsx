"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "./TranslationProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Mode = "login" | "signup";

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const inputClasses =
  "w-full max-sm:min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

const labelClasses =
  "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

const EMPTY_SIGNUP = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  retypePassword: "",
  address: "",
  vehicleModel: "",
  productionYear: "",
  engineCapacity: "",
  engineCylinders: "",
};

const CYLINDER_OPTIONS = [2, 3, 4, 5, 6, 8, 12];
const MIN_YEAR = 1960;

export default function LoginModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(EMPTY_SIGNUP);
  const [errors, setErrors] = useState<{ retypePassword?: string }>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMode("login");
      emailRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && signup.password !== signup.retypePassword) {
      setErrors({ retypePassword: t("auth.passwordMismatch") });
      return;
    }
    window.location.href = "/results";
  };

  const handleGoogleConnect = () => {
    window.location.href = "/results";
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setEmail("");
    setPassword("");
    setSignup(EMPTY_SIGNUP);
    setErrors({});
    (m === "signup" ? nameRef : emailRef).current?.focus();
  };

  const updateSignup =
    (field: keyof typeof EMPTY_SIGNUP) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setSignup((s) => ({ ...s, [field]: e.target.value }));
      if (field === "password" || field === "retypePassword") {
        setErrors((prev) => ({ ...prev, retypePassword: undefined }));
      }
    };

  const maxYear = new Date().getFullYear();
  const years = Array.from({ length: maxYear - MIN_YEAR + 1 }, (_, i) => maxYear - i);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "login" ? t("auth.signInTitle") : t("auth.signupTitle")}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full rounded-2xl border border-border bg-card p-6 shadow-2xl max-sm:max-h-[92dvh] max-sm:overflow-y-auto sm:p-8",
          mode === "signup" ? "max-w-xl mx-4" : "max-w-md mx-4"
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={t("auth.closeAria")}
        >
          <X size={18} />
        </button>

        <div className="mb-6 text-center max-sm:mb-4">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent max-sm:text-2xl">
            {t("site.name")}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? t("auth.signInTitle") : t("auth.signupTitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleConnect}
          aria-label={t("auth.connectGoogle")}
          className="flex w-full max-sm:min-h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <GoogleIcon size={18} />
          {t("auth.connectGoogle")}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground max-sm:my-4">
          <span className="h-px flex-1 bg-border" />
          {mode === "login" ? t("auth.signInTitle") : t("auth.signupTitle")}
          <span className="h-px flex-1 bg-border" />
        </div>

        {mode === "login" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className={labelClasses}
              >
                {t("auth.email")}
              </label>
              <input
                ref={emailRef}
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder={t("auth.emailPlaceholder")}
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className={labelClasses}
              >
                {t("auth.password")}
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
              {t("auth.signInButton")}
            </Button>
          </form>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto pr-1 max-sm:max-h-[40vh]">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-name" className={labelClasses}>
                  {t("auth.fullName")}
                </label>
                <input
                  ref={nameRef}
                  id="signup-name"
                  type="text"
                  required
                  value={signup.fullName}
                  onChange={updateSignup("fullName")}
                  className={inputClasses}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="signup-email" className={labelClasses}>
                  {t("auth.email")}
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={signup.email}
                  onChange={updateSignup("email")}
                  className={inputClasses}
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="signup-phone" className={labelClasses}>
                  {t("auth.phoneNumber")}
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  required
                  value={signup.phone}
                  onChange={updateSignup("phone")}
                  className={inputClasses}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="signup-vehicle" className={labelClasses}>
                  {t("auth.vehicleModel")}
                </label>
                <input
                  id="signup-vehicle"
                  type="text"
                  required
                  value={signup.vehicleModel}
                  onChange={updateSignup("vehicleModel")}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="signup-password" className={labelClasses}>
                  {t("auth.password")}
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={signup.password}
                  onChange={updateSignup("password")}
                  className={inputClasses}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="signup-retype" className={labelClasses}>
                  {t("auth.retypePassword")}
                </label>
                <input
                  id="signup-retype"
                  type="password"
                  required
                  value={signup.retypePassword}
                  onChange={updateSignup("retypePassword")}
                  className={cn(inputClasses, errors.retypePassword && "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.retypePassword}
                  aria-describedby={errors.retypePassword ? "signup-retype-error" : undefined}
                />
                {errors.retypePassword && (
                  <p id="signup-retype-error" role="alert" className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.retypePassword}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="signup-address" className={labelClasses}>
                  {t("auth.address")}
                </label>
                <input
                  id="signup-address"
                  type="text"
                  required
                  value={signup.address}
                  onChange={updateSignup("address")}
                  className={inputClasses}
                  autoComplete="street-address"
                />
              </div>
              <div>
                <label htmlFor="signup-year" className={labelClasses}>
                  {t("auth.productionYear")}
                </label>
                <input
                  id="signup-year"
                  type="number"
                  required
                  min={MIN_YEAR}
                  max={maxYear}
                  value={signup.productionYear}
                  onChange={updateSignup("productionYear")}
                  className={inputClasses}
                  placeholder={String(maxYear)}
                />
              </div>
              <div>
                <label htmlFor="signup-capacity" className={labelClasses}>
                  {t("auth.engineCapacity")}
                </label>
                <input
                  id="signup-capacity"
                  type="number"
                  required
                  min={0.5}
                  max={8}
                  step={0.1}
                  value={signup.engineCapacity}
                  onChange={updateSignup("engineCapacity")}
                  className={inputClasses}
                  placeholder="1.6"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="signup-cylinders" className={labelClasses}>
                  {t("auth.engineCylinders")}
                </label>
                <select
                  id="signup-cylinders"
                  required
                  value={signup.engineCylinders}
                  onChange={updateSignup("engineCylinders")}
                  className={cn(inputClasses, !signup.engineCylinders && "text-muted-foreground/50")}
                >
                  <option value="" disabled>
                    {t("auth.pleaseSelect")}
                  </option>
                  {CYLINDER_OPTIONS.map((c) => (
                    <option key={c} value={c} className="text-foreground">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full sm:col-span-2">
                {t("auth.signupButton")}
              </Button>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground max-sm:mt-4">
          {mode === "login" ? (
            <>
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="max-sm:py-1.5 underline hover:text-foreground"
              >
                {t("auth.joinUs")}
              </button>
            </>
          ) : (
            <>
              {t("auth.haveAccount")}{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="max-sm:py-1.5 underline hover:text-foreground"
              >
                {t("auth.signInLink")}
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-xs text-muted-foreground max-sm:mt-2">
          <button
            type="button"
            onClick={onClose}
            className="max-sm:py-1.5 underline hover:text-foreground"
          >
            {t("auth.backHome")}
          </button>
        </p>
      </div>
    </div>
  );
}
