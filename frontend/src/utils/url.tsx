// Replace process.env with import.meta.env
export const API_URL = import.meta.env.VITE_URL_LINK || "http://localhost:3000";
export const SOCKET_URL = import.meta.env.VITE_URL_LINK || "http://localhost:3000";