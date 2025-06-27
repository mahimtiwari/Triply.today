import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const conv = await prisma.conversations.findMany({
        where:{
            userId: session.user.id,

        }
    })

    
    return new Response(JSON.stringify({conversations: conv}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

}
