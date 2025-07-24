// postcss.config.js
export default {
  plugins: {
    // CRITICAL: For Tailwind CSS v3.x, this must be 'tailwindcss', NOT '@tailwindcss/postcss'
    tailwindcss: {},
    autoprefixer: {},
  },
};