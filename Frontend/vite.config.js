import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "themeContext": "/src/themeContext.jsx",
      "Index": "/src/components/Index",
      "Dashboard": "/src/components/Dashboard",
      "Settings": "/src/components/Settings",
      "components": "/src/components/",
      "pages": "/src/pages",
    }
  }
})
