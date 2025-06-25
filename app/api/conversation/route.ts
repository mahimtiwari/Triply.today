import { NextRequest } from "next/server";
interface RequestParams {
    conversationId: string;
    message: string;
}
export async function POST(request: NextRequest){
    const encd = new TextEncoder();

    const requestParams: RequestParams = await request.json();
    
    const stream = new ReadableStream({
        async start(controller) {
            for (let i of "abcdefghijklmnopqrstuvwxyz".split("")) {
                controller.enqueue(encd.encode(i));
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            controller.close();
        }
    });


    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

}