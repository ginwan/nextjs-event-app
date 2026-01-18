"use client"

import Image from "next/image"
import posthog from 'posthog-js'

const ExploreBtn = () => {
    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => posthog.capture('test_event')}>
            <a href="#event">
                Explore Events
                <Image
                    src="/icons/arrow-down.svg"
                    alt="arrow down"
                    width={24}
                    height={24}
                    className="inline-block ml-2"
                />
            </a>
        </button>
    )
}

export default ExploreBtn