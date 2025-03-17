import Search from "@/components/big/search"
import Logo from "@/components/big/logo"

export default async function HomePage() {

    return (
        <main className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-7xl flex flex-col items-center justify-center h-full">
                <Logo size={98} className="mb-4" />
                <Search className="max-w-3xl" placeholder="Search for a researcher or a paper" />
            </div>
        </main>
    )
}
