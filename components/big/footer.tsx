'use client';

import Logo from '@/components/big/logo';
import Link from 'next/link';
import { useValues } from '@/lib/auth';

export default function Footer({
    fullWidth
} : {
    fullWidth?: boolean
}) {
    const { appName } = useValues();

    const personnalLinks = [
        { title: 'Wisecart', href: 'http://wisecart.app/' },
        { title: 'Boilerplate', href: 'https://boilerplate.maximeduhamel.com/' },
        { title: 'Blog', href: 'http://maximeduhamel.com/' },
    ]

    return (
        <footer className="border-t border-gray-200 dark:border-gray-700">
            <div className={`${fullWidth ? "" : "max-w-7xl"} mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col justify-between items-center space-y-4`}>
                <section className="flex justify-between items-center w-full">
                    <Logo />
                    <p className="text-gray-500"><span className="font-bold">{appName}</span> By Maxime Duhamel and Antoine Toullec</p>
                    <p className="text-gray-500">Copyright © {new Date().getFullYear()} - All right reserved</p>
                </section>
            </div>
        </footer>
    );
}