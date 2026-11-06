import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const origin = (url: string | undefined) => {
  try {
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
};

// Hosts the browser is allowed to call: the API and Supabase Auth.
const connectSrc = ["'self'", origin(process.env.NEXT_PUBLIC_API_URL), origin(process.env.NEXT_PUBLIC_SUPABASE_URL)]
  .filter(Boolean)
  .join(" ");

// Next.js injects small inline scripts for hydration, so 'unsafe-inline' is still required for scripts
// unless nonces are used. Everything else is locked to the same origin.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src ${connectSrc}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(isProd
    ? [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        { key: "Content-Security-Policy", value: csp },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // End-to-end tests build into their own folder so they never overwrite a running dev server's output
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
