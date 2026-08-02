export const PENDING_REQUEST_KEY = "pending_request";
const AUTH_KEY = "cardeal_auth";

export type PendingRequest = {
  type: "appointment" | "quote";
  partnerId: string;
  partnerName: string;
  fullName: string;
  phone: string;
  date?: string;
  time?: string;
  notes?: string;
};

/**
 * Mock auth status (consistent with the app's current sign-in flow).
 * A real session provider can replace this without touching callers.
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAuthenticated(value = true): void {
  try {
    window.sessionStorage.setItem(AUTH_KEY, String(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function savePendingRequest(payload: PendingRequest): void {
  try {
    window.sessionStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function readPendingRequest(): PendingRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_REQUEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingRequest;
    return parsed && parsed.type && parsed.partnerName ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPendingRequest(): void {
  try {
    window.sessionStorage.removeItem(PENDING_REQUEST_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}
