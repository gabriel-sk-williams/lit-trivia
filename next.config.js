/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true
  },
  //webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  env: {
    service: 'NEXT_PUBLIC_SERVICE_ID',
    email: 'NEXT_PUBLIC_EMAIL_KEY',
    submit: 'NEXT_PUBLIC_SUBMIT_ID',
    public: 'NEXT_PUBLIC_PUBLIC_KEY',
    token: 'NEXT_PUBLIC_ACCESS_TOKEN'
  }
}

module.exports = nextConfig