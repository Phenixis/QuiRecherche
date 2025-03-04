"use client";

import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center justify-center max-w-md space-y-8 p-4 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                            Oops, there has been an error.
                        </h1>
                        <p className="text-base text-gray-500">
                            {error.message}
                        </p>
                        <p className="text-base text-gray-500">
                            Here are some potential solutions:
                        </p>
                        <div className="flex justify-center space-x-4">
                            <div
                                onClick={reset}
                                className="max-w-48 flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Try Again
                            </div>
                            <Link
                                href="/"
                                className="max-w-48 flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                go home
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
