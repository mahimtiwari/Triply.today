
import { NextRequest } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API;
const ai = new GoogleGenAI({ apiKey: apiKey });
export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const sParams = searchParams;
    const plan = {
        destination: sParams.get('destination'),
        startDate: sParams.get('startDate'),
        endDate: sParams.get('endDate'),
        budget: sParams.get('budget'),
        peopleType: sParams.get('peopleType'),
        adults: sParams.get('adults'),
        children: sParams.get('children'),
        clientLocation: sParams.get('clientLocation'),
        currencyCode: sParams.get('curcode') || 'USD',
    };

    const json_format = `
{
  trip: {
    day1: {
      destination: "New York",
      date: "2023-10-01",
      arriving: {
        from: "IGI Airport",
        to: "SFO Airport",
        preffered_transport: "Flight"
      },
      places: [
        {
          category: "hotel",
          name: "Hotel XYZ",
          cost: "$100",
          time: "3:00 PM",
          from: "SFO Airport",
          to: "Hotel XYZ"
          preffered_transport: "Taxi",
          description: "Check-in at Hotel XYZ, a comfortable stay in New York."
        },
        {
          category: "sightseeing",
          name: "Statue of Liberty",
          cost: "$20",
          time: "10:00 AM",
          from: "Hotel XYZ",
          to: "Statue of Liberty"
          preffered_transport: "Public Transport",
          description: "Visit the iconic Statue of Liberty and Ellis Island."
        },
        {
          category: "sightseeing",
          name: "Central Park",
          cost: "$0",
          time: "2:00 PM",
          from: "Statue of Liberty",
          to: "Central Park"
          preffered_transport: "Public Transport",
          description: "Explore the vast greenery and iconic landmarks of Central Park."
        },
        {
          category: "restaurant",
          name: "Joe's Pizza",
          cost: "$30",
          time: "6:00 PM",
          from: "Central Park",
          to: "Joe's Pizza"
          preffered_transport: "Public Transport",
          description: "Enjoy a slice of New York's famous pizza at Joe's Pizza."
        },
        {
          category: "hotel",
          name: "Hotel XYZ",
          cost: "$100",
          time: "8:00 PM",
          from: "Joe's Pizza",
          to: "Hotel XYZ"
          preffered_transport: "Taxi",
          description: "Relax and unwind at your hotel after a day of sightseeing."
        }
      ]
    },
    day2: {
      ...
      places:
      [
      ...
      {category: "hotel",
        name: "Hotel XYZ",
        cost: "$100",
        time: "3:00 PM",
        from: "XYZ Park",
        to: "Hotel XYZ",
        preffered_transport: "Taxi",
        description: "Check-in at Hotel XYZ, a comfortable stay in San Francisco."},

        {category: "intermediate_transport",
        name: "SFO Train Station"
        from: "Hotel XYZ,
        to: "SFO Train Station",
        cost: "$0",
        time: "5:00 PM",
        preffered_transport: "Public Transport"},

        {category: "intermediate_transport",
        name: "San Jose Train Station",
        from: "SFO Train Station",
        to: "San Jose Train Station",
        cost: "$0",
        time: "6:00 PM",
        preffered_transport: "Train"},

        {
          category: "hotel",
          name: "Hotel ABC",
          cost: "$120",
          time: "7:00 PM",
          from: "San Jose Train Station",
          to: "Hotel ABC",
          preffered_transport: "Taxi",
          description: "Check-in at Hotel ABC, a comfortable stay in San Jose."
        }
      ...
      ]
    }
    ...
    dayN: {
          
    "departing": {
        "from": "SFO Airport",
        "to": "IGI Airport",
        preffered_transport: "Flight"
      },
    places: [
      {
        "category": "sightseeing",
        "name": "Golden Gate Bridge",
        "cost": "$0",
        "time": "10:00 AM",
        "from": "Hotel XYZ",
        "to": "Golden Gate Bridge",
        "preffered_transport": "Public Transport",
        "description": "A must-see landmark with stunning views. Rent a bike to explore the area."
      },
      {
        "category": "restaurant",
        "name": "Fisherman's Wharf Restaurant",
        "cost": "$50",
        "time": "1:00 PM",
        "from": "Golden Gate Bridge",
        "to": "Fisherman's Wharf Restaurant",
        "preffered_transport": "Public Transport",
        "description": "Enjoy fresh seafood with a view of the bay. Try the clam chowder in a bread bowl."
      },
      {
        "category": "hotel",
        "name": "Hotel XYZ",
        "cost": "$535",
        "time": "3:00 PM",
        "from": "Fisherman's Wharf Restaurant",
        "to": "Hotel XYZ",
        "preffered_transport": "Public Transport",
        "description": "Relax and unwind at your hotel. Enjoy the amenities and prepare for departure."
      },
      {
        "category": "intermediate_transport",
        "name": "SFO Airport",
        "cost": "$345",
        "time": "6:00 PM",
        "from": "Hotel XYZ",
        "to": "SFO Airport",
        "preffered_transport": "Taxi"
      }

    ...}
  },

  transportation: [
    {
      from: "IGI Airport",
      to: "SFO Airport",
      options: [
        {
          type: "Flight",
          cost: "$500"
        }
      ]
    },
    {
      from: "SFO Airport",
      to: "Hotel XYZ",
      options: [
        {
          type: "Taxi",
          cost: "$50"
        },
        {
          type: "Public Transport",
          cost: "$10"
        }
      ]
    }
  ]
}

    `

    const prompt=`
    You are a travel planner.

You have to plan a trip to ${plan?.destination} from ${plan?.clientLocation}.
The trip starts on ${plan?.startDate} and ends on ${plan?.endDate}.
There are three types of trips (Budget, Normal, Luxury). User has selected ${plan?.budget} trip.
There are four types of people traveling (Solo, Family, Couple, Not Defined). The user has selected ${plan?.peopleType == "Custom" ? "Not Defined" : plan?.peopleType} as the type of people.
The user has selected ${plan?.adults} adults and ${plan?.children} children.

Based on this info, plan a trip for the user. The trip should include the following:

1. A list of places to visit (tourist attractions, local sights)
2. A list of hotels to stay at (must match the selected budget type)
3. A list of transportation options, including exact "from" and "to" values that match what appears in the trip section
4. The 'preferred_transport' field for each place in the trip plan needs to be chosen from the transportation options provided in the transportation section and it should be according to the budget type
5. Types of category for each place can be ("hotel", "sightseeing", "restaurant", "intermediate_transport")
6. A full day-wise itinerary organized like:
   - Day 1:
     - arriving/departing: "from" and "to" (only for departure airport to destination airport)
          -cost: this cannot be zero in any case
     - destiantion: the name of the overall destination(city) and it cannot be empty
     - places array: list of events (e.g., hotel check-in, sightseeing, food, etc.)
     - for each place:
       - name
       - type (e.g., Hotel, Sightseeing, Restaurant)
       - category (only for hotels and restaurants, optional for others)
       - time (when it will be visited)
       - cost in ${plan.currencyCode} currency as "{SYMBOL}NUMBER" (no ranges)
       - from and to fields (these must be real places and match with the transport section)
       - description (a brief description of the place or activity under 20 words and above 10 wrods) (this should not be included in the intermediate_transport category)
       - Ensure all routes make sense and return to the hotel at the end of the day
     - Include at least one restaurant or food place for lunch and one for dinner each day

Important Guidelines:
- Then number of days in the trip should be equal to the number of days between the start and end date
- The trip must match the selected budget type (Budget, Normal, or Luxury)
- The cost of each item and total trip cost should be written in "$NUMBER" format — no ranges like "$100 - $200"
- Every activity or place visited must have a return to the hotel at the end of the day
- All places and transportation entries must have specific and matching "from" and "to" values
- Avoid a repetitive pattern like "sightseeing → restaurant → sightseeing → restaurant → hotel"
- Make each day feel well-paced, immersive, and unique — add variety in how the day flows
- You can add as many sightseeing or food places as needed, but do not make the plan feel too rushed
- Ensure the plan is logical, realistic, and smooth in transitions
- DO NOT add any extra keys, fields, or sections — only use the format provided below
- DO NOT include any explanation, comments, or introductory text — just return valid JSON only
- Show the prices according to the number of people traveling
- Ensure the user returns to their starting city before ending the trip.
- Include all transportation elements in the transportation section, ensuring they match the "from" and "to" values used in the trip plan including arriving and departing.
- The user's currency code is ${plan.currencyCode} so all costs should be in that currency format.
- On the last day, do not set the destiantion as the user's hometown — instead, set it to the city they depart from to return home.
- arriving/departing is only for the first and last day of the trip, respectively. It should not be included in the middle days.
- use "intermediate_transport" category when transportation between two places needs more than one mode of transport, Example: from hotel to delhi train station then from delhi train station to jaipur train station. It should be *only* used when there is a need for more than one mode of transport between two places. 
- from and to *should not have their values as city names*, they should be specific places like "Hotel XYZ", "SFO Airport", etc.
- arriving and departure should never be inside the places array, they should be separate objects in the day object.
- **You are required include the costs of both arriving and departing flights separately in the transportation array.
- The to of the previous place should match with the from of the next place in the places array. 
- Arriving and departing sections can only have flights and in their from and to can only be airports.
- If the user location is from the same city as the destination then "arriving" and "departing" cannot be included in the day object.
- Price of hotel should given for each day separately *If applicable*.
JSON format to follow exactly:
${json_format}

Additional Rules:

- No extra keys like "notes", "food options", "comments", etc.
- JSON must be valid and contain ONLY the JSON object — nothing before or after it
- Every "from" and "to" value in the transportation section must exactly match those used in the places array in the trip plan
    `;  


    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
            
        }
    });
    console.log(response.text);
    return new Response(
        JSON.stringify({ trip: JSON.parse(String(response.text).replace("```json", "").replace(/```/g, '')) }),
        // JSON.stringify({ trip: String(response.text) }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
        );
}

// export async function GET(request: NextRequest) {
//     return new Response(
//         JSON.stringify(
// {
// "trip": {
//   "trip": {
//     "day1": {
//       "destination": "Delhi",
//       "date": "2025-06-11",
//       "arriving": {
//         "from": "JAI Airport",
//         "to": "DEL Airport",
//         "preffered_transport": "Flight"
//       },
//       "places": [
//         {
//           "category": "hotel",
//           "name": "The Leela Palace New Delhi",
//           "cost": "₹25000",
//           "time": "3:00 PM",
//           "from": "DEL Airport",
//           "to": "The Leela Palace New Delhi",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "sightseeing",
//           "name": "India Gate",
//           "cost": "₹0",
//           "time": "4:30 PM",
//           "from": "The Leela Palace New Delhi",
//           "to": "India Gate",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "restaurant",
//           "name": "Indian Accent",
//           "cost": "₹5000",
//           "time": "7:30 PM",
//           "from": "India Gate",
//           "to": "Indian Accent",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "hotel",
//           "name": "The Leela Palace New Delhi",
//           "cost": "₹0",
//           "time": "9:30 PM",
//           "from": "Indian Accent",
//           "to": "The Leela Palace New Delhi",
//           "preffered_transport": "Taxi"
//         }
//       ]
//     },
//     "day2": {
//       "destination": "Delhi",
//       "date": "2025-06-12",
//       "places": [
//         {
//           "category": "sightseeing",
//           "name": "Qutub Minar",
//           "cost": "₹150",
//           "time": "10:00 AM",
//           "from": "The Leela Palace New Delhi",
//           "to": "Qutub Minar",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "sightseeing",
//           "name": "Humayun's Tomb",
//           "cost": "₹500",
//           "time": "1:00 PM",
//           "from": "Qutub Minar",
//           "to": "Humayun's Tomb",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "restaurant",
//           "name": "Dum Pukht",
//           "cost": "₹6000",
//           "time": "3:00 PM",
//           "from": "Humayun's Tomb",
//           "to": "Dum Pukht",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "sightseeing",
//           "name": "Lodhi Garden",
//           "cost": "₹0",
//           "time": "5:00 PM",
//           "from": "Dum Pukht",
//           "to": "Lodhi Garden",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "hotel",
//           "name": "The Leela Palace New Delhi",
//           "cost": "₹0",
//           "time": "8:00 PM",
//           "from": "Lodhi Garden",
//           "to": "The Leela Palace New Delhi",
//           "preffered_transport": "Taxi"
//         }
//       ]
//     },
//     "day3": {
//       "destination": "Delhi",
//       "date": "2025-06-13",
//       "places": [
//         {
//           "category": "sightseeing",
//           "name": "Akshardham Temple",
//           "cost": "₹0",
//           "time": "10:00 AM",
//           "from": "The Leela Palace New Delhi",
//           "to": "Akshardham Temple",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "sightseeing",
//           "name": "Jama Masjid",
//           "cost": "₹300",
//           "time": "1:00 PM",
//           "from": "Akshardham Temple",
//           "to": "Jama Masjid",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "restaurant",
//           "name": "Karim's",
//           "cost": "₹4000",
//           "time": "3:00 PM",
//           "from": "Jama Masjid",
//           "to": "Karim's",
//           "preffered_transport": "Rickshaw"
//         },
//         {
//           "category": "sightseeing",
//           "name": "Red Fort",
//           "cost": "₹10",
//           "time": "5:00 PM",
//           "from": "Karim's",
//           "to": "Red Fort",
//           "preffered_transport": "Rickshaw"
//         },
//         {
//           "category": "hotel",
//           "name": "The Leela Palace New Delhi",
//           "cost": "₹0",
//           "time": "8:00 PM",
//           "from": "Red Fort",
//           "to": "The Leela Palace New Delhi",
//           "preffered_transport": "Taxi"
//         }
//       ]
//     },
//     "day4": {
//       "destination": "Delhi",
//       "date": "2025-06-14",
//       "departing": {
//         "from": "DEL Airport",
//         "to": "JAI Airport",
//         "preffered_transport": "Flight"
//       },
//       "places": [
//         {
//           "category": "sightseeing",
//           "name": "Connaught Place",
//           "cost": "₹0",
//           "time": "10:00 AM",
//           "from": "The Leela Palace New Delhi",
//           "to": "Connaught Place",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "restaurant",
//           "name": "Threesixtyone Degrees",
//           "cost": "₹7000",
//           "time": "1:00 PM",
//           "from": "Connaught Place",
//           "to": "Threesixtyone Degrees",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "hotel",
//           "name": "The Leela Palace New Delhi",
//           "cost": "₹0",
//           "time": "3:00 PM",
//           "from": "Threesixtyone Degrees",
//           "to": "The Leela Palace New Delhi",
//           "preffered_transport": "Taxi"
//         },
//         {
//           "category": "intermediate_transport",
//           "name": "DEL Airport",
//           "cost": "₹1200",
//           "time": "5:00 PM",
//           "from": "The Leela Palace New Delhi",
//           "to": "DEL Airport",
//           "preffered_transport": "Taxi"
//         }
//       ]
//     }
//   },
//   "transportation": [
//     {
//       "from": "JAI Airport",
//       "to": "DEL Airport",
//       "options": [
//         {
//           "type": "Flight",
//           "cost": "₹6000"
//         }
//       ]
//     },
//     {
//       "from": "DEL Airport",
//       "to": "The Leela Palace New Delhi",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹1200"
//         }
//       ]
//     },
//     {
//       "from": "The Leela Palace New Delhi",
//       "to": "India Gate",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹500"
//         }
//       ]
//     },
//     {
//       "from": "India Gate",
//       "to": "Indian Accent",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹600"
//         }
//       ]
//     },
//     {
//       "from": "Indian Accent",
//       "to": "The Leela Palace New Delhi",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹550"
//         }
//       ]
//     },
//     {
//       "from": "The Leela Palace New Delhi",
//       "to": "Qutub Minar",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹800"
//         }
//       ]
//     },
//     {
//       "from": "Qutub Minar",
//       "to": "Humayun's Tomb",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹700"
//         }
//       ]
//     },
//     {
//       "from": "Humayun's Tomb",
//       "to": "Dum Pukht",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹650"
//         }
//       ]
//     },
//     {
//       "from": "Dum Pukht",
//       "to": "Lodhi Garden",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹400"
//         }
//       ]
//     },
//     {
//       "from": "Lodhi Garden",
//       "to": "The Leela Palace New Delhi",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹750"
//         }
//       ]
//     },
//     {
//       "from": "The Leela Palace New Delhi",
//       "to": "Akshardham Temple",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹900"
//         }
//       ]
//     },
//     {
//       "from": "Akshardham Temple",
//       "to": "Jama Masjid",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹600"
//         }
//       ]
//     },
//     {
//       "from": "Jama Masjid",
//       "to": "Karim's",
//       "options": [
//         {
//           "type": "Rickshaw",
//           "cost": "₹200"
//         }
//       ]
//     },
//     {
//       "from": "Karim's",
//       "to": "Red Fort",
//       "options": [
//         {
//           "type": "Rickshaw",
//           "cost": "₹150"
//         }
//       ]
//     },
//     {
//       "from": "Red Fort",
//       "to": "The Leela Palace New Delhi",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹850"
//         }
//       ]
//     },
//     {
//       "from": "The Leela Palace New Delhi",
//       "to": "Connaught Place",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹700"
//         }
//       ]
//     },
//     {
//       "from": "Connaught Place",
//       "to": "Threesixtyone Degrees",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹650"
//         }
//       ]
//     },
//     {
//       "from": "Threesixtyone Degrees",
//       "to": "The Leela Palace New Delhi",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹550"
//         }
//       ]
//     },
//      {
//       "from": "The Leela Palace New Delhi",
//       "to": "DEL Airport",
//       "options": [
//         {
//           "type": "Taxi",
//           "cost": "₹1200"
//         }
//       ]
//     }
//   ]
// }
// }
//         ),
//         // JSON.stringify({ trip: String(response.text) }),
//         {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' },
//         }
//         );
// }