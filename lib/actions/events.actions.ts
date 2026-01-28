"use server"

import { Event } from "@/database"
import connectMongoDB from "../mongodb"

// This instead of doing a fetch request to get similar events in the API
export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectMongoDB()

        const event = await Event.findOne({ slug })
        const similarEvents = await Event.find({ _id: { $ne: event?._id }, tags: { $in: event?.tags } })
        return similarEvents

    } catch {
        return []
    }
}