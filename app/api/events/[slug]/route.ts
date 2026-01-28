import { Event } from "@/database";
import connectMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * Handle GET requests to fetch an Event by its route slug.
 *
 * @param req - Incoming Next.js request object.
 * @param params - An object (possibly a Promise) that resolves to route parameters; must contain a `slug` string identifying the event.
 * @returns A NextResponse with JSON:
 * - Status 200: `{ message: "Event fetched successfully", event }` when the event is found.
 * - Status 404: `{ message: "Event not found" }` when no event matches the slug.
 * - Status 400: `{ message: "Invalid or missing slug parameter" }` for missing/invalid slug.
 * - Status 500: `{ message: "Failed to fetch event", error }` on internal errors.
 */
export async function GET(
    req: NextRequest,
    { params }: RouteParams
) {
    try {
        // Extract and validate slug parameter
        const { slug } = await params;

        if (!slug || typeof slug !== "string" || slug.trim() === "") {
            return NextResponse.json(
                { message: "Invalid or missing slug parameter" },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await connectMongoDB();

        // Query event by slug
        const event = await Event.findOne({ slug: slug.trim() });

        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Event fetched successfully", event },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET /api/events/[slug]:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch event",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}