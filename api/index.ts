import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes'; // Import the main routes

const PORT = process.env.API_PORT || 8000;

const app = express();

app.use(cors());

app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
    res.json({ message: 'pong' });
});

app.use('/api', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
