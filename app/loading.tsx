import { ValuesProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import Logo from '@/components/big/logo';

export default function Loading() {
    let userPromise = getUser();
    let appName = process.env.APP_NAME || '[App]';
    let companyName = process.env.COMPANY_NAME || 'Company';

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <ValuesProvider userPromise={userPromise} appName={appName} companyName={companyName}>
                <Logo className="animate-spin" />
            </ValuesProvider>
        </div>
    )
}