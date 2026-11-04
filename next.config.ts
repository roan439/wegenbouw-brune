import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920],
    // Projectfoto's staan momenteel op de bestaande WordPress-site.
    // Verhuis ze naar /public/projecten of naar uw CMS-mediabibliotheek en verwijder dan dit patroon.
    remotePatterns: [
      { protocol: "https", hostname: "www.wegenbouw-brune.nl", pathname: "/wp-content/uploads/**" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Hero-frames zijn versioned (map-naam); agressief cachen.
        source: "/hero/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
