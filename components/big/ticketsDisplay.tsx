import { Ticket } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, Loader } from "lucide-react";
import Link from "next/link";

export default async function TicketsDisplay({ admin, tickets }: { admin?: boolean, tickets?: Ticket[] }) {

    return (
        <div className="flex flex-col gap-2">
            {tickets?.length === 0 ?
                <div>No tickets found</div> : tickets ?
                tickets.map((ticket) => (
                    <Link href={`/settings${admin && '/admin'}/tickets/${ticket.id}`} key={ticket.id} className="flex justify-between px-4 py-2 duration-100 rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground gap-4 cursor-pointer">
                        <div className="flex justify-start items-end gap-4">
                            <p className="text-gray-300 dark:text-gray-700">#{ticket.id}</p>
                            <h2 className="font-bold">{ticket.title}</h2>
                            <p className="font-tight truncate text-gray-500">{ticket.description}</p>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                            {
                                ticket.status === 'open' ? (<Circle className="size-4" />) : ticket.status === 'closed' ? (<Check className="size-4" />) : (<Loader className="size-4" />)
                            }
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </Badge>
                    </Link>
                ))
                :
                Array(3).fill(null).map((_, i) => (
                    <div key={i} className="flex justify-between px-4 py-2 rounded-md border border-input bg-background shadow-sm gap-4 animate-pulse">
                        <div className="flex justify-start items-end gap-4">
                            <p className="text-gray-300 dark:text-gray-700">#XXX</p>
                            <div className="font-bold h-6 w-32 bg-gray-300 dark:bg-gray-700"/>
                            <div className="font-tight h-4 w-96 bg-gray-100 dark:bg-gray-900"/>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                            <Loader className="size-4 animate-spin" />
                        </Badge>
                    </div>
                ))
            }
        </div>
    )

}