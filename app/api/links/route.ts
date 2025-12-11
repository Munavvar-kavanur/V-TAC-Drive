import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Link from '@/models/Link';
import { getDriveFileId, isValidUrl } from '@/lib/driveUtils';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url, type, customCode, expiresAt } = await req.json();

        if (!url || !isValidUrl(url)) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        await dbConnect();

        let shortCode = customCode;
        if (!shortCode) {
            shortCode = nanoid(6); // Generate 6 char random code
        } else {
            // Check if custom code exists
            const existing = await Link.findOne({ shortCode });
            if (existing) {
                return NextResponse.json({ error: 'Short code already in use' }, { status: 409 });
            }
        }

        // Drive Logic
        let finalUrl = url;
        let finalType = type || 'url';

        if (finalType === 'drive') {
            const driveId = getDriveFileId(url);
            if (driveId) {
                // We store the ORIGINAL URL usually, but for "direct download" we might want to store the ID or just generate on fly.
                // Let's store the original, but validate it's a drive URL.
            } else {
                return NextResponse.json({ error: 'Invalid Google Drive URL' }, { status: 400 });
            }
        }

        const link = await Link.create({
            userId: (session.user as any).id,
            originalUrl: finalUrl,
            shortCode,
            type: finalType,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        });

        return NextResponse.json(link, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const links = await Link.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });

        return NextResponse.json(links);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
