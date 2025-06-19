import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized", success:false, }, { status: 401 });
  }

  const { id, type, emails  } = await req.json();
  
  const userId = session.user.id;

  const trip = await prisma.trip.findUnique({
    where: { id: id, ownerId: userId },
});
if (!trip) {
    return NextResponse.json({ error: "Trip not found or unauthorized", success:false }, { status: 404 });
}
if (type === "SHARED") {
    await prisma.trip.update({
        where: { id: id },
        data: { visibility: 'SHARED' }, // or 'PUBLIC' if you're making it accessible to anyone
    });

    let sharedIds = [];
    for (const email of emails.split(',')) {
        const users = await prisma.user.findUnique({
            where: {
            email: email.trim(),
            },
        }); 
        if (users) {
            sharedIds.push(users.id);
        } else {

        }
}
    for (const sharedUserId of sharedIds) {
        await prisma.sharedTrip.create({
            data: {
                tripId: id,
                userId: sharedUserId, // the one you're sharing with
            },
        });
    }
    return NextResponse.json({ success: true, message: "Trip set to shared" }, { status: 200 });
}

    if (type === "PRIVATE") {
        await prisma.trip.update({
            where: { id: id },
            data: { visibility: 'PRIVATE' }, // or 'PUBLIC' if you're making it accessible to anyone
        });
        return NextResponse.json({ success: true, message: "Trip set to private" }, { status: 200 });
    }
    
    
    if (type === "PUBLIC") {
        await prisma.trip.update({
            where: { id: id },
            data: { visibility: 'PUBLIC' }, // or 'PUBLIC' if you're making it accessible to anyone
        });
        return NextResponse.json({ success: true, message: "Trip set to public" }, { status: 200 });
    }
    
    return NextResponse.json({ error: "Invalid type", success:false }, { status: 400 });

}
