/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      process.env.WORDPRESS_IMAGE_DOMAIN,
      "0.gravatar.com",
      "1.gravatar.com",
      "2.gravatar.com",
      "secure.gravatar.com",
    ],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
