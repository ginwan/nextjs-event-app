import { Event } from "@/database";
import connectMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

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