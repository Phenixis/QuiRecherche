import Avatars from "./avatars"
import AvatarsDisplay from "./avatarsDisplay"
import { Suspense } from "react"

export default function SocialProof() {
    return (
        <Suspense fallback={<AvatarsDisplay />}>
            <Avatars />
        </Suspense>
    )
}