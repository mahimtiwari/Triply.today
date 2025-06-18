import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized", success:false, }, { status: 401 });
  }

  const { destination, visibility, sharedWith, metadata, plan  } = await req.json();
  
  const trip = await prisma.trip.create({
    data: {
      destination: destination,
      visibility: visibility,
      ownerId: session.user.id,
    }
  })

}
