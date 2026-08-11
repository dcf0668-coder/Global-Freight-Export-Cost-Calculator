/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  typedRoutes: true,
  eslint: {
    // Lint errors (like the unescaped-apostrophe rule) already fail your CI
    // separately via `npm run lint`; they shouldn't also block `next build`
    // / deployment. Real type errors still fail the build via tsc.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
