import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // UPDATE: Removed the conflicting tailwind plugin. Vite will natively use postcss.config.js
  plugins: [react()],
});
