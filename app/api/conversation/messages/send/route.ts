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
    

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        response: {
            type: Type.STRING,
        },
        isToolOutput: {
            type: Type.BOOLEAN,
        },
        toolCallId: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                enum: ["getAllTripPlans"],
            },
        },

    },
    propertyOrdering: ["response", "isToolOutput", "toolCallId"],
    required: ["response", "isToolOutput", "toolCallId"],
};


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
 

    function getAllTripPlans(){
        console.log("Updating trip plan...");
        console.log("Trip plan updated successfully.");
        const tripPlan = {
            destination: "Paris",
            startDate: "2024-05-01",
            endDate: "2024-05-10",
            cost: "1500HKD",
        };
        return tripPlan;
    }

    const system_instructions = `
    You are an intelligent, helpful AI assistant that helps users with travel-related questions and trip planning. You have access to external tools, which you can use whenever needed to provide accurate and personalized responses.
You are allowed to use tools at any time if it helps improve your response.
Currently available tools:
- **getAllTripPlans**: Retrieves all of the user's saved trip plans.    
never ever ASK FOR PERMISSION TO USE TOOLS, JUST USE THEM WHEN YOU THINK IT WILL HELP.
in the response field you can only put markdown no useless code language or any other text.
nad remeber if a tool is used then isToolOutput should be true.
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
    let respText = "";
    const stream = new ReadableStream({
        async start(controller) {
            const chat = await ai.chats.create({
                model: "gemini-2.0-flash",
                history: messages,
                config: {
                    systemInstruction: system_instructions,
                    responseSchema: responseSchema,
                    responseMimeType: "application/json",
                }
            });

            const response = await chat.sendMessageStream({
                message: requestParams.message,
            });

            let prevRespText = "";
            
            for await (const chunk of response) {
                resp+= chunk.text;
                console.log("Received chunk:", chunk.text);

                try {
                    const respSplit = resp.split('"response": "')[1].split('",')[0];
                    console.log("Response so far:", respSplit);
                    respText = respSplit;
                } catch (error) {
                    console.error("Error parsing response:", error);
                }

                const encodedStringChunk = respText.slice(prevRespText.length);

                controller.enqueue(encd.encode(encodedStringChunk));
                prevRespText = respText;
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const respJSON = JSON.parse(resp);
            console.log("Final response JSON:", respJSON);
            if (respJSON.isToolOutput){
                console.log("----------------------------------------------------------");
                console.log("Tool output detected, executing tool...");
                console.log("Tool call ID:", respJSON.toolCallId);
                console.log("----------------------------------------------------------");
                if (respJSON.toolCallId.includes("getAllTripPlans")) {
                    const funcResp = getAllTripPlans();
                    console.log("Tool output:", funcResp);
                    const toolResponse = await chat.sendMessageStream({
                        message: `System: Here is the output of the tool call: ${JSON.stringify(funcResp)}`,
                    });
                    let resp = "";
                    let respText = "";
                    controller.enqueue(encd.encode(" "));

                    for await (const chunk of toolResponse) {
                        resp+= chunk.text;
                        console.log("Received chunk:", chunk.text);

                        try {
                            const respSplit = resp.split('"response": "')[1].split('",')[0];
                            console.log("Response so far:", respSplit);
                            respText = respSplit;
                        } catch (error) {
                            console.error("Error parsing response:", error);
                        }

                        const encodedStringChunk = respText.slice(prevRespText.length);

                        controller.enqueue(encd.encode(encodedStringChunk));
                        prevRespText = respText;
                        await new Promise(resolve => setTimeout(resolve, 500));
        
                    }

                }
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