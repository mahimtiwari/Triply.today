import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenAI, Type } from "@google/genai";
const apiKey = process.env.GEMINI_API;
const ai = new GoogleGenAI({ apiKey: apiKey });
interface RequestParams {
    conversationId: string;
    message: string;
    tools?: string;
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
    
    const system_instructions = `
    You are a helpful assistant.
    `;


    const cHistory = await prisma.messages.findMany({
        where: {
            conversation_id: requestParams.conversationId,
        },
        orderBy: {
            created_at: 'asc',
        },
    });

const messages = cHistory.map((msg) => ({
  role: msg.sender === senders.USER ? "user" : "model",
  parts: [{ text: msg.message_text }],
}));


    registerMessage(requestParams.conversationId, requestParams.message, senders.USER)
    let resp = "";
    const stream = new ReadableStream({
        async start(controller) {
            const chat = await ai.chats.create({
                model: "gemini-2.0-flash",
                history: messages,
            });

            const response = await chat.sendMessageStream({
                message: requestParams.message,
            });
            for await (const chunk of response) {
                controller.enqueue(encd.encode(chunk.text));
                resp+= chunk.text;
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