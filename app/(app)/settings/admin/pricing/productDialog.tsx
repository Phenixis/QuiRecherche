"use client";

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { addProductAndDefaultPrice, editProductAndDefaultPrice } from './actions';
import { ActionState } from "@/lib/auth/middleware";
import { useActionState, useState, useEffect } from 'react';
import { Check, Loader2, Pen, Plus } from 'lucide-react';
import { toast } from "sonner";
import Help from '@/components/big/help';
import { Checkbox } from '@/components/ui/checkbox';

export default function ProductDialog({
    productId,
    priceId,
    name,
    description,
    currency,
    price,
    interval,
    trial_period_days,
}: {
    productId?: string;
    priceId?: string;
    name?: string;
    description?: string | null;
    currency?: string;
    price?: number;
    interval?: string;
    trial_period_days?: number;
}) {
    let action = "add";
    if (name || description || currency || price || interval || trial_period_days) {
        action = "edit";
    }
    const [isOpen, setIsOpen] = useState(false);
    const [formState, formAction, isformPending] = useActionState<ActionState, FormData>(
        async (state, formData) => {
            let result = null;
            if (action === "add") {
                result = await addProductAndDefaultPrice(state, formData);
            } else {
                result = await editProductAndDefaultPrice(state, formData);
            }

            setIsOpen(false);

            if (result.success) {
                window.location.reload();
            }

            return result;
        },
        { error: '', success: '' }
    );

    useEffect(() => {
        if (formState.error) {
            toast(`Error`,
                {
                    description: formState.error,
                });
        } else if (formState.success) {
            toast("Success",
                {
                    description: formState.success,
                });
        }
    }, [formState]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {
                action === "add" ? (
                    <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground shadow hover:bg-primary/80 dark:hover:bg-primary/80">
                        Add Product
                    </DialogTrigger>
                ) : (
                    <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                        Edit Product
                    </DialogTrigger>
                )
            }
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {
                            action === "add" ? "Add Product" : "Edit Product"
                        }
                    </DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <form action={formAction} className="gap-4 flex flex-col">
                    {
                        action === "edit" && (
                            <>
                                <input className="hidden" name="productId" value={productId} readOnly />
                                <input className="hidden" name="priceId" value={priceId} readOnly />
                            </>
                        )
                    }
                    <div className="flex flex-col-reverse gap-1">
                        <Input className="peer" name="name" type="text" defaultValue={name || ""} required />
                        <Label>
                            Product Name
                        </Label>
                    </div>
                    <div className="flex flex-col-reverse gap-1">
                        <Textarea className="peer" name="description" defaultValue={description || ""} />
                        <div className="flex items-center space-x-1">
                            <Label>
                                Description
                            </Label>
                            <Help text="Write a feature per line, these features will be displayed one by one on the pricing card." />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-end gap-2 w-full">
                            <div className="flex flex-col-reverse gap-1 w-full">
                                <Input className="peer" type="number" min={0} name="price" defaultValue={price ? (price / 100) : 0} required />
                                <Label>
                                    Price
                                </Label>
                            </div>
                            <div className="flex flex-col-reverse gap-1">
                                <Select defaultValue={currency ? currency : "usd"} name="currency" required>
                                    <SelectTrigger className="max-w-full">
                                        <SelectValue placeholder="currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="eur">€</SelectItem>
                                        <SelectItem value="usd">$</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Label>
                                    Currency
                                    {
                                        action === "add" && (
                                            <span className="text-red-700">*</span>
                                        )
                                    }
                                </Label>
                            </div>
                            <div className="flex flex-col-reverse gap-1">
                                <Select defaultValue={interval ? interval : "one-time"} name="interval">
                                    <SelectTrigger className="max-w-full">
                                        <SelectValue placeholder="interval" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="one-time">One-time</SelectItem>
                                        <SelectItem value="day">Day</SelectItem>
                                        <SelectItem value="week">Week</SelectItem>
                                        <SelectItem value="month">Month</SelectItem>
                                        <SelectItem value="year">Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Label>
                                    Interval
                                </Label>
                            </div>
                            <div className="flex flex-col-reverse gap-1">
                                <Input className="peer" type="number" min={0} name="trial_period_days" defaultValue={trial_period_days ? trial_period_days : 0} />
                                <Label>
                                    Days of trial
                                </Label>
                            </div>
                        </div>
                        {
                            action === "edit" && (
                                <div className="flex items-center space-x-1">
                                    <Checkbox name="migrate" id="migrate" />
                                    <Label htmlFor='migrate'>
                                        Do you want to migrate all the subscriptions to the new price?
                                    </Label>
                                </div>
                            )
                        }
                    </div>
                    <Button type="submit" className={`${isformPending ? 'bg-primary/80 dark:bg-primary/80' : ""}`}>
                        {
                            isformPending ?
                                <Loader2 className="animate-spin w-5 h-5 mr-2" /> : (
                                    action === "add" ? <Plus className="w-5 h-5 mr-2" /> : <Pen className="w-5 h-5 mr-2" />
                                )
                        }
                        {
                            action === "add" ? "Add Product" : "Edit Product"
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}