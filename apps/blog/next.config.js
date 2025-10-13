/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async redirects() {
    return [
      {
        source: '/blog/page/1',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
  async generateBuildId() {
    return 'growi-blog-build';
  },
}

module.exports = nextConfig;