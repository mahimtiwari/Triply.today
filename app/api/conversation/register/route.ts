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

    const conv = await prisma.conversations.create({
        data:{
            userId: session.user.id,
            name: "New Chat",

        }
    })


    
    return new Response(JSON.stringify({chat_id: conv.conversation_id}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

}