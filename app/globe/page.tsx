"use client";

import dynamic from "next/dynamic";

const GlobeComponent = dynamic(() => import("@/components/big/globe"), {
  ssr: false,
});

export default function Page() {
  return <GlobeComponent className="min-h-screen min-w-screen" data={[
    {
      lat: 48.8566,
      lng: 2.3522,
      name: "Paris",
      ids: [1522, 1723],
    },
    {
      lat: 40.7128,
      lng: -74.006,
      name: "New York",
      ids: [1535, 1536, 1849],
    }
  ]} />;
}
