import { Event } from '@/database';
import connectMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

/**
 * Creates a new event from a multipart/form-data request, uploads the provided image to Cloudinary, and stores the event in the database.
 *
 * @param req - Incoming NextRequest containing form data with event fields. Expected fields: an `image` file, `tags` (JSON string), `agenda` (JSON string), and other event properties.
 * @returns A NextResponse whose JSON body is:
 * - On success (201): `{ message: "Event created successfully", event: <created event document> }`.
 * - On client error (400): `{ message: "Invalid JSON format" }` or `{ message: "Image is required" }`.
 * - On server error (500): `{ message: "Event creation failed", error: <error message> }`.
 */
export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch {
            return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
        }

        // upload the image to cloudinary
        const file = formData.get("image") as File;
        if (!file) return NextResponse.json({ message: "Image is required" }, { status: 400 });

        const tags = JSON.parse(formData.get("tags") as string);
        const agenda = JSON.parse(formData.get("agenda") as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: "image",
                folder: "events",
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        })

        event.image = (uploadResult as { secure_url: string }).secure_url;
        // create a new event
        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda
        });
        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });

    } catch (e) {
        console.error("Error in POST /api/events:", e);
        return NextResponse.json({ message: "Event creation failed", error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
}

/**
 * Retrieve all events sorted by newest first.
 *
 * Connects to the database and returns all Event documents ordered by `createdAt` descending.
 *
 * @returns A NextResponse whose JSON body contains `message` and `events` on success (status 200), or `message` and `error` on failure (status 500).
 */
export async function GET() {
    try {
        // connect to MongoDB
        await connectMongoDB();
        // get all events and sort them by creation date -1 that mean the latest event will be first
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "Event fetching failed", error: e }, { status: 500 });
    }
}