import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { tr } from "date-fns/locale";
import { metadata } from "@/app/layout";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('id');

    if (!tripId) {
        return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
    }
    const tripDB = await prisma.trip.findUnique({
        where: {
            id: tripId,
        },
    });

    if (!tripDB) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({
        tripplan: tripDB.tripPlan,
        metadata: tripDB.metadata,
        currencyCode: tripDB.currencyCode,
        costObj: tripDB.costObj,
    }, { status: 200});

}
