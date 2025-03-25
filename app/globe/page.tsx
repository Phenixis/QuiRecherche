import Globe from "@/components/big/globe";
import { getInfoGlobe } from "@/lib/db/action";

export default async function Page() {
	const data = await getInfoGlobe();

	return <Globe className="min-h-screen min-w-screen" data={data} />;
}
