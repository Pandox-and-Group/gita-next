/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // The container build sets STATIC_EXPORT=1 and serves the exported files with nginx (Dockerfile).
  // Without it the build is unchanged, which is what `pnpm dev`, `pnpm start` and Netlify use.
  ...(process.env.STATIC_EXPORT ? { output: 'export' } : {}),
};
