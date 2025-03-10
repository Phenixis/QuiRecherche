"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Globe from "globe.gl";

export default function GlobeComponent({ className }: { className?: string }) {
  const globeEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (globeEl.current && !globeEl.current.hasChildNodes()) {
      const globe = new Globe(globeEl.current)
        .width(globeEl.current?.clientWidth)
        .height(globeEl.current?.clientHeight)
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg");

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div className="h-fit w-fit rounded-md overflow-hidden">
      <div ref={globeEl} className={cn("w-full h-full ", className)} />
    </div>
  );
}
