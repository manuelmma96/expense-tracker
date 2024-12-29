import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    category: string;
    amount: number;
    description: string;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);