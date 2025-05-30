
import { NextRequest } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
export const dynamic = 'force-dynamic';
// const apiKey = process.env.GEMINI_API;
// const ai = new GoogleGenAI({ apiKey: apiKey });
// export async function GET(request: NextRequest) {

//     const searchParams = request.nextUrl.searchParams;
//     const sParams = searchParams;
//     const plan = {
//         destination: sParams.get('destination'),
//         startDate: sParams.get('startDate'),
//         endDate: sParams.get('endDate'),
//         budget: sParams.get('budget'),
//         peopleType: sParams.get('peopleType'),
//         adults: sParams.get('adults'),
//         children: sParams.get('children'),
//         clientLocation: sParams.get('clientLocation'),
//         currencyCode: sParams.get('curcode') || 'USD',
//     };

//     const json_format = `
// {
//   trip: {
//     day1: {
//       destination: "New York",
//       date: "2023-10-01",
//       arriving: {
//         from: "IGI",
//         to: "SFO"
//       },
//       places: [
//         {
//           category: "hotel",
//           name: "Hotel XYZ",
//           cost: "$100",
//           time: "3:00 PM",
//           from: "SFO Airport",
//           to: "Hotel XYZ"
//           preffered_transport: "Taxi"
//         },
//         {
//           category: "sightseeing",
//           name: "Statue of Liberty",
//           cost: "$20",
//           time: "10:00 AM",
//           from: "Hotel XYZ",
//           to: "Statue of Liberty"
//           preffered_transport: "Public Transport"
//         },
//         {
//           category: "sightseeing",
//           name: "Central Park",
//           cost: "$0",
//           time: "2:00 PM",
//           from: "Statue of Liberty",
//           to: "Central Park"
//           preffered_transport: "Public Transport"
//         },
//         {
//           category: "restaurant",
//           name: "Joe's Pizza",
//           cost: "$30",
//           time: "6:00 PM",
//           from: "Central Park",
//           to: "Joe's Pizza"
//           preffered_transport: "Public Transport"
//         },
//         {
//           category: "hotel",
//           name: "Hotel XYZ",
//           cost: "$100",
//           time: "8:00 PM",
//           from: "Joe's Pizza",
//           to: "Hotel XYZ"
//           preffered_transport: "Taxi"
//         }
//       ]
//     },
//     day2: {}
//     ...
//     dayN: {
//     ...
//       "departing": {
//         "from": "SFO Airport",
//         "to": "IGI Airport"
//       }
//     ...}
//   },

//   transportation: [
//     {
//       from: "IGI",
//       to: "SFO",
//       options: [
//         {
//           type: "Flight",
//           cost: "$500"
//         }
//       ]
//     },
//     {
//       from: "SFO Airport",
//       to: "Hotel XYZ",
//       options: [
//         {
//           type: "Taxi",
//           cost: "$50"
//         },
//         {
//           type: "Public Transport",
//           cost: "$10"
//         }
//       ]
//     }
//   ]
// }

//     `

//     const prompt=`
//     You are a travel planner.

// You have to plan a trip to ${plan?.destination} from ${plan?.clientLocation}.
// The trip starts on ${plan?.startDate} and ends on ${plan?.endDate}.
// There are three types of trips (Budget, Normal, Luxury). User has selected ${plan?.budget} trip.
// There are four types of people traveling (Solo, Family, Couple, Not Defined). The user has selected ${plan?.peopleType == "Custom" ? "Not Defined" : plan?.peopleType} as the type of people.
// The user has selected ${plan?.adults} adults and ${plan?.children} children.

// Based on this info, plan a trip for the user. The trip should include the following:

