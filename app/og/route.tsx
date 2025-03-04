import { ImageResponse } from 'next/og'

export function GET(request: Request) {
    let url = new URL(request.url)
    let title = url.searchParams.get('title') || 'Next.js Portfolio Starter'
    let appName = process.env.APP_NAME || "App Name"
    let companyName = process.env.COMPANY_NAME || "App Name"

    return new ImageResponse(
        (
            <div tw="flex flex-col w-full h-full items-center justify-center bg-blue-300 p-4">
                <h1 tw="text-7xl">
                    {appName}
                </h1>
                <h2 tw="text-lg">
                    {companyName}
                </h2>
                <p tw="text-3xl">
                    Start your brilliant idea, with all the fluff already done
                </p>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
