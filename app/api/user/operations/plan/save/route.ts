import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized", success:false, }, { status: 401 });
  }

  const { destination, visibility, metadata, plan  } = await req.json();
  
  const userId = session.user.id;
  
  const trip = await prisma.trip.create({
    data: {
      destination: destination,
      visibility: visibility,
      ownerId: userId,
      metadata: metadata,
      tripPlan: plan,
    }
  })
  if (!trip) {
    return NextResponse.json({ error: "Failed to create trip", success:false }, { status: 500 });
  }
  return NextResponse.json({ success: true, tripId: trip.id }, { status: 200 });

}
