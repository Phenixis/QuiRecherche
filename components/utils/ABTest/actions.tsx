"use server";

import { desc, and, eq, isNull, or, isNotNull, count } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { NewABTestResult, ABTestResult, ABTest } from '@/lib/db/schema';

export async function createABTest(name: string, description: string, location: string) {
    const result = await db
        .insert(ABTest)
        .values({
            name: name,
            description: description,
            location: location
        })
        .returning({
            name: ABTest.name
        });

    return result[0].name;
}

export async function getABTest(name: string) {
    const result = await db
        .select()
        .from(ABTest)
        .where(eq(ABTest.name, name))
        .limit(1);

    return result.length > 0 ? result[0] : null;
}

export async function ABTestEntry(testName: string, userIp: string, startTime: number) {
    const data = {
        testId: testName,
        userIP: userIp,
        variant: "A", // or any default value
        startingTime: new Date(startTime),
        endingTime: new Date(startTime), // or any default value
    } as NewABTestResult

    const result = await db
        .insert(ABTestResult)
        .values(data)
        .returning({
            id: ABTestResult.id
        });

    return result[0].id;
}

export async function stillIn(id: number, variant: string) {
    const result = await db
        .update(ABTestResult)
        .set({
            endingTime: new Date(performance.now()),
            variant: variant
        })
        .where(eq(ABTestResult.id, id));
}