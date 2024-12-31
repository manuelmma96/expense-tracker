import { RequestHandler } from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';


export const createTransaction: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { userId, date, category, amount, description } = req.body;

        if (!userId || !date || !category || !amount) {
            res.status(400).json({ error: 'Missing required fields: userId, date, category, amount.' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found. Cannot create a transaction.' });
            return;
        }

        const transaction = await Transaction.create({
            userId,
            date,
            category,
            amount,
            description,
        });

        user.transactionSummary.totalSpent += amount;
        user.transactionSummary.lastTransactionDate = new Date(date);
        user.transactionSummary.transactionCount += 1;
        await user.save();

        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        next(error);
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

export const updateTransaction: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, category, amount, description } = req.body;

        const existingTransaction = await Transaction.findById(id);
        if (!existingTransaction) {
            res.status(404).json({ error: 'Transaction not found.' });
            return;
        }

        const amountDifference = amount - existingTransaction.amount;

        existingTransaction.date = date || existingTransaction.date;
        existingTransaction.category = category || existingTransaction.category;
        existingTransaction.amount = amount || existingTransaction.amount;
        existingTransaction.description = description || existingTransaction.description;

        await existingTransaction.save();

        await User.findByIdAndUpdate(existingTransaction.userId, {
            $inc: { 'transactionSummary.totalSpent': amountDifference },
            $set: { 'transactionSummary.lastTransactionDate': new Date(date) }
        });

        res.json({ message: 'Transaction updated successfully', transaction: existingTransaction });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
};

export const deleteTransaction: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            res.status(404).json({ error: 'Transaction not found.' });
            return;
        }

        await User.findByIdAndUpdate(transaction.userId, {
            $inc: { 'transactionSummary.totalSpent': -transaction.amount, 'transactionSummary.transactionCount': -1 },
        });

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
};