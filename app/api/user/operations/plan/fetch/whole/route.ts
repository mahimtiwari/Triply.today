import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }
    const allPlans = await prisma.trip.findMany({
        where: {
            ownerId: session.user.id,
        },
        select: {
            id: true,
            destination: true,
            metadata: true,
        },    
    });
    if (!allPlans) {
        return NextResponse.json({ error: "No plans found", success: false }, { status: 404 });
    }
    return NextResponse.json({ plans: allPlans, success: true }, { status: 200 });
    

}
