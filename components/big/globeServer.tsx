import Globe from "@/components/big/globe";
import { getInfoGlobe } from "@/lib/db/action";
import { cn } from "@/lib/utils";

export default async function GlobeServer({
    className
} : {
    className: string
}) {
    const data = await getInfoGlobe();

    return <Globe className={cn("", className)} data={data} />;
}
