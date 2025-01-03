import { Router } from 'express';
import {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
} from '../controllers/budgetController';
import { validateObjectId } from '../middleware/validateObjectId';

const router = Router();

router.post('/', validateObjectId, createBudget);
router.get('/', validateObjectId, getBudgets);
router.get('/:id', validateObjectId, getBudgetById);
router.put('/:id', validateObjectId, updateBudget);
router.delete('/:id', validateObjectId, deleteBudget);

export default router;