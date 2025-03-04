import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function CTA() {
    return (
        <a href="/sign-up">
            <Button className="bg-white hover:bg-gray-100 text-black border border-primary shadow shadow-primary/30 rounded-full text-lg p-6 inline-flex items-center justify-center group/CTA gap-1">
                Start to
                <span className="relative overflow-hidden">
                    <span className="relative block before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-full before:bg-black before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-300 group-hover/CTA:before:scale-x-100">
                        build now
                    </span>
                </span>
                <ArrowRight className="ml-2 h-5 w-5 -translate-x-1 group-hover/CTA:translate-x-1 duration-300" />
            </Button>
        </a>
    );
}