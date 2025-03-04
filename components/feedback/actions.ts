"use server";

import { desc, and, eq, isNull, or, isNotNull, count } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { ticket, ticketComment, Ticket, NewTicket, TicketStatus } from '@/lib/db/schema';
import { ActionState } from '@/lib/auth/middleware';

export async function sendFeedback(state: ActionState, data: FormData) {

    const newTicket: NewTicket = {
        title: data.get('title') as string,
        description: data.get('description') as string,
        openedBy: data.get('userId') as string,
        openerEmail: data.get('email') as string,
        status: TicketStatus.OPEN,
    };

    const result = await db.insert(ticket).values(newTicket);

    return { success: 'Feedback sent successfully. You can now find it in the Ticket section, in your settings.' };
}

export async function getFeedbacks(userId?: string, userEmail?: string) {
    if (!userId && !userEmail) {
        return [] as Ticket[];
    }

    const feedbacks: Ticket[] = await db
        .select()
        .from(ticket)
        .where(or(eq(ticket.openedBy, userId || ''), eq(ticket.openerEmail, userEmail || '')))
        .orderBy(desc(ticket.createdAt));

    return feedbacks;
}

export async function getAllFeedbacks() {
    const feedbacks = await db
        .select()
        .from(ticket)
        .orderBy(desc(ticket.createdAt));

    return feedbacks;
}

export async function getTicket(id: number) {
    const feedback = await db
        .select()
        .from(ticket)
        .where(eq(ticket.id, id));

    return feedback[0];
}

export async function getComments(id: number) {
    const comments = await db
        .select()
        .from(ticketComment)
        .where(eq(ticketComment.ticketId, id))
        .orderBy(desc(ticketComment.createdAt));

    return comments;
}