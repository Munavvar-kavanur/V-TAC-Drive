import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
                <TopNavbar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
