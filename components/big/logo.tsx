'use client';

import Image from "next/image";
import Link from "next/link";
import { useValues } from "@/lib/auth";

export default function Logo({
    title = false,
    className
}: {
    title?: boolean,
    className?: string,
}) {
    const { appName } = useValues();

    return (
        <Link href="/" className={`flex items-center justify-center ${className}`}>
            <Image src="/icon.svg" alt={appName} width={32} height={32} />
            {
                title ? (
                    <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-slate-100">
                        {appName}
                    </h1>
                ) : null
            }
        </Link>
    )
}