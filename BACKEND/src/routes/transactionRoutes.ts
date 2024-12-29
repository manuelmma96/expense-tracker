import { Router } from 'express';
import { createTransaction, getTransactions } from '../controllers/transactionController';
import { validateObjectId } from '../middleware/validateObjectId';

const router = Router();

router.post('/', validateObjectId, createTransaction);
router.get('/', validateObjectId, getTransactions);

export default router;