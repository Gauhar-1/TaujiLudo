import dotenv from 'dotenv';
import app, {  server } from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

// ✅ Single HTTP server handles both API and WebSocket
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
