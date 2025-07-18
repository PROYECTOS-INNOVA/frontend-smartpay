// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // Importa el plugin

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Registrar el service worker automáticamente
      devOptions: {
        enabled: true, // Habilitar el service worker en desarrollo (para pruebas)
      },
      manifest: {
        name: 'SmartPay Cliente',
        short_name: 'SmartPay',
        description: 'Aplicación para clientes de SmartPay',
        theme_color: '#4F46E5', // Color principal de tu aplicación (Indigo 600)
        background_color: '#ffffff', // Color de fondo al iniciar
        display: 'standalone', // Cómo se muestra la app (fullscreen, standalone, minimal-ui, browser)
        scope: '/', // Alcance del service worker
        start_url: '/client/dashboard', // URL de inicio al abrir como PWA
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '353x330',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '353x330',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '353x330',
            type: 'image/png',
            purpose: 'any maskable', // Para iconos adaptables
          },
        ],
      },
      workbox: {
        // Estrategias de caché
        // Cacha los assets estáticos de la aplicación
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
        // Reglas para cachar APIs (ej. para offline)
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/api/'), // Si tu API está en el mismo origen
            handler: 'NetworkFirst', // Intenta la red primero, luego la caché
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 1 día
              },
            },
          },
          // Puedes añadir más reglas para imágenes externas, etc.
        ],
      },
    }),
  ],
});