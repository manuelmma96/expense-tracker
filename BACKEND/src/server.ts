import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});