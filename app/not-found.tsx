import Link from 'next/link';
import Logo from '@/components/big/logo';

export default async function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center max-w-md space-y-8 p-4 text-center">
        <Logo />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-base text-gray-500">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <p className="text-base text-gray-500">
          Here are some helpful links instead:
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="max-w-48 flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Home
          </Link>
          <Link
            href="/sign-in"
            className="max-w-48 flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="max-w-48 flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
