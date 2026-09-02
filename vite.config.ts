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
      // Don't watch build output / the deploy bundle — a locked deploy.zip
      // being written crashes the dev server's file watcher (EBUSY on Windows).
      watch: {
        ignored: ["**/dist/**", "**/deploy.zip"],
      },
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
