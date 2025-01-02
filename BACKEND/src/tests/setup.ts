import mongoose from 'mongoose';

beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1/test-db');
});

afterAll(async () => {
    await mongoose.connection.close();
});