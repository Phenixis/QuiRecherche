import { getFeedbacks, getAllFeedbacks } from "@/components/feedback/actions";
import { getUser } from "@/lib/db/queries";
import TicketsDisplay from "./ticketsDisplay";

export default async function Tickets({
    admin
} : {
    admin?: boolean
}) {
    const user = await getUser();
    if (!user) {
        return <div>User not found</div>;
    }

    const feedbacks = admin ? await getAllFeedbacks() : await getFeedbacks(user?.id || '', user?.email || '');

    return (
        <TicketsDisplay admin={admin} tickets={feedbacks} />
    )
}