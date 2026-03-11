import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@data": path.resolve(__dirname, "./src/data"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@contexts": path.resolve(__dirname, "./src/contexts"),
            "@styles": path.resolve(__dirname, "./src/styles"),
        },
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
            },
        },
    },
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             additionalData: `@import "./src/styles/variables.scss";`
    //         }
    //     }
    // },
    build: {
        outDir: "dist",
        sourcemap: false,
        rollupOptions: {
            output: {
                entryFileNames: "assets/app-min.js", // для JS
                chunkFileNames: "assets/[name]-min.js", // для чанков
                assetFileNames: (assetInfo) => {
                    const fileName = assetInfo.names[0];
                    // CSS файлы
                    if (fileName?.endsWith(".css")) {
                        return "assets/app-min.css";
                    }
                    // Изображения
                    if (fileName?.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
                        return "assets/images/[name]-[hash][extname]";
                    }
                    // Шрифты
                    if (fileName?.match(/\.(woff2|woff|ttf|eot)$/)) {
                        return "assets/fonts/[name][extname]";
                    }
                    // Остальные ассеты
                    return "assets/[name][extname]";
                },
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    gsap: ["gsap"],
                    mui: [
                        "@mui/material",
                        "@mui/icons-material",
                        "@emotion/react",
                        "@emotion/styled",
                    ],
                },
            },
        },
    },
});
