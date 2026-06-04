import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read backend/.env port
const getBackendPort = () => {
  try {
    const envPath = path.resolve(__dirname, "backend/.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      // Find the active PORT line (ignoring commented ones)
      const portLine = envContent
        .split("\n")
        .map(line => line.trim())
        .find(line => line.startsWith("PORT=") && !line.startsWith("#"));
      
      if (portLine) {
        const port = portLine.split("=")[1].trim();
        if (port) return parseInt(port, 10);
      }
    }
  } catch (error) {
    console.error("Failed to read backend port from .env:", error);
  }
  return process.env.PORT || 5000;
};

const backendPort = getBackendPort();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true
      }
    }
  },
});
