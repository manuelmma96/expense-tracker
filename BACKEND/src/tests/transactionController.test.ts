import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../controllers/transactionController';
import Transaction from '../models/Transaction';
import User from '../models/User';
import { Response } from 'express';

// Mock Models
jest.mock('../models/Transaction');
jest.mock('../models/User');

const mockRequest = (body: any = {}, params: any = {}, query: any = {}) => ({
    body,
    params,
    query,
});

const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext = jest.fn();

describe('Transaction Controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test Case 1: Create Transaction
    describe('createTransaction', () => {
        it('should create a transaction successfully', async () => {
            const req = mockRequest({
                userId: '676db14e9bba37a49acf805f',
                date: '2024-06-28',
                category: 'Food',
                amount: 50,
                description: 'Lunch'
            });
            const res = mockResponse();

            (User.findById as jest.Mock).mockResolvedValue({
                transactionSummary: { totalSpent: 0, lastTransactionDate: new Date(), transactionCount: 0 },
                save: jest.fn()
            });

            (Transaction.create as jest.Mock).mockResolvedValue({
                _id: '67737b2f63628f62a9edbd13',
                userId: '676db14e9bba37a49acf805f',
                date: '2024-06-28',
                category: 'Food',
                amount: 50,
                description: 'Lunch'
            });

            await createTransaction(req as any, res, mockNext);

            expect(User.findById).toHaveBeenCalledWith('676db14e9bba37a49acf805f');
            expect(Transaction.create).toHaveBeenCalledWith({
                userId: '676db14e9bba37a49acf805f',
                date: '2024-06-28',
                category: 'Food',
                amount: 50,
                description: 'Lunch'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Transaction created successfully',
                transaction: expect.any(Object)
            });
        });
    });

    // Test Case 2: Get Transactions
    describe('getTransactions', () => {
        it('should return transactions for a valid userId', async () => {
            const req = mockRequest({}, {}, { userId: '676db14e9bba37a49acf805f' });
            const res = mockResponse();

            (Transaction.find as jest.Mock).mockImplementation(() => ({
                sort: jest.fn().mockReturnValue([
                    { _id: '1', userId: '676db14e9bba37a49acf805f', amount: 50 }
                ])
            }));

            await getTransactions(req as any, res, mockNext);

            expect(Transaction.find).toHaveBeenCalledWith({ userId: '676db14e9bba37a49acf805f' });
            expect(res.json).toHaveBeenCalledWith([
                { _id: '1', userId: '676db14e9bba37a49acf805f', amount: 50 }
            ]);
        });
    });

    // Test Case 3: Update Transaction
    describe('updateTransaction', () => {
        it('should update a transaction successfully', async () => {
            const req = mockRequest(
                { amount: 100 },
                { id: '67737b2f63628f62a9edbd13' }
            );
            const res = mockResponse();

            (Transaction.findById as jest.Mock).mockResolvedValue({
                amount: 50,
                save: jest.fn()
            });

            await updateTransaction(req as any, res, mockNext);

            expect(Transaction.findById).toHaveBeenCalledWith('67737b2f63628f62a9edbd13');
            expect(res.json).toHaveBeenCalledWith({
                message: 'Transaction updated successfully',
                transaction: expect.any(Object)
            });
        });
    });

    // Test Case 4: Delete Transaction
    describe('deleteTransaction', () => {
        it('should delete a transaction successfully', async () => {
            const req = mockRequest({}, { id: '67737b2f63628f62a9edbd13' }, { userId: '676db14e9bba37a49acf805f' });
            const res = mockResponse();

            (Transaction.findById as jest.Mock).mockResolvedValue({
                userId: '676db14e9bba37a49acf805f',
                amount: 50
            });

            await deleteTransaction(req as any, res, mockNext);

            expect(Transaction.findById).toHaveBeenCalledWith('67737b2f63628f62a9edbd13');
            expect(res.json).toHaveBeenCalledWith({ message: 'Transaction deleted successfully' });
        });
    });
});