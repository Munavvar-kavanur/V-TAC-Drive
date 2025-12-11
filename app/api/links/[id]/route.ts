import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Link from '@/models/Link';
import Click from '@/models/Click';
import { isValidUrl } from '@/lib/driveUtils';

// Helper to validate session
async function getSessionUser() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;
    return session.user;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const { url, shortCode, type, expiresAt, isActive } = await req.json();

        // Validations
        if (url && !isValidUrl(url)) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        await dbConnect();

        // Check if shortCode is taken by another link
        if (shortCode) {
            const existing = await Link.findOne({ shortCode, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ error: 'Short code already in use' }, { status: 409 });
            }
        }

        const link = await Link.findOneAndUpdate(
            { _id: id, userId: (user as any).id },
            {
                $set: {
                    ...(url && { originalUrl: url }),
                    ...(shortCode && { shortCode }),
                    ...(type && { type }),
                    ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
                    ...(isActive !== undefined && { isActive })
                }
            },
            { new: true }
        );

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json(link);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;

        await dbConnect();

        // Use findOneAndDelete to ensure user owns the link
        const link = await Link.findOneAndDelete({ _id: id, userId: (user as any).id });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // Clean up analytics
        await Click.deleteMany({ linkId: id });

        return NextResponse.json({ message: 'Link deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
