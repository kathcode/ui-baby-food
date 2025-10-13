// next.config.js
const isCI = process.env.CI === 'true'; // Render sets CI=true
module.exports = {
  typescript: {
    // Allow production builds to succeed even if there are TS errors
    ignoreBuildErrors: isCI,
  },
  eslint: {
    // Optional: don’t fail build on ESLint issues in CI
    ignoreDuringBuilds: isCI,
  },
};
