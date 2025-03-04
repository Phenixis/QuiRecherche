"use client";

import { usePathname, redirect } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity, Ticket, Slash, Menu, ChevronDown, SettingsIcon, Home, LayoutDashboard, DollarSign } from 'lucide-react';
import { useValues } from '@/lib/auth';
import Feedback from '@/components/feedback/feedback';
import DarkModeToggle from '@/components/big/darkModeToggler';
import {
    Sidebar as SidebarComponent,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    ChevronsLeftRightIcon
} from '@/components/ui/chevrons-left-right';
import {
    ChevronsRightLeftIcon
} from '@/components/ui/chevrons-right-left';
import Logo from '@/components/big/logo';
import UserAvatar from '@/components/big/userAvatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function MobileSidebar() {
    const pathname = usePathname();
    const { user, setUser } = useValues();
    if (!user) {
        redirect('/login');
    }

    const [isMenuTelOpen, setIsMenuTelOpen] = useState(false);
    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex justify-between items-center w-full px-4 py-1 md:hidden">
            <Button
                variant={'ghost'}
                className={`p-2`}
                onClick={toggleSidebar}
            >
                <Menu />
            </Button>
            <Logo title />
            <div className="flex items-center">
                <DarkModeToggle />
                <Feedback />
                <UserAvatar isMenuOpen={isMenuTelOpen} setIsMenuOpen={setIsMenuTelOpen} user={user} setUser={setUser} />
            </div>
        </header>
    )
}

export function Sidebar() {
    const pathname = usePathname();
    const { user, setUser } = useValues();

    if (!user) {
        redirect('/login');
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { open, setOpen, toggleSidebar } = useSidebar();

    const dashboardNavItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]

    const settingsNavItems = [
        { href: '/settings', icon: Settings, label: 'General' },
        { href: '/settings/team', icon: Users, label: 'Team' },
        { href: '/settings/activity', icon: Activity, label: 'Activity' },
        { href: '/settings/security', icon: Shield, label: 'Security' },
        { href: '/settings/tickets', icon: Ticket, label: 'Tickets' },
    ];

    const adminNavItems = [
        { href: '/settings/admin', icon: SettingsIcon, label: 'General' },
        { href: '/settings/admin/pricing', icon: DollarSign, label: 'Pricing' },
        { href: '/settings/admin/tickets', icon: Ticket, label: 'Tickets' },
    ]

    const navItems : Record<string, { href: string, icon: any, label: string }[]> = {
        'Dashboard': dashboardNavItems,
        'Settings': settingsNavItems,
    }

    // Add admin nav items if user is admin
    if (user.role === 'admin') {
        navItems['Admin'] = adminNavItems;
    }

    let active = "/"
    for (const navSection in navItems) {
        for (const navItem of navItems[navSection]) {
            if (pathname.includes(navItem.href) && navItem.href.length > active.length) {
                active = navItem.href;
            }
        }
    }

    return (
        <SidebarComponent collapsible='icon'>
            <SidebarContent className="gap-0">
                <SidebarHeader>
                    <Logo title={open} className="py-4" />
                </SidebarHeader>
                {
                    Object.entries(navItems).map(([key, item]) => {
                        return (
                            <Collapsible defaultOpen key={key} className="group/collapsible">
                                <SidebarGroup>
                                    <SidebarGroupLabel asChild>
                                        <CollapsibleTrigger>
                                            {key}
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                    </SidebarGroupLabel>
                                    <CollapsibleContent>
                                        <nav className="h-full overflow-y-auto p-2">
                                            {item.map((subItem) => (
                                                <Link key={subItem.href} href={subItem.href} passHref>
                                                    <Button
                                                        variant={subItem.href === active ? 'secondary' : 'ghost'}
                                                        className={`p-2 mt-1 w-full justify-start`}
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <subItem.icon className="size-4" />
                                                        {open && subItem.label}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </nav>
                                    </CollapsibleContent>
                                </SidebarGroup>
                            </Collapsible>
                        )
                    })
                }
            </SidebarContent>
            <SidebarFooter className={`${open && 'flex-row'} w-full justify-between items-center hidden md:flex`}>
                <DarkModeToggle />
                <Feedback />
                <UserAvatar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} setUser={setUser} />
                <Button
                    variant={'ghost'}
                    className={`p-2 justify-start`}
                    onClick={toggleSidebar}
                >
                    {open ?
                        <ChevronsRightLeftIcon />
                        : <ChevronsLeftRightIcon />}
                </Button>
            </SidebarFooter>
        </SidebarComponent>
    )
}