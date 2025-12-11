import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ status: 'Connected to MongoDB', timestamp: new Date() });
    } catch (error: any) {
        return NextResponse.json({ status: 'Error', error: error.message }, { status: 500 });
    }
}
