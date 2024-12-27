import { Router } from 'express';
import { createExpense, getExpenses, updateExpense, deleteExpense } from '../controllers/expenseController';
import { validateObjectId } from '../middleware/validateObjectId';

const router = Router();

router.post('/', validateObjectId, createExpense);
router.get('/', validateObjectId, getExpenses);
router.put('/:id', validateObjectId, updateExpense);
router.delete('/:id', validateObjectId, deleteExpense);

export default router;