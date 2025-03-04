import { redirect } from 'next/navigation';
import { TeamSettings } from './team';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team',
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const teamData = await getTeamForUser(user.id);

  if (!teamData) {
    throw new Error('Team not found');
  }

  return <TeamSettings teamData={teamData} />;
}
