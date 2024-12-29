import { RequestHandler } from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';
import mongoose from 'mongoose';

export const createTransaction: RequestHandler = async (req, res) => {
    try {
        const { userId, date, category, amount, description } = req.body;

        // Validate userId as ObjectId
        if (!mongoose.isValidObjectId(userId)) {
            res.status(400).json({ error: 'Invalid userId. Must be a valid MongoDB ObjectId.' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        // Create the transaction
        const transaction = await Transaction.create({
            userId,
            date,
            category,
            amount,
            description
        });

        // Update transaction summary in the user document
        user.transactionSummary.totalSpent += amount;
        user.transactionSummary.lastTransactionDate = new Date(date);
        user.transactionSummary.transactionCount += 1;
        await user.save();

        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};

export const getTransactions: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400).json({ error: 'userId query parameter is required.' });
        }

        const transactions = await Transaction.find({ userId }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};