import { getUserImages, getNumberUsers } from "@/lib/db/queries"
import AvatarsDisplay from "./avatarsDisplay";

export default async function Avatars() {
    const images = await getUserImages(5);
    const numberUsers = await getNumberUsers();

    return (
        <AvatarsDisplay images={images} numberUsers={numberUsers[0].count} />
    )
}