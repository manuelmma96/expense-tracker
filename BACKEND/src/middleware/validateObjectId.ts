import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Middleware to validate MongoDB ObjectId from request body or params.
 */
export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;   // Check id in params (for Update/Delete endpoints)
    const queryUserId = req.query.userId as string; //Validate in query

    if (id && !mongoose.isValidObjectId(id)) {
        res.status(400).json({ error: 'Invalid id. Must be a valid MongoDB ObjectId.' });
    }

    // Validate userId in query (e.g., /api/budgets?userId=...)
    if (req.method === 'GET' && req.path === '/' && !queryUserId) {
        res.status(400).json({ error: 'userId query parameter is required.' });
    }

    if (queryUserId && !mongoose.isValidObjectId(queryUserId)) {
        res.status(400).json({ error: 'Invalid userId in query. Must be a valid MongoDB ObjectId.' });
    }

    next();
};

// export const validateUserExists = async (req: Request, res: Response, next: NextFunction) => {
//     const { userId } = req.body;
//
//     const userExists = await User.findById(userId);
//     if (!userExists) {
//         res.status(404).json({ error: 'User not found. Cannot create expense for a non-existent user.' });
//     }
//
//     next();
// };