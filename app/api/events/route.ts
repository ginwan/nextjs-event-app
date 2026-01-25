import { Event } from '@/database';
import connectMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
        }

        // upload the image to cloudinary
        const file = formData.get("image") as File;
        if (!file) return NextResponse.json({ message: "Image is required" }, { status: 400 });

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
        const createdEvent = await Event.create(event);
        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });

    } catch (e) {
        console.error("Error in POST /api/events:", e);
        return NextResponse.json({ message: "Event creation failed", error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
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