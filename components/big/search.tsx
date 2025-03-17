"use client";

import { useDebouncedCallback } from 'use-debounce';
import {
    Input
} from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
    cn
} from "@/lib/utils";

export default function Search({
    className,
    placeholder
}: {
    className: string,
    placeholder: string
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <Input
            className={cn('flex items-center', className)}
            placeholder={placeholder}
            defaultValue={searchParams.get('query') || ''}
            onChange={(e) => handleSearch(e.target.value)}
        />
    );
}