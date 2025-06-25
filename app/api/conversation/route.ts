import { NextRequest } from "next/server";
interface RequestParams {
    conversationId: string;
    userId: string;
    message: string;
}
export async function POST(request: NextRequest){

    const requestParams: RequestParams = await request.json();
    
    return new Response(JSON.stringify(requestParams), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
    
}