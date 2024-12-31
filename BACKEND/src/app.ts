import express from 'express';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { errorHandler }from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/transactions', transactionRoutes);
// app.get('/test-error', () => {
//     throw new Error('Test Error!');
// });

//Error Handling Middleware
app.use(errorHandler);

export default app;