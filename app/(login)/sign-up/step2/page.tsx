'use client';

import { startTransition, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useValues } from '@/lib/auth';
import { updateAccount } from '@/app/(login)/actions';

type ActionState = {
    error?: string;
    success?: string;
};

export default function Step2Page() {
    const { user, appName } = useValues();

    if (user?.name) {
        window.location.href = '/dashboard';
    }

    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        updateAccount,
        { error: '', success: '' }
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        startTransition(() => {
            formAction(new FormData(event.currentTarget));
        });
    };

    return (
        <div className="min-h-[100dvh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <article>
                <Card>
                    <CardHeader>
                        <CardTitle>Tell us more about yourself</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    defaultValue={user?.name || ''}
                                    required
                                />
                            </div>
                            <input
                                className='hidden'
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                defaultValue={user?.email || ''}
                                required
                            />
                            <input
                                className='hidden'
                                id="context"
                                name="context"
                                type="context"
                                defaultValue='step2'
                                required
                            />
                            {state.error && (
                                <p className="text-red-500 text-sm">{state.error}</p>
                            )}
                            {state.success && (
                                <p className="text-green-500 text-sm">{state.success}</p>
                            )}
                            <Button
                                type="submit"
                                className="bg-primary mx-auto hover:bg-primary/90 text-white"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Start using ' + appName + ' now'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </article>
        </div >
    );
}
