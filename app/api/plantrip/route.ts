
import { NextRequest } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { prisma } from '@/lib/prisma';
import { ms } from 'date-fns/locale';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    // Begining of the main code of my site
    const apiKey = process.env.GEMINI_API;
    const ai = new GoogleGenAI({ apiKey: apiKey });

    if (!id) {
        return new Response(
            JSON.stringify({ msg: "error" }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const plan = await prisma.travelPlan.findUnique({
        where: {
            id: id,
        },
    });

    const prompt=`
    You are a travel planner.
    You have to plan a trip to ${plan?.destination}.
    The trip starts on ${plan?.startDate} and ends on ${plan?.endDate}.
    There are three types of trips(Budget, Normal, Luxury) user has selected ${plan?.budget} trip.
    There are 4 types of people traveling (Solo, Family, Couple, Not Defined) The user has selected ${plan?.peopleType == "Custom" ? "Not Defined" : plan?.peopleType} as the type of people.
    The user has selected ${plan?.adults} adults and ${plan?.children} children.
    Based on this info plan a trip for the user.
    The trip should include the following:
    1. A list of places to visit
    2. A list of activities to do
    3. A list of restaurants to eat at
    4. A list of hotels to stay at(search for hotels in the area and choose them according to the trip type)
    5. A list of transportation options(search for transportation options in the area and choose them according to the trip type)
    6. It should be a day-wise plan (keep the plan organized day by day and event by event, e.g., Day 1: Visit Statue of Liberty, travel from Hotel XYZ to Statue of Liberty using public transport(what type of public transport, etc)).
    * And remember to keep it according to the budget type.
    `;  



    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
            responseMimeType: "application/json",
            responseSchema:{

            },
        },
    });
    console.log(response.text);



    return new Response(
        JSON.stringify({ trip: JSON.parse(String(response.text).replace("```json", "").replace(/```/g, '')) }),
        {
            headers: { 'Content-Type': 'application/json' },
        },
        );

}

