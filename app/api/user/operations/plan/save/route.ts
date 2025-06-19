import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized", success:false, }, { status: 401 });
  }

  const { destination, visibility, metadata, plan, currencyCode, idT, costO  } = await req.json();
  
  const userId = session.user.id;
  if (idT){
      const trip = await prisma.trip.update({
        where: { id: idT, ownerId: userId },
        data: {
          destination: destination,
          visibility: visibility,
          metadata: metadata,
          tripPlan: plan,
          currencyCode: currencyCode,
          costObj: costO,
        }
    });
    return NextResponse.json({ success: true, tripId: trip.id }, { status: 200 });
}
  const trip = await prisma.trip.create({
    data: {
      destination: destination,
      visibility: visibility,
      ownerId: userId,
      metadata: metadata,
      tripPlan: plan,
      currencyCode: currencyCode,
      costObj: costO,
    }
  })
  if (!trip) {
    return NextResponse.json({ error: "Failed to create trip", success:false }, { status: 500 });
  }
  return NextResponse.json({ success: true, tripId: trip.id }, { status: 200 });

}
