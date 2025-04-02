/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placehold.co","encrypted-tbn0.gstatic.com","lh3.googleusercontent.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" }, // ✅ Fixes OAuth popups
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
    ];
  },
};

export default nextConfig;
