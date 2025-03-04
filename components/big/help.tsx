import { CircleHelp } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export default function Help({
    text
} : {
    text: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="cursor-default">
                    <CircleHelp className="size-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {text}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    );
}