import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }
    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: "Trip ID is required", success: false }, { status: 400 });
    }
    const trip = await prisma.trip.findUnique({
        where: { id: id, ownerId: session.user.id },
    });
    if (!trip) {
        return NextResponse.json({ error: "Trip not found or unauthorized", success: false }, { status: 404 });
    }
    await prisma.trip.delete({
        where: { id: id, ownerId: session.user.id },
    });
    return NextResponse.json({ success: true, message: "Trip deleted successfully" }, { status: 200 });

}
