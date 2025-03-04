import { Login } from '../login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return <Login mode="signin" />;
}
