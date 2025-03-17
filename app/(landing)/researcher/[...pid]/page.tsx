import Publication from "@/app/(landing)/test/publication";
import { getAllInfosResearcher } from "@/lib/db/action";

export default async function Page({ params }: { params: { pid: string[] } }) {
	const pid = (await params).pid ? (await params).pid.join("/") : "";
	let data;

	try {
		data = await getAllInfosResearcher(pid);
	} catch (e) {
		return (
			<main className="flex flex-col min-h-screen items-center justify-center p-4">
				<div className="w-full max-w-4xl space-y-4">
					<h1 className="text-2xl font-bold">Oupsi, on a rencontré une erreur de notre côté.</h1>
					<h2>
						Veuillez réessayer plus tard.
					</h2>
				</div>
			</main>
		)
	}

	if (data.researcher.scraped !== 1) { // Si le chercheur n'a pas été scrape == s'il ne vient pas d'IRISA
		return (
			<main className="flex flex-col min-h-screen items-center justify-center p-4">
				<div className="w-full max-w-4xl space-y-4">
					<h1 className="text-2xl font-bold">
						Publication de {data.researcher?.first_name}{" "}
						{data.researcher.last_name}
					</h1>	
					<div>
						{data.papers.map((paper) => (
							<Publication
								key={paper.id}
								title={paper.titre}
								type={paper.typePublication.abbreviation}
								researchers={paper.authors || ["Auteurs introuvables"]}
								doi={paper.doi || ""}
								pages={paper.page_start + "-" + paper.page_end}
								acronym={paper.venue || ""}
								dblp={"test"}
								year={paper.year}
								ee={paper.ee || ""}
							/>
						))}
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className="flex flex-col min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-4xl space-y-4">
				<h1 className="text-2xl font-bold">
					Publication de {data.researcher?.first_name}{" "}
					{data.researcher.last_name}
				</h1>
				<h1 className="text-2xl">{data.universities[0].name}</h1>
				<div>
					{data.papers.map((paper) => (
						<Publication
							key={paper.id}
							title={paper.titre}
							type={paper.typePublication.abbreviation}
							researchers={paper.authors || ["Auteurs introuvables"]}
							doi={paper.doi || ""}
							pages={paper.page_start + "-" + paper.page_end}
							acronym={paper.venue || ""}
							dblp={"test"}
							year={paper.year}
							ee={paper.ee || ""}
						/>
					))}
				</div>
			</div>
		</main>
	);
}
