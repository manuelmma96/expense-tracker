import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
    console.error('Error:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};