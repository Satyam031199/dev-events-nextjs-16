import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import {NextRequest, NextResponse} from "next/server";
import {v2 as cloudinary} from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        let event;
        try {
            event = Object.fromEntries(formData.entries());
        } catch (e: any) {
            return NextResponse.json({
                success: false,
                message: 'Invalid JSON data format',
                error: e?.message
            }, {status: 400});
        }
        const file = formData.get('image') as File;
        if (!file) return NextResponse.json({
            success: false,
            message: 'Image file is required'
        }, {status: 400});
        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'dev-events' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        });
        event.image = (uploadResult as {secure_url: string}).secure_url;
        const createdEvent = await Event.create({
            ...event,
            tags,
            agenda
        });
        return NextResponse.json({
            success: true,
            message: 'Event created successfully',
            event: createdEvent
        }, {status: 201});
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: 'Event creation failed',
            error: error?.message
        }, {status: 500});
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}