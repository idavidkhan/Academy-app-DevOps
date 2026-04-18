// Central configuration file.
// To change the backend URL, update VITE_API_URL in the .env file.
// When running via Docker + Nginx, this resolves to /api which nginx proxies to the backend container.
export const BASE_URL = import.meta.env.VITE_API_URL || "/api";
