import { RequestHandler } from 'express';
import Expense from '../models/Expense';
import mongoose from "mongoose";
import User from '../models/User';

export const createExpense: RequestHandler = async (req, res) => {
    try {
        const { userId, date, category, amount, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid userId. Must be a valid MongoDB ObjectId.' });
            return;
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            res.status(404).json
        }

        const expense = await Expense.create({
            userId: userId,
            date,
            category,
            amount,
            description,
        });

        res.status(201).json({ message: 'Expense created successfully', expense });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create expense' });
    }
};

export const getExpenses: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.query;

        const expenses = await Expense.find({ userId }).populate('userId', 'name email');

        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};

export const updateExpense: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const expense = await Expense.findByIdAndUpdate(id, updates, { new: true });
        res.json(expense);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

export const deleteExpense: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.findByIdAndDelete(id);
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};