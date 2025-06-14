
import { NextRequest } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API;
const ai = new GoogleGenAI({ apiKey: apiKey });
export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const sParams = searchParams;
    const plan = {
        destination: sParams.get('destination'),
    };

    if (!plan.destination) {
        return new Response(
            JSON.stringify({ error: "Destination is required" }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    

    const prompt = `Make a packing list for a trip to ${plan.destination}. None of the items should be checked.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    values: {
                        type: Type.OBJECT,
                        properties: {
                            data: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        checked: { type: Type.BOOLEAN }
                                    },
                                    required: ["name", "checked"]
                                }
                            }
                        },
                        required: ["data"]
                    }
                },
                required: ["name", "values"]
            }
            
        }
    }});



    console.log(response.text);
    return new Response(
        response.text,
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
        );
}

