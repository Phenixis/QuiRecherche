"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Globe from "globe.gl";

export default function GlobeComponent({ className }: { className?: string }) {
  const globeEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointsData = [
      { lat: 48.7322, lng: -3.4561, value: 10 }, // Lannion
      { lat: 48.8566, lng: 2.3522, value: 50 }, // Paris
      { lat: 45.764, lng: 4.8357, value: 100 }, // Lyon
    ];

    const maxValue = Math.max(...pointsData.map((d) => d.value));

    // Fonction pour interpoler la couleur entre jaune et rouge
    const getColor = (value) => {
      const ratio = value / maxValue; // Normalisation entre 0 et 1
      const r = Math.floor(255); // Rouge constant
      const g = Math.floor(255 * (1 - ratio)); // Moins de vert avec des valeurs élevées
      const b = 0; // Pas de bleu
      return `rgb(${r},${g},${b})`;
    };

    if (globeEl.current && !globeEl.current.hasChildNodes()) {
      const globe = new Globe(globeEl.current)
        .width(globeEl.current?.clientWidth)
        .height(globeEl.current?.clientHeight)
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        )
        .enablePointerInteraction(true)
        .hexBinPointsData(pointsData)
        .hexBinPointLat((d) => d.lat)
        .hexBinPointLng((d) => d.lng)
        .hexBinPointWeight((d) => d.value)
        .hexBinResolution(3) // Plus la résolution est basse, plus les hexagones sont grands
        .hexMargin(0.1)
        .hexTopColor((d) => getColor(d.sumWeight))
        .hexSideColor((d) => getColor(d.sumWeight))
        .hexAltitude((d) => d.sumWeight * 0.01); // La hauteur en fonction de la "value"
    }
  }, []);

  return (
    <div className="h-fit w-fit rounded-md overflow-hidden">
      <div ref={globeEl} className={cn("w-full h-full", className)} />
    </div>
  );
}
