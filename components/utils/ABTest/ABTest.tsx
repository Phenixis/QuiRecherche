import { headers } from 'next/headers'
import { performance } from 'perf_hooks'
import ABTestClient from './ABTestClient'
import { ABTestEntry, createABTest, getABTest } from './actions';

export default async function ABTest({
    A,
    B,
    testName,
    description,
    location,
}: {
    A: React.ReactElement;
    B: React.ReactElement;
    testName: string;
    description: string
    location: string
}) {
    const userIp = ((await headers()).get('x-forwarded-for') ?? '127.0.0.1').split(':')[3]
    const startTime = performance.now()

    if (!(await getABTest(testName))) {
        await createABTest(testName, description, location)
    }
    
    const id = await ABTestEntry(testName, userIp, startTime)

    return (
        <ABTestClient id={id} A={A} B={B} testName={testName} userIp={userIp} startTime={startTime} />
    )
}