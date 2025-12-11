import dbConnect from '../lib/dbConnect';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    console.log('Testing MongoDB Connection...');
    console.log('URI:', process.env.MONGODB_URI?.split('@')[1]); // Log only host part for security

    try {
        await dbConnect();
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('State:', mongoose.connection.readyState);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
        process.exit(1);
    }
}

check();
