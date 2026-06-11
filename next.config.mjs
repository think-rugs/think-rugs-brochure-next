/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` writes a fully static site to out/,
  // hostable on any static host (Vercel, Netlify, S3, plain nginx).
  // Remove this line later if server features (API routes, ISR) are needed.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
