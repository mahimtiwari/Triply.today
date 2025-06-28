import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RequestParams {
    conversationId: string;
    message: string;
}

enum senders {
    USER = "USER",
    MODEL = "MODEL",
}

async function registerMessage(conversationId: string, message: string, senderType: senders) {

    const msg = await prisma.messages.create({
        data: {
            conversation_id: conversationId,
            message_text: message,
            sender: senderType,
        }
    })
    console.log(msg)
    console.log(`Message registered: ${message} from ${senderType} in conversation ${conversationId}`);


}

export async function POST(request: NextRequest){
    const encd = new TextEncoder();
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
    

    const conv = prisma.conversations.findUnique({
        where: {
            userId: session.user.id,
            conversation_id: requestParams.conversationId,
        },
    });
    if (!conv) {
        return new Response(JSON.stringify({ error: "Conversation not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    

    await prisma.conversations.update({
        where: {
            conversation_id: requestParams.conversationId,
        },
        data: {
            last_interaction: new Date(),
        },
    });
    

    registerMessage(requestParams.conversationId, requestParams.message, senders.USER)
    let resp = "";
    const stream = new ReadableStream({
        async start(controller) {
            for (let i of "abcdefghijklmnopqrstuvwxyz".split("")) {
                controller.enqueue(encd.encode(i));
                resp+= i;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            controller.close();
            registerMessage(requestParams.conversationId, resp, senders.MODEL);
        }
    });



    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

}