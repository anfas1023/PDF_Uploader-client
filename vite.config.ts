import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})



// import { defineConfig } from 'vite';
// 

// export default defineConfig({
//   plugins: [
//     viteStaticCopy({
//       targets: [
//         {
//           src: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
//           dest: 'pdfjs',
//         },
//       ],
//     }),
//   ],
// });
