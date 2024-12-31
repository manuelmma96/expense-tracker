import { Router } from 'express';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../controllers/transactionController';
import { validateObjectId } from '../middleware/validateObjectId';

const router = Router();

router.post('/', validateObjectId, createTransaction);
router.get('/', validateObjectId, getTransactions);
router.put('/:id', validateObjectId, updateTransaction);
router.delete('/:id', validateObjectId, deleteTransaction);

export default router;