import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns'
export async function POST(req: Request) {
    const body = await req.json();
    const { destination, startDate, endDate, budget, peopleType, adults, children } = body;

    if (!destination || !startDate || !endDate || !budget || !peopleType || adults === undefined || children === undefined) {
        return NextResponse.json({ id: "no-id-for-you" }, { status: 400 });
    }

    console.log('Received data:', {
        destination,
        startDate,
        endDate,
        budget,
        peopleType,
        adults,
        children,
    });



   try {
      try{
      const existingPlan = await prisma.travelPlan.findFirst({
         where: {
         destination,
         startDate: startDate,
         endDate: endDate,
         budget,
         peopleType,
         adults,
         children,
         },
      });

      if (existingPlan) {
         return NextResponse.json({ id: existingPlan.id }, { status: 200 }); // Return existing plan ID
      }
   }
   catch (error) {
      console.error('Error checking existing plan:', error)
      return NextResponse.json({ mg: 'Error' }, { status: 200 });
   }
      const plan = await prisma.travelPlan.create({
         data: {
         destination,
         startDate: startDate,
         endDate: endDate,
         budget,
         peopleType,
         adults,
         children,
         createdAt: new Date(),
         expiresAt: addDays(new Date(), 7),
         },
      });
      

      return NextResponse.json({ id: plan.id }, { status: 200 }); // Return short ID
   } catch (error) {
      console.error('Error creating plan:', error)
      return NextResponse.json({ mg: 'Error' }, { status: 200 });
   }



    
}

