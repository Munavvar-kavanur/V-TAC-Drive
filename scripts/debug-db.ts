import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    const uri = process.env.MONGODB_URI;
    console.log('Testing URI:', uri?.replace(/:([^:@]+)@/, ':****@')); // Hide password

    if (!uri) {
        console.error('MONGODB_URI is undefined');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected!');
        await mongoose.disconnect();
    } catch (err: any) {
        console.error('❌ Error Name:', err.name);
        console.error('❌ Error Message:', err.message);
        if (err.cause) console.error('❌ Cause:', err.cause);
        // console.error('Full Error:', JSON.stringify(err, null, 2));
    }
}

check();
