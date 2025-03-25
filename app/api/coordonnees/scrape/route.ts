import { getCoordonneesForEachUniversity } from "@/lib/db/action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const dbresult = await getCoordonneesForEachUniversity();

    return NextResponse.json(dbresult);
}