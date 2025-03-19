"use client";

import dynamic from "next/dynamic";

const GlobeComponent = dynamic(() => import("@/components/big/globe"), {
  ssr: false,
});

export default function Page() {
  return <GlobeComponent className="min-h-screen min-w-screen" />;
}
