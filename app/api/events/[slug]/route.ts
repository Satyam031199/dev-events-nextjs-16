import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>
};

export async function GET(req: NextRequest, {params}: RouteParams) {
    try {
        await connectDB();
        const {slug} = await params;
        if (!slug || slug.trim() === '') return NextResponse.json({
            success: false,
            message: 'Invalid slug provided'
        }, {status: 400});
        const sanitizedSlug = slug.trim().toLowerCase();
        const event = await Event.findOne({slug: sanitizedSlug}).lean();
        if (!event) return NextResponse.json({
            success: false,
            message: `Event with the slug ${sanitizedSlug} not found`
        }, {status: 404});
        return NextResponse.json({success: true, message: 'Event fetched successfully', event}, {status: 200});
    } catch (e: any) {
        console.log(e.message);
        return NextResponse.json({success: false, error: e.message}, {status: 500});
    }
}