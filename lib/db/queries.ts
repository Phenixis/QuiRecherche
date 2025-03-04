import { desc, and, eq, isNull, or, isNotNull, count } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, teamMembers, teams, users } from './schema';
import { getSession } from '@/lib/auth/session';

export async function getUser(id?: string) {
  if (!id) {
    const session = await getSession();

    if (!session) {
      return null;
    }

    if (new Date(session.expires) < new Date()) {
      return null;
    }

    const user = await db
      .select()
      .from(users)
      .where(and(
        (session.user.id ? eq(users.id, session.user?.id) : eq(users.email, session.user?.email)),
        isNull(users.deletedAt))
      )
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  } else {
    const user = await db
      .select()
      .from(users)
      .where(and(
        eq(users.id, id),
        isNull(users.deletedAt))
      )
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  }
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: string) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

export async function getUserImages(n: number) {
  const data = await db
    .select({
      name: users.name,
      image: users.image,
    })
    .from(users)
    .where(and(isNull(users.deletedAt), isNotNull(users.image)))
    .limit(n * 2);

  return data
    .map(d => ({ name: d.name, image: d.image }))
    .filter(image => image.name !== null && image.image !== null) as { name: string; image: string }[];
}

export async function getNumberUsers() {
  return await db
    .select({
      count: count(users.id),
    })
    .from(users)
    .where(isNull(users.deletedAt));
}