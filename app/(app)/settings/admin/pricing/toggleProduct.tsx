"use client"

import { Badge } from "@/components/ui/badge"
import { toggleProductStatus } from "./actions"
import { useState } from "react"
import { toast } from "sonner";
import { Loader2 } from "lucide-react"

export default function ToggleProduct({
    productId,
    initialStatus,
}: {
    productId: string
    initialStatus: boolean
}) {
    const [status, setStatus] = useState<boolean>(initialStatus)
    const [isPending, setIsPending] = useState<boolean>(false)

    const handleToggle = async () => {
        setIsPending(true)
        const currentStatus = status

        setStatus(!currentStatus)

        try {
            const result = await toggleProductStatus(productId, currentStatus)

            if (result.success) {
                toast("Product status updated.",
                    {
                        description: `Product is now ${!currentStatus ? "active" : "inactive"}.`,
                    });
            } else {
                toast("Error updating product status.",
                    {
                        description: result.error,
                    })
                setStatus(currentStatus)
            }
        } catch (error: any) {
            toast("Error updating product status.",
                {
                    description: error.message,
                })
            setStatus(currentStatus)
        }
        setIsPending(false)
    }

    return (
        <Badge onClick={handleToggle} variant="outline" className="relative cursor-pointer hover:bg-accent">
            {
                isPending ? (
                    <Loader2 className="size-2 mr-1 animate-spin" />
                ) : null
            }
            {status ? "Active" : "Inactive"}
            <span className="absolute -top-1 -right-1 flex size-3">
                {status ? (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                ) : null}
                <span
                    className={`relative inline-flex size-3 rounded-full ${status ? "bg-sky-500" : "bg-red-500"}`}
                ></span>
            </span>
        </Badge>
    )
}

