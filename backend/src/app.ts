import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).json({ error: err.message });
});

export default app;
