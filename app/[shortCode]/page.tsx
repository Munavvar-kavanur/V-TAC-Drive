import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Link from '@/models/Link';
import Click from '@/models/Click';
import { generateDirectDownloadUrl, getDriveFileId } from '@/lib/driveUtils';
import RedirectCard from '@/components/RedirectCard';

interface PageProps {
    params: Promise<{ shortCode: string }>;
}

export default async function ShortLinkPage({ params }: PageProps) {
    const { shortCode } = await params;

    await dbConnect();

    const link = await Link.findOne({ shortCode });

    if (!link) {
        notFound();
    }

    if (!link.isActive) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-400">
                <div className="glass-panel p-8 rounded-xl border border-red-500/20 text-center">
                    <h1 className="text-xl font-bold text-red-400 mb-2">Link Disabled</h1>
                    <p>This link has been deactivated by the owner.</p>
                </div>
            </div>
        );
    }

    if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-400">
                <div className="glass-panel p-8 rounded-xl border border-red-500/20 text-center">
                    <h1 className="text-xl font-bold text-red-400 mb-2">Link Expired</h1>
                    <p>This link is no longer valid.</p>
                </div>
            </div>
        );
    }

    // Analytics logging
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const ip = headersList.get('x-forwarded-for') || 'Unknown';

    // We await here to ensure it writes before rendering. 
    // Next.js caching might need attention if this page becomes static, 
    // but for dynamic dynamic routes it should be fine.
    await Promise.all([
        Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } }),
        Click.create({
            linkId: link._id,
            userAgent,
            ipHash: ip,
        })
    ]);

    let destinationUrl = link.originalUrl;

    if (link.type === 'drive') {
        const driveId = getDriveFileId(link.originalUrl);
        if (driveId) {
            destinationUrl = generateDirectDownloadUrl(driveId);
        }
    }

    return <RedirectCard destinationUrl={destinationUrl} type={link.type} />;
}
