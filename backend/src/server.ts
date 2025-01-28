import dotenv from 'dotenv';
import app, {  server } from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.listen(5000, () => {
    console.log(`Server running on port 5000`);
  });
