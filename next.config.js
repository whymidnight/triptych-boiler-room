/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ];
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_PROJECT_NAME: process.env.NEXT_PUBLIC_PROJECT_NAME,
    NEXT_PUBLIC_BACKGROUND_FILE: process.env.NEXT_PUBLIC_BACKGROUND_FILE,
    NEXT_PUBLIC_LOGO_FILE: process.env.NEXT_PUBLIC_LOGO_FILE,
    NEXT_PUBLIC_TEXT_COLOR: process.env.NEXT_PUBLIC_TEXT_COLOR,
    NEXT_PUBLIC_PRIMARY_PRIMARY_COLOR:
      process.env.NEXT_PUBLIC_PRIMARY_PRIMARY_COLOR,
    NEXT_PUBLIC_PRIMARY_SECONDARY_COLOR:
      process.env.NEXT_PUBLIC_PRIMARY_SECONDARY_COLOR,
    NEXT_PUBLIC_SECONDARY_PRIMARY_COLOR:
      process.env.NEXT_PUBLIC_SECONDARY_PRIMARY_COLOR,
    NEXT_PUBLIC_SECONDARY_SECONDARY_COLOR:
      process.env.NEXT_PUBLIC_SECONDARY_SECONDARY_COLOR,
  },
};

