import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config — dev server on :5173 (matches CORS allow-list in backend).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
