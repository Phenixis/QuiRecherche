import Header from '@/components/big/header';
import Footer from '@/components/big/footer';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-between">
            <Header />
            {children}
            <Footer />
        </main>
    )
}