export default async function ActivityLogsSkeleton() {
    return (
        <ul className="space-y-4 animate-pulse">
            {
                Array.from({ length: 2 }).map((_, i) => (
                    <li key={i} className="flex items-center space-x-4">
                        <div className="bg-primary/10 rounded-full p-2">
                            <div className="w-5 h-5 text-primary/90" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 w-24 h-4 bg-gray-200 dark:bg-gray-800">
                            </div>
                            <div className="text-xs text-gray-500 w-12 h-2 bg-gray-200 dark:bg-gray-800">
                            </div>
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}