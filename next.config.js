module.exports = {
  typescript: {
    // Allow production builds to succeed even if there are TS errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Optional: don’t fail build on ESLint issues in CI
    ignoreDuringBuilds: true,
  },
  
};
