'use client';

import { stillIn } from './actions'
import { useEffect, useState } from 'react';

export default function ABTestClient({
    id,
    A,
    B,
}: {
    id: number,
    A: React.ReactElement;
    B: React.ReactElement;
    testName: string;
    userIp: string;
    startTime: number;
}) {
    const [variant, setVariant] = useState('A');
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVariant(Math.random() < 0.5 ? 'A' : 'B');

        setInterval(() => {
            if (visible && document.visibilityState === 'visible') {
                stillIn(id, variant);
            }
        }, 1000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setVisible(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <>
            {variant === 'A' ? A : B}
        </>
    )
}