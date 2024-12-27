import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    const user = this as IUser;

    if (!user.isModified('password')) return next();

    try {
        user.password = await bcrypt.hash(user.password, 10);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare passwords
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const user = this as IUser;
    return bcrypt.compare(password, user.password);
};

export default mongoose.model<IUser>('User', UserSchema);