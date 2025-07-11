import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Travel Guide API' });
});

router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'healthy' });
});

router.get('/db-status', async (_req: Request, res: Response) => {
    try {
        await mongoose.connection.db.admin().ping();
        const collections = await mongoose.connection.db.listCollections().toArray();
        const stats: Record<string, number> = {};
        
        for (const collection of collections) {
            stats[collection.name] = await mongoose.connection.db
                .collection(collection.name)
                .countDocuments();
        }
        
        res.json({
            status: 'connected',
            database: process.env.MONGODB_NAME,
            collections: stats
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
