import { z } from 'zod';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import { redirect } from 'next/navigation';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any; // This allows for additional properties
};