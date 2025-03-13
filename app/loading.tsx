import { ValuesProvider } from '@/lib/auth';
import Logo from '@/components/big/logo';

export default function Loading() {
    let appName = process.env.APP_NAME || '[App]';
    let companyName = process.env.COMPANY_NAME || 'Company';

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <ValuesProvider appName={appName} companyName={companyName}>
                <Logo className="animate-spin" />
            </ValuesProvider>
        </div>
    )
}