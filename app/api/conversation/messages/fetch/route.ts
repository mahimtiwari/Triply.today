import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


interface RequestParams {
    conversationId: string;
}
export async function POST(request: NextRequest){
    const session = await getServerSession(authOptions);
    const requestParams: RequestParams = await request.json();
    
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const conv = await prisma.conversations.findUnique({
        where: {
            userId: session.user.id,
            conversation_id: requestParams.conversationId,

        },
        
    })
    if (!conv) {
        return new Response(JSON.stringify({ error: "Conversation not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const messages = await prisma.messages.findMany({
        where: {
            conversation_id: conv.conversation_id,
            
        },
        orderBy: {
            created_at: 'asc',
        },
    });


    return new Response(JSON.stringify({messages:messages}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

}