// 1. A list of places to visit (tourist attractions, local sights)
// 2. A list of activities to do (relevant to the destination)
// 3. A list of hotels to stay at (must match the selected budget type)
// 4. A list of transportation options, including exact "from" and "to" values that match what appears in the trip section
// 5. The 'preferred_transport' field for each place in the trip plan needs to be chosen from the transportation options provided in the transportation section and it should be according to the budget type
// 6. Types of category for each place can be ("hotel", "sightseeing", "restaurant")
// 7. A full day-wise itinerary organized like:
//    - Day 1:
//      - arriving: "from" and "to" (e.g., airport to destination airport)
//      - destiantion: the name of the overall destination(city) (Note: this should not be the destination of departure on the last day, but rather the city before the point of departure.)
//      - places array: list of events (e.g., hotel check-in, sightseeing, food, etc.)
//      - for each place:
//        - name
//        - type (e.g., Hotel, Sightseeing, Restaurant)
//        - category (only for hotels and restaurants, optional for others)
//        - time (when it will be visited)
//        - cost in ${plan.currencyCode} currency as "{SYMBOL}NUMBER" (no ranges)
//        - from and to fields (these must be real places and match with the transport section)
//      - Ensure all routes make sense and return to the hotel at the end of the day
//      - Include at least one restaurant or food place for lunch and one for dinner each day

// Important Guidelines:

// - The trip must match the selected budget type (Budget, Normal, or Luxury)
// - The cost of each item and total trip cost should be written in "$NUMBER" format — no ranges like "$100 - $200"
// - Every activity or place visited must have a return to the hotel at the end of the day
// - All places and transportation entries must have specific and matching "from" and "to" values
// - Avoid a repetitive pattern like "sightseeing → restaurant → sightseeing → restaurant → hotel"
// - Make each day feel well-paced, immersive, and unique — add variety in how the day flows
// - You can add as many sightseeing or food places as needed, but do not make the plan feel too rushed
// - Ensure the plan is logical, realistic, and smooth in transitions
// - DO NOT add any extra keys, fields, or sections — only use the format provided below
// - DO NOT include any explanation, comments, or introductory text — just return valid JSON only
// - Show the prices according to the number of people traveling

// JSON format to follow exactly:
// ${json_format}

// Additional Rules:

// - No extra keys like "notes", "food options", "comments", etc.
// - JSON must be valid and contain ONLY the JSON object — nothing before or after it
// - Every "from" and "to" value in the transportation section must exactly match those used in the places array in the trip plan
//     `;  


//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: prompt,
//         config: {
//             tools: [{googleSearch: {}}],
            
//         }
//     });
//     console.log(response.text);
//     return new Response(
//         JSON.stringify({ trip: JSON.parse(String(response.text).replace("```json", "").replace(/```/g, '')) }),
//         // JSON.stringify({ trip: String(response.text) }),
//         {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' },
//         }
//         );
// }

