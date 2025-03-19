import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Publication({
	title,
	type,
	researchers,
	year,
	ee,
	universities,
	doi,
	pages,
	acronym,
	dblp,
	number,
	volume,
}: {
	title: string;
	type: string;
	researchers: (
		| string
		| { pid: string; first_name: string; last_name: string, scraped: number }
	)[];
	year: number;
	ee: string;
	universities?: Array<{
		id: number;
		name: string;
	}>;
	doi?: string;
	pages?: string;
	acronym?: string;
	dblp?: string;
	number?: number;
	volume?: number;
}) {
	return (
		<div>
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<div className="group space-x-4">
							<Badge
								variant={
									type as
									| "default"
									| "C&W"
									| "JOU"
									| "D&A"
									| "I&O"
									| "secondary"
									| "destructive"
									| "outline"
									| null
									| undefined
								}
							>
								{type}
							</Badge>
							<span className="">{year}</span>
							{/* <span className="fi fi-jp rounded-[1px] border border-gray-100"></span> */}
							<span className="font-black group-hover:underline">
								{title.length < 100 ? title : title.substring(0, 100) + "..."}
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="flex space-x-2 w-full">
						<div className="flex flex-col w-1/2 gap-4">
							<div>
								<span className="font-bold mb-2">They've worked on it</span>{" "}
								<div>
									{researchers.map((researcher, index) =>
										typeof researcher === "string" ? (
											<span
												key={index}
												className="inline-block"
											>
												{researcher}
												{index < researchers.length - 1 && ", "}
												&nbsp;
											</span>
										) : (
											<span
												key={index}
											>
												<Link
													href={`/researcher/${researcher.pid}`}
													className="text-blue-500 underline"
												>
													{researcher.first_name} {researcher.last_name}
												</Link>
												{index < researchers.length - 1 && ", "}
											</span>
										)
									)}
								</div>
							</div>
							{
								(universities && universities.length != 0) && (
									<div>
										<span className="font-bold mb-2">Universities Involved</span>{" "}
										<div>
											{
												universities && universities.map((university, index) =>
													<span key={index}>
														<Link href={`/university/${university.id}`} className="text-blue-500 underline">
															{university.name}
														</Link>
														{index < universities.length - 1 && ", "}
													</span>
												)}
										</div>
									</div>
								)
							}
						</div>
						<div className="flex flex-col w-1/2">
							<span className="font-bold mb-2">Other informations</span>
							{
								pages && <p>Pages : {pages}</p>
							}
							{
								acronym && <p>Venue : {acronym}</p>
							}
							<div>
								{ee !== "" && (
									<a href={ee} className="text-blue-500 underline" target="_blank">
										More info...
									</a>
								)}
								<span> </span>
								{/* <a href={dblp} className="text-blue-500 underline">
                  DBLP +
                </a> */}
							</div>
						</div>
						{/* {if (type==="JOU") { 
            <div className="flex flex-col w-full">
              <span>Journal informations</span>
              <p>Number: {number}</p>
              <p>Volume: {volume}</p>
            </div>
            }
          } */}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
