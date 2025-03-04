'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import Logo from '@/components/big/logo';
import { signIn as googleSignIn } from "next-auth/react"

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const priceId = searchParams.get('priceId');
    const inviteId = searchParams.get('inviteId');
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        mode === 'signin' ? signIn : signUp,
        { error: '' }
    );

    return (
        <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Logo />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    {mode === 'signin'
                        ? 'Sign in to your account'
                        : 'Create your account'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">

                <div className="mt-6">
                    <Button
                        className="w-full flex justify-center items-center py-2 px-4 border rounded-full shadow-sm text-sm font-medium"
                        variant={"outline"}
                        onClick={() => googleSignIn("google", { redirectTo: "/dashboard" })}
                    >
                        <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" className="h-6 w-6 mr-2" alt="Google Logo" />
                        Sign In with Google
                    </Button>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">
                                    Rather use credentials?
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="space-y-6" action={formAction}>
                    <input type="hidden" name="redirect" value={redirect || ''} />
                    <input type="hidden" name="priceId" value={priceId || ''} />
                    <input type="hidden" name="inviteId" value={inviteId || ''} />
                    <div>
                        <Label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </Label>
                        <div className="mt-1">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                maxLength={50}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <Label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </Label>
                        <div className="mt-1">
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={
                                    mode === 'signin' ? 'current-password' : 'new-password'
                                }
                                required
                                minLength={8}
                                maxLength={100}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm">{state.error}</div>
                    )}

                    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:space-x-2">
                        <Button
                            type="submit"
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary/90 hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary basis-3/5"
                            disabled={pending}
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Loading...
                                </>
                            ) : mode === 'signin' ? (
                                'Sign in'
                            ) : (
                                'Sign up'
                            )}
                        </Button>
                        <Link
                            href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${redirect ? `?redirect=${redirect}` : ''
                                }${priceId ? `&priceId=${priceId}` : ''}`}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary basis-2/5"
                        >
                            {mode === 'signin'
                                ? 'Create an account'
                                : 'Sign in to existing account'}
                        </Link>
                    </div>

                    <div className="flex items-center justify-center">
                        <Link
                            href={`/login`}
                            className="text-sm text-gray-600 hover:text-gray-900 hover:dark:text-gray-100 hover:underline"
                        >
                            Try our new login flow
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
