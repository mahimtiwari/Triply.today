import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
   const body = await req.json();
   const { destination, startDate, endDate, budget, peopleType, adults, children } = body

   console.log('Received data:', {
      destination,
      startDate,
      endDate,
      budget,
      peopleType,
      adults,
      children,
   });

   return NextResponse.json({ message: 'Hello from Next.js!' }, { status: 200 });
};
