import { NextRequest, NextResponse } from "next/server";
import { getResearcher, scrapeResearcher } from "@/lib/db/action";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const pid = searchParams.get("pid");

    if (!pid) {
        return new Response(JSON.stringify("No pid provided"), {status: 400, statusText: "Bad Request"});
    }

    const dbresult = await getResearcher(pid);

    if (dbresult.length !== 0) {
        return NextResponse.json(dbresult[0]);
    }

    const scrape_result = await scrapeResearcher(pid);

    if (scrape_result) {
        return NextResponse.json(scrape_result);
    }

    return new Response(JSON.stringify("No researcher found"), {status: 404, statusText: "Not Found"});
}