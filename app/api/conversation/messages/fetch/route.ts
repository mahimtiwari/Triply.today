import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Visibility } from "@/app/generated/prisma";


interface RequestParams {
    conversationId: string;
}
export async function POST(request: NextRequest){
    const session = await getServerSession(authOptions);
    const requestParams: RequestParams = await request.json();
    

    const conv = await prisma.conversations.findUnique({
        where: {
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
    if (conv.visibility === Visibility.PRIVATE && conv.userId !== session.user.id) {
        return new Response(JSON.stringify({ error: "Unauthorized to access this conversation" }), {
            status: 403,
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
    let userBool = true;
    if (!session?.user?.email) {
        userBool = false;
    }else if (conv.userId !== session.user.id) {
        userBool = false;
    }

    return new Response(JSON.stringify({messages:messages, visibility:conv.visibility, user:userBool}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

}
