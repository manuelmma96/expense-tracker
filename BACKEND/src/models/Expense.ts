import mongoose, { Schema, Document } from 'mongoose';

interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    category: string;
    amount: number;
    description: string;
}

const ExpenseSchema: Schema<IExpense> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String }
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);