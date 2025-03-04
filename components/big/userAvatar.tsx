'use client';

import { useRouter } from 'next/navigation';
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Settings, LogOut } from "lucide-react";
import { signOut } from '@/app/(login)/actions';
import { User } from '@/lib/db/schema';
import Link from 'next/link';

export default function UserAvatar({
    isMenuOpen,
    setIsMenuOpen,
    user,
    setUser,
} : {
    isMenuOpen: boolean,
    setIsMenuOpen: (open: boolean) => any,
    user: User,
    setUser: (user: User | null) => any,
}) {
    const router = useRouter();

    async function handleSignOut() {
        setUser(null);
        await signOut();
        router.push('/');
    }
    return (

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
                <div className={`flex space-x-2 items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}>
                    <Avatar className="cursor-pointer size-6 lg:size-8">
                        <AvatarImage src={user.image || ''} alt={user.name || ''} />
                        <AvatarFallback>
                            {
                                (user.name ? user.name : user.email)
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                            }
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/dashboard" className="flex w-full items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/settings" className="flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <form action={handleSignOut} className="w-full">
                    <button type="submit" className="flex w-full">
                        <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}