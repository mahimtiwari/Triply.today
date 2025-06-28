import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RequestParams {
    conversationId: string;
}


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

    const requestParams: RequestParams = await request.json();
    const conv = await prisma.conversations.delete({
        where:{
            conversation_id: requestParams.conversationId,
            userId: session.user.id,
        }
    })
    if (!conv) {
        return new Response(JSON.stringify({ error: "Conversation not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }


    
    return new Response(JSON.stringify({}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

}