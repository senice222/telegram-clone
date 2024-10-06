/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['web.telegram.org', 'i.imgur.com', 'localhost']
  },
  experimental: {
    serverMinification: false,
  },
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000',
  },
}

export default nextConfig;