export async function GET(request: NextRequest) {
    return new Response(
        JSON.stringify(
{
"trip": {
  "trip": {
    "day1": {
      "destination": "Goa",
      "date": "2025-05-23",
      "arriving": {
        "from": "JAI",
        "to": "GOI"
      },
      "places": [
        {
          "category": "hotel",
          "name": "The St. Regis Goa Resort",
          "cost": "₹25000",
          "time": "3:00 PM",
          "from": "GOI Airport",
          "to": "The St. Regis Goa Resort",
          "preffered_transport": "Taxi"
        },
        {
          "category": "sightseeing",
          "name": "Palolem Beach",
          "cost": "₹0",
          "time": "4:00 PM",
          "from": "The St. Regis Goa Resort",
          "to": "Palolem Beach",
          "preffered_transport": "Taxi"
        },
        {
          "category": "restaurant",
          "name": "The Fisherman's Wharf",
          "cost": "₹3000",
          "time": "8:00 PM",
          "from": "Palolem Beach",
          "to": "The Fisherman's Wharf",
          "preffered_transport": "Taxi"
        },
        {
          "category": "hotel",
          "name": "The St. Regis Goa Resort",
          "cost": "₹0",
          "time": "10:00 PM",
          "from": "The Fisherman's Wharf",
          "to": "The St. Regis Goa Resort",
          "preffered_transport": "Taxi"
        }
      ]
    },
    "day2": {
      "destination": "Goa",
      "date": "2025-05-24",
      "places": [
        {
          "category": "sightseeing",
          "name": "Dudhsagar Falls",
          "cost": "₹500",
          "time": "9:00 AM",
          "from": "The St. Regis Goa Resort",
          "to": "Dudhsagar Falls",
          "preffered_transport": "Car"
        },
        {
          "category": "restaurant",
          "name": "Copperleaf Panaji",
          "cost": "₹4000",
          "time": "1:00 PM",
          "from": "Dudhsagar Falls",
          "to": "Copperleaf Panaji",
          "preffered_transport": "Car"
        },
        {
          "category": "sightseeing",
          "name": "Fontainhas Latin Quarter",
          "cost": "₹0",
          "time": "4:00 PM",
          "from": "Copperleaf Panaji",
          "to": "Fontainhas Latin Quarter",
          "preffered_transport": "Taxi"
        },
        {
          "category": "restaurant",
          "name": "The Black Sheep Bistro",
          "cost": "₹3500",
          "time": "8:00 PM",
          "from": "Fontainhas Latin Quarter",
          "to": "The Black Sheep Bistro",
          "preffered_transport": "Taxi"
        },
        {
          "category": "hotel",
          "name": "The St. Regis Goa Resort",
          "cost": "₹0",
          "time": "10:00 PM",
          "from": "The Black Sheep Bistro",
          "to": "The St. Regis Goa Resort",
          "preffered_transport": "Taxi"
        }
      ],
      "departing": {
        "from": "The St. Regis Goa Resort",
        "to": "JAI"
      }
    }
  },
  "transportation": [
    {
      "from": "JAI",
      "to": "GOI",
      "options": [
        {
          "type": "Flight",
          "cost": "₹15000"
        }
      ]
    },
    {
      "from": "GOI Airport",
      "to": "The St. Regis Goa Resort",
      "options": [
        {
          "type": "Taxi",
          "cost": "₹2500"
        }
      ]
    },
    {
      "from": "The St. Regis Goa Resort",
      "to": "Palolem Beach",
      "options": [
        {
          "type": "Taxi",
          "cost": "₹1500"
        }
      ]
    },
    {
      "from": "Palolem Beach",
      "to": "The Fisherman's Wharf",
      "options": [
        {
          "type": "Taxi",
          "cost": "₹800"
        }
      ]
    },
    {
      "from": "The Fisherman's Wharf",
      "to": "The St. Regis Goa Resort",
      "options": [
        {
          "type": "Taxi",
          "cost": "₹1500"
        }
      ]
    },
    {
      "from": "The St. Regis Goa Resort",
      "to": "Dudhsagar Falls",
      "options": [
        {
          "type": "Car",
          "cost": "₹4000"
        }
      ]
    },
    {
      "from": "Dudhsagar Falls",
      "to": "Copperleaf Panaji",
      "options": [
        {
          "type": "Car",
          "cost": "₹3000"
        }
      ]
    },
    {
      "from": "Copperleaf Panaji",
      "to": "Fontainhas Latin Quarter",
      "options": [
        {
          "type": "Taxi",
          "cost": "₹500"
        }
      ]
    },
    {
      "from": "Fontainhas Latin Quarter",
      "to": "The Black Sheep Bistro",
      "options": [
        {
          "type": "Taxi",
          "cost": "₹600"
        }
      ]
    },
    {
      "from": "The Black Sheep Bistro",
      "to": "The St. Regis Goa Resort",
      "options": [
        {
          "type": "Taxi",
          "cost": "₹2000"
        }
      ]
    },
    {
      "from": "The St. Regis Goa Resort",
      "to": "JAI",
      "options": [
        {
          "type": "Flight",
          "cost": "₹16000"
        }
      ]
    }
  ]
}
}
        ),
        // JSON.stringify({ trip: String(response.text) }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
        );
}