import { scrapeHalAndSaveInDB } from "@/lib/db/action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const dbresult = await scrapeHalAndSaveInDB();

    return NextResponse.json(dbresult);
}