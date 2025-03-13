'use client';

import Logo from '@/components/big/logo';
import DarkModeToggle from './darkModeToggler';

export default function Header({
    fullWidth
} : {
    fullWidth?: boolean
}) {
    return (
        <header className="border-b border-gray-200 dark:border-gray-700">
            <div className={`${fullWidth ? "" : "max-w-7xl"} mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center`}>
                <Logo title />
                <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                </div>
            </div>
        </header>
    );
}