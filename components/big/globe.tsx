"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const GlobeComponent = dynamic(() => import("@/components/big/globeComponent"), {
    ssr: false,
});

export default function Globe({
    className,
    data
} : {
    className?: string,
    data: {
        lat: string,
        lng: string,
        name: string,
        ids: number[]
    }[]
}) {
    return <GlobeComponent className={cn("", className)} data={data} />;
}