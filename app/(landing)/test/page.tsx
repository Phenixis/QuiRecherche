"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Publication from "./publication";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import GlobeComponent from "@/components/big/globe";
export default function Page() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-4">
        <Publication
          title="Multi-Dimensional Exploration of Media Collection Metadata"
          type="JOU"
          researchers={"Omar Shahbaz Khan, Aaron Duane, Hariz Hasnan, Noé Le Blavec, Pierre Ouvrard, Johan Verdon, Laurent d'Orazio, Constance Thierry, Björn Þór Jónsson".split(
            ", "
          )}
          doi="https://doi.org/10.1145/3474085.3475567"
          pages="1-4"
          acronym="ACM"
          year={2021}
          dblp="https://dblp.org/rec/conf/mm/KhanDHBLVOJOT21"
          ee="https://example.com"
        />
        <Publication
          title="Multi-Dimensional Exploration of Media Collection Metadata"
          type="C&W"
          researchers={"Omar Shahbaz Khan, Aaron Duane, Hariz Hasnan, Noé Le Blavec, Pierre Ouvrard, Johan Verdon, Laurent d'Orazio, Constance Thierry, Björn Þór Jónsson".split(
            ", "
          )}
          doi="https://doi.org/10.1145/3474085.3475567"
          pages="1-4"
          acronym="ACM"
          year={2021}
          dblp="https://dblp.org/rec/conf/mm/KhanDHBLVOJOT21"
          ee="https://example.com"
        />
        <GlobeComponent className="max-h-96 max-w-96" />
      </div>
    </main>
  );
}
