'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Settings } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useValues } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import Logo from '@/components/big/logo';
import DarkModeToggle from './darkModeToggler';
import Feedback from '@/components/feedback/feedback';
import UserAvatar from './userAvatar';

export default function Header({
    fullWidth
} : {
    fullWidth?: boolean
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, setUser } = useValues();
    const router = useRouter();

    async function handleSignOut() {
        setUser(null);
        await signOut();
        router.push('/');
    }

    return (
        <header className="border-b border-gray-200 dark:border-gray-700">
            <div className={`${fullWidth ? "" : "max-w-7xl"} mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center`}>
                <Logo title />
                <Feedback />
                <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                    {user ? (
                        <UserAvatar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} setUser={setUser} />
                    ) : (
                        <>
                            <Link
                                href="/pricing"
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:dark:text-gray-500"
                            >
                                Pricing
                            </Link>
                            <Button
                                asChild
                                className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
                            >
                                <Link href="/sign-up">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}