import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function Publication({
  title,
  type,
  doi,
  researchers,
  pages,
  acronym,
  dblp,
  year,
}: {
  title: string;
  type: string;
  researchers: string[];
  doi: string;
  pages: string;
  acronym: string;
  dblp: string;
  year: number;
}) {
  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="group space-x-4">
              <Badge variant={type as "default" | "C&W" | "JOU" | "D&A" | "I&O" | "secondary" | "destructive" | "outline" | null | undefined}>{type}</Badge>
              <span className="">{year}</span>
              {/* <span className="fi fi-jp rounded-[1px] border border-gray-100"></span> */}
              <span className="font-black group-hover:underline">{title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex space-x-2">
            <div className="flex flex-col w-1/2">
              <span className="font-bold mb-2">They've worked on it</span>{" "}
              <div>
                {/* <span className="fi fi-is rounded-[1px]"></span>  */}
                {researchers.map((researcher, index) => (
                  <span key={researcher} className="inline-block">
                    {researcher}
                    {index < researchers.length - 1 && ", "}
                    &nbsp;
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <span className="font-bold mb-2">Other informations</span>
              <p>Pages : {pages}</p>
              <p>Venue : {acronym}</p>
              <div>
                <a href="{doi}" className="text-blue-500 underline">
                  DOI +
                </a>
                <span> </span>
                <a href="{dblp}" className="text-blue-500 underline">
                  DBLP +
                </a>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
