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
                enum: ["getAllTripPlans", "getTripDetails"],
            },
        },
        toolParams: {
            type: Type.OBJECT,
            properties: {
                tripId: {
                    type: Type.STRING,
                },
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
 

    async function getAllTripPlans(){
        const allTripPlans = await prisma.trip.findMany({
            where:{
                    ownerId: session.user.id,
            },
            select:{
                id: true,
                destination: true,
                metadata: true,
                currencyCode: true,
                costObj: true,
            }
        });

        console.log("=======================================================================");
        console.log("All trip plans retrieved:", allTripPlans);
        console.log("Number of trip plans:", allTripPlans.length);
        console.log("=======================================================================");
        return allTripPlans;
    
    }
    async function getTripDetails(tripId: string) {
        const tripDetails = await prisma.trip.findUnique({
            where: {
                id: tripId,
            },
        });

        if (!tripDetails) {
            throw new Error("Trip not found " + tripId);
        }

        return tripDetails;
    }

    const system_instructions = `
    You are a smart and helpful AI assistant who specializes in travel questions and trip planning. You have access to tools that can help you fetch a user’s saved trips or get the details of a specific trip.
    You can use these tools at any time without asking for permission and without mentioning that you're using a tool.
    Here are the tools available:
    getAllTripPlans: Shows all of the user’s saved trip plans.
    getTripDetails: Gives full details about a specific trip plan when you provide its ID using toolParams.
    Important rules to follow:
    Never ask if you should use a tool — just use it.
    Never say you are using a tool — just show the result as if it were part of your answer.
    If you use a tool, make sure to set isToolOutput to true.
    Your answer must only be in markdown — don’t return any code blocks or mention things like tool_code or JSON.
    Stay helpful, direct, and friendly.
    and never ever mention the trip id in the chat.
    ***NEVER MENTION ANY ID IN THE CHAT***
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
    let registerMSG = "";
    const stream = new ReadableStream({
        async start(controller) {
            const chat = await ai.chats.create({
                model: "gemini-2.5-flash",
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
                }

                const encodedStringChunk = respText.slice(prevRespText.length);

                controller.enqueue(encd.encode(encodedStringChunk));
                prevRespText = respText;
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const respJSON = JSON.parse(resp);
            registerMSG += respJSON.response;
            console.log("Final response JSON:", respJSON);
            if (respJSON.isToolOutput){
                console.log("----------------------------------------------------------");
                console.log("Tool output detected, executing tool...");
                console.log("Tool call ID:", respJSON.toolCallId);
                console.log("----------------------------------------------------------");
                let alltrips:any = await getAllTripPlans();;
                let funcResp:any;
                
                    if (respJSON.toolCallId.includes("getAllTripPlans")) {
                        funcResp = alltrips;
                    }
                    else if (respJSON.toolCallId.includes("getTripDetails")) {
                        if (!respJSON.toolParams || !respJSON.toolParams.tripId) {
                            console.error("Tool parameters missing for getTripDetails");
                            controller.close();
                            return;
                        }
                        funcResp = await getTripDetails(respJSON.toolParams.tripId);
                    }
                        console.log("Tool output:", funcResp);
                    const toolResponse = await chat.sendMessageStream({
                        message: `
                        System: Here is the output of the tool call: ${JSON.stringify(funcResp)}
                        
                        And here are all the trip plas with their ids: ${JSON.stringify(alltrips)}`,
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
                    const toolRespJSON = JSON.parse(resp);
                    registerMSG += toolRespJSON.response;

                
            }

            controller.close();
            registerMessage(requestParams.conversationId, registerMSG, senders.MODEL);

        }
    });



    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
