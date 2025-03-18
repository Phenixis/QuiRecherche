import { getAllResearchersPID } from "@/lib/db/action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const dbresult = await getAllResearchersPID();

    if (dbresult.length !== 0) {
        return NextResponse.json(dbresult);
    }

    return new NextResponse(JSON.stringify("No researchers found"), {status: 404, statusText: "Not Found"});
}