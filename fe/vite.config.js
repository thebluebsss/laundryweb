import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "public", // Output vào public thay vì dist
    emptyOutDir: true, // Xóa folder public trước khi build
  },
});
