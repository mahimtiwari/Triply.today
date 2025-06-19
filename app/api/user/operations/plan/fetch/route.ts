import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


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
    
    


    const session = await getServerSession(authOptions);

     const shUsers = await prisma.sharedTrip.findMany({
        where: {
            tripId: tripId,
        },
        select: {
            userId: true,
        },
    });
    let shEmails = "";

    for (const user of shUsers) {
        const userData = await prisma.user.findUnique({
            where: {
                id: user.userId,
            },
            select: {
                email: true,
            },
        });
        if (userData) {
            shEmails += userData.email + ",";
        }
    }


    if (session && session.user.id === tripDB.ownerId) {
        return NextResponse.json({
            tripplan: tripDB.tripPlan,
            metadata: tripDB.metadata,
            currencyCode: tripDB.currencyCode,
            costObj: tripDB.costObj,
            visibility: tripDB.visibility,
            share: true,
            sharedWith: shEmails,
        }, { status: 200});

    }else if (tripDB.visibility === 'PUBLIC') {
        return NextResponse.json({
            tripplan: tripDB.tripPlan,
            metadata: tripDB.metadata,
            currencyCode: tripDB.currencyCode,
            costObj: tripDB.costObj,
            visibility: tripDB.visibility,
            sharedWith: shEmails ? shEmails.slice(0, -1) : "",
        }, { status: 200});
    }
    else if (tripDB.visibility === 'SHARED') {
        if (session) {
            const sharedTrip = await prisma.sharedTrip.findFirst({
                where: {
                    tripId: tripId,
                    userId: session.user.id,
                },
            });

            if (sharedTrip) {
                return NextResponse.json({
                    tripplan: tripDB.tripPlan,
                    metadata: tripDB.metadata,
                    currencyCode: tripDB.currencyCode,
                    costObj: tripDB.costObj,
                    visibility: tripDB.visibility,
                    sharedWith: shEmails ? shEmails.slice(0, -1) : "",
                }, { status: 200 });
            }
    }
    }

        return NextResponse.json({ error: "Unauthorized access to private trip", status: 403 }, { status: 403 });


}
