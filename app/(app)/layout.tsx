import { SidebarProvider } from '@/components/ui/sidebar';
import Breadcrumb from '@/components/big/breadcrumb';
import { Sidebar, MobileSidebar } from '@/components/big/sidebar';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-between">
            <SidebarProvider>
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-0 md:p-4">
                    <MobileSidebar />
                    <Breadcrumb />
                    {children}
                </main>
            </SidebarProvider>
        </main>
    )
}