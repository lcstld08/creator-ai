import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In local dev, the /api functions are provided by `vercel dev`.
      // If you're not using Vercel CLI locally, point this at your own dev server.
    },
  },
});
