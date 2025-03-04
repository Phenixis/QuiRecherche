'use client';

import { startTransition, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useValues } from '@/lib/auth';
import { updateAccount } from '@/app/(login)/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UploadIcon } from '@/components/ui/upload';

type ActionState = {
    error?: string;
    success?: string;
};

export default function GeneralSettings() {
    const user = useValues().user;
    if (!user) return null;

    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        updateAccount,
        { error: '', success: '' }
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // If you call the Server Action directly, it will automatically
        // reset the form. We don't want that here, because we want to keep the
        // client-side values in the inputs. So instead, we use an event handler
        // which calls the action. You must wrap direct calls with startTranstion.
        // When you use the `action` prop it automatically handles that for you.
        // Another option here is to persist the values to local storage. I might
        // explore alternative options.
        startTransition(() => {
            formAction(new FormData(event.currentTarget));
        });
    };

    return (
        <section className="flex-1 p-4 lg:p-8">
            <h1 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6">
                General
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="relative cursor-pointer size-16 mb-4 rounded-full overflow-hidden">
                                <Avatar className="size-16">
                                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                                    <AvatarFallback>
                                        {
                                            (user.name ? user.name : user.email)
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                        }
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50">
                                    <UploadIcon className="text-white"/>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Change Avatar</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Oops, you discovered a feature in development!
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>

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
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                defaultValue={user?.email || ''}
                                required
                            />
                        </div>
                        {state.error && (
                            <p className="text-red-500 text-sm">{state.error}</p>
                        )}
                        {state.success && (
                            <p className="text-green-500 text-sm">{state.success}</p>
                        )}
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
