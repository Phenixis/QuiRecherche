import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTicket, getComments } from "@/components/feedback/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const ticket = await getTicket(parseInt(id));
    const creationTime = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });
    const user = await getUser();
    const comments = await getComments(parseInt(id));

    if (!user) {
        redirect('/login');
    }

    if ((ticket.openedBy !== user.id && ticket.openerEmail !== user.email)) {
        redirect('/settings/ticket');
    }

    // TODO: add the option to reply to a ticket
    // TODO: add the option to change the status of a ticket

    return (
        <section className="flex-1 p-4 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-gray-100">
                    <span className="text-gray-300 dark:text-gray-700">#{ticket.id}</span> {ticket.title}
                </h1>
                <Badge variant="outline">{ticket.status}</Badge>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{user.name} wrote {creationTime} :</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        {ticket.description}
                    </p>
                </CardContent>
            </Card>
            {
                comments.map((comment, index) => (
                    <div key={index}>
                        <hr className="ml-4 my-6 w-12 rotate-90" />
                        <Card key={comment.id} className="mt-4">
                            <CardHeader>
                                <CardTitle>{
                                getUser(comment.userId).then((user) => user?.name)
                                } wrote {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })} :</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    {comment.comment}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ))
            }
        </section>
    )
}