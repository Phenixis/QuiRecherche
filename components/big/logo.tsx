'use client';

import Image from "next/image";
import Link from "next/link";
import { useValues } from "@/lib/auth";
import {
    cn
} from "@/lib/utils";

export default function Logo({
    title = false,
    className,
    size,
}: {
    title?: boolean,
    className?: string,
    size?: number
}) {
    const { appName } = useValues();

    return (
        <Link href="/" className={cn("flex items-center justify-center", className)}>
            <Image src="/icon.svg" alt={appName} width={size || 32} height={size || 32} />
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