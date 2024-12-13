import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        base: '/',
        plugins: [react()],
        define: {
          // 'process.env.YOUR_STRING_VARIABLE': JSON.stringify(env.YOUR_STRING_VARIABLE),
          // 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
          // If you want to exposes all env variables, which is not recommended
          'process.env': env
        },
        server: {
          proxy: {
            '/api': {
              target: process.env.AIDOPTIMIZER_API_URL,
              changeOrigin: true,
              // rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        },
    };
});
