'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";

export const createBooking = async ({eventId, slug, email}: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectDB();
        await Booking.create({eventId, slug, email});
        return { success: true, created: true };
    } catch (e: any) {
        // Handle duplicate booking gracefully (unique index on { eventId, email })
        if (e && typeof e === 'object' && (e as any).code === 11000) {
            // Treat as a no-op: booking already exists for this email and event
            return { success: true, created: false, duplicate: true, message: 'You have already booked this event with this email.' };
        }
        console.error('create booking failed', e);
        return { success: false, created: false };
    }
}