import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId;
    category: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BudgetSchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IBudget>('Budget', BudgetSchema);