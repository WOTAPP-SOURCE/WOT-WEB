// Ambient typings for the Cloudflare Turnstile browser API exposed on `window`.
// Loaded at runtime via the official script (challenges.cloudflare.com/turnstile/v0/api.js).
// See: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

export interface TurnstileRenderOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  /** Invoked with the verification token once the challenge succeeds. */
  callback?: (token: string) => void;
  /** Invoked when a previously issued token expires. */
  "expired-callback"?: () => void;
  /** Invoked when the challenge fails or errors. */
  "error-callback"?: () => void;
}

export interface TurnstileApi {
  render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export {};
