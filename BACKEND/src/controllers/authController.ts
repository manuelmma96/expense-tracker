import { RequestHandler } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Type Guard for Errors
const isError = (error: unknown): error is Error => error instanceof Error;

// Register Handler
export const register: RequestHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        if (isError(error)) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Login Handler
export const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }) as IUser | null;

        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        if (isError(error)) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};