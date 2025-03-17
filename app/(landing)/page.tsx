import Search from "@/components/big/search"
import Logo from "@/components/big/logo"
import ResultatsSearch from "@/components/big/resultatsSearch"

export default async function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-7xl flex flex-col items-center justify-center h-full gap-2">
                <Logo size={98} className="mb-4" />
                <h1 className="text-4xl font-bold text-center mb-4">Search a Researcher</h1>
                <Search className="max-w-3xl" placeholder="Search for a researcher or a paper" />
                <ResultatsSearch />
            </div>
        </main>
    )
}
