"use server"

import { Booking } from "@/database";
import connectMongoDB from "../mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
    try {
        await connectMongoDB();
        await Booking.create({ eventId, slug, email });
        return { success: true }
    } catch (error) {
        console.log(`Error creating booking: ${error}`);
        return { success: false }
    }
}