import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { ValuesProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: {
        template: '%s | ' + (process.env.APP_NAME || 'NextJs Boilerplate'),
        default: process.env.APP_NAME || 'NextJs Boilerplate',
    },
    description: 'Forget about the fluff, Focus on your genius. Start your brilliant idea with all the fluff already done and build your next startup in days.',
};

export const viewport: Viewport = {
    maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let userPromise = getUser();
    let appName = process.env.APP_NAME || '[App]';
    let companyName = process.env.COMPANY_NAME || 'Company';

    return (
        <html
            lang="en"
            className={`bg-white text-black dark:text-white ${manrope.className}`}
        >
            <body>
                <ValuesProvider userPromise={userPromise} appName={appName} companyName={companyName}>
                    {children}
                </ValuesProvider>
                <Toaster />
            </body>
        </html >
    );
}
