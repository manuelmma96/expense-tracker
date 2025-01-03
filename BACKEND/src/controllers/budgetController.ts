import { RequestHandler } from 'express';
import Budget from '../models/Budget';
import User from '../models/User';

export const createBudget: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { userId, category, amount, startDate, endDate } = req.body;

        if (!userId || !category || !amount || !startDate || !endDate) {
            res.status(400).json({ error: 'Missing required fields: userId, category, amount, startDate, endDate.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found. Cannot create a budget.' });
        }

        const budget = await Budget.create({
            userId,
            category,
            amount,
            startDate,
            endDate
        });

        res.status(201).json({ message: 'Budget created successfully', budget });
    } catch (error) {
        next(error);
    }
};

export const getBudgets: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400).json({ error: 'userId query parameter is required.' });
        }

        const budgets = await Budget.find({ userId }).sort({ startDate: -1 });
        res.json(budgets);
    } catch (error) {
        next(error);
    }
};

export const getBudgetById: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { id } = req.params;

        const budget = await Budget.findById(id);
        if (!budget) {
            res.status(404).json({ error: 'Budget not found.' });
        }

        res.json(budget);
    } catch (error) {
        next(error);
    }
};

export const updateBudget: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { id } = req.params;
        const { category, amount, startDate, endDate } = req.body;

        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            { category, amount, startDate, endDate },
            { new: true }
        );

        if (!updatedBudget) {
            res.status(404).json({ error: 'Budget not found.' });
        }

        res.json({ message: 'Budget updated successfully', budget: updatedBudget });
    } catch (error) {
        next(error);
    }
};

export const deleteBudget: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { id } = req.params;

        const budget = await Budget.findByIdAndDelete(id);
        if (!budget) {
            res.status(404).json({ error: 'Budget not found.' });
        }

        res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        next(error);
    }
};
