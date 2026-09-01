import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE_URL ?? "/obeliskrx/",
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    server: {
      proxy: {
        "/backend": {
          target: "http://localhost",
          changeOrigin: true,
          rewrite: (path) => `/obeliskrx${path}`,
        },
      },
    },
  };
});
