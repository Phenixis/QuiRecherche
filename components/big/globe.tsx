"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Globe from "globe.gl";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePublication } from "@/hooks/use-publication";
import type { Publication as TypePublication } from "@/lib/db/action";
import Publication from "../publication";

interface PointData {
	lat: number;
	lng: number;
	name: string;
	ids: number[];
}

// TODO: Afficher les articles selon les ids dans IDS
// TODO: faire la fonction qui renvoie les coordonnées, le nom de la ville et les identifiants liés à la ville
// TODO: stocker les données de publication dans publicationS

export default function GlobeComponent({
	className,
	data,
	autoRotate = true,
	autoRotateSpeed = 0.3
}: {
	data: PointData[],
	className?: string,
	autoRotate?: boolean,
	autoRotateSpeed?: number
}) {
	const globeEl = useRef<HTMLDivElement>(null);
	const [pointClicked, setPointClicked] = useState<PointData | null>(null);
	const [publicationToFetchId, setPublicationToFetchId] = useState<
		number | null
	>(null);
	const [publications, setPublications] = useState<TypePublication[]>([]);
	const [isOpened, setIsOpened] = useState(false);
	const { publication, isLoading, isError } =
		usePublication(publicationToFetchId);

	useEffect(() => {

		const maxValue = Math.max(...data.map((d) => d.ids.length));

		// Fonction pour interpoler la couleur entre jaune et rouge
		const getColor = (value: number): string => {
			const ratio = value / maxValue; // Normalisation entre 0 et 1
			const b = Math.floor(255); // Rouge constant
			const r = Math.floor(255 * (1 - ratio)); // Moins de vert avec des valeurs élevées
			const g = 0; // Pas de bleu
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
				.hexBinPointsData(data)
				.hexBinPointLat((d: object) => (d as PointData).lat)
				.hexBinPointLng((d: object) => (d as PointData).lng)
				.hexBinPointWeight((d: object) => (d as PointData).ids.length)
				.hexBinResolution(3) // Plus la résolution est basse, plus les hexagones sont grands
				.hexMargin(0.1)
				.hexTopColor((d) => getColor(d.sumWeight))
				.hexSideColor((d) => getColor(d.sumWeight))
				.hexAltitude((d) => d.sumWeight / maxValue) // La hauteur en fonction de la "value"
				.onHexClick(
					(
						hex: any,
						event: MouseEvent,
						coords: { lat: number; lng: number; altitude: number }
					) => {
						setPointClicked(hex.points[0]);
						setIsOpened(true);
					}
				);

			globe.controls().autoRotate = autoRotate;
			globe.controls().autoRotateSpeed = autoRotateSpeed;
		}
	}, []);

	useEffect(() => {
		if (publication) {
			setPublications([...publications, publication]);
			if (pointClicked && publicationToFetchId) {
				setPublicationToFetchId(
					pointClicked.ids.length - 1 >=
						pointClicked.ids.indexOf(publicationToFetchId)
						? pointClicked.ids[
						pointClicked.ids.indexOf(publicationToFetchId) + 1
						]
						: null
				);
			}
		}
	}, [publication]);

	useEffect(() => {
		setPublications([]);
		if (pointClicked) {
			setPublicationToFetchId(pointClicked.ids[0]);
		}
	}, [pointClicked]);

	return (
		<div className="h-fit w-fit rounded-md overflow-hidden">
			<div ref={globeEl} className={cn("w-full h-full", className)} />
			<Card
				className={`${!isOpened && "hidden"
					} absolute top-4 left-4 w-full max-w-96`}
			>
				<CardHeader className="flex justify-between items-center flex-row w-full py-4">
					<CardTitle>{pointClicked?.name} - {pointClicked?.ids?.length ?? 0} article{(pointClicked?.ids?.length ?? 0) > 1 && "s"}</CardTitle>
					<div
						onClick={() => setIsOpened(false)}
						className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"
					>
						X
					</div>
				</CardHeader>
				<CardContent>
					{publications.map((publication) => (
						<Publication
							key={publication.id}
							title={publication.titre}
							type={publication.typePublication.abbreviation}
							researchers={publication.authors || ["Auteurs introuvables"]}
							universities={publication.universities || undefined}
							doi={publication.doi || ""}
							pages={
								publication.page_start != null && publication.page_end != null
									? publication.page_start + "-" + publication.page_end
									: undefined
							}
							acronym={publication.venue || undefined}
							dblp={publication.dblp || undefined}
							year={publication.year}
							ee={publication.ee || ""}
						/>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
