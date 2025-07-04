
import React from 'react'
import Image from 'next/image';


interface Place {
  category: string;
  name: string;
  cost: string;
  time: string;
  from: string;
  to: string;
  preffered_transport: string;
  description?:string
}

interface TripMetadata {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    peopleType: string;
    adults: string;
    children: string;
}

interface ArrivingOrDeparting {
  from: string;
  to: string;
  preffered_transport: string;
}

interface Day {
  date: string;
  destination: string;
  arriving?: ArrivingOrDeparting;
  departing?: ArrivingOrDeparting;
  places: Place[];
}

interface TripDetails {
  [key: string]: Day; // day1, day2, day3 — variable number of days
}

interface TransportOption {
  type: string;
  cost: string;
}

interface Transportation {
  from: string;
  to: string;
  options: TransportOption[];
}

interface Trip {
  trip: {
    trip: TripDetails;
    transportation: Transportation[];
  };
}


interface CostDetailsType {
  days: {
      [key: string]: {
        daytotalcost: number;
        subcosts: {
          transportation: number;
          hotel: number;
          food: number;
          sightseeing: number;
      };
    }
  };
  totalcost: number;
  totaltransportation: number;
  totalhotel: number;
  totalfood: number;
  totalsightseeing: number;
  shopping?: number;
  insurance?: number;
  visa?: number;
  other?: number;
}


interface ItinerarySectionProps {
    dataJSON: Trip | null;
    currencySymbol: string;
    costDetails: CostDetailsType | null;
    
}



const ItinerarySectionComponent = ({ dataJSON, currencySymbol, costDetails }: ItinerarySectionProps) => {
  
    const buildGmapUrl = (places: Place[]): string => {


    const bUrl: string = "https://www.google.com/maps/dir/?api=1&";

    var waypoints:string = "";
    for (let i =0; i < places.length; i++) {

        waypoints += i!== 0 ? `${places[i].from}|` : '';
    }
    
    return `${bUrl}origin=${places[0].from}&destination=${places[places.length - 1].to}&waypoints=${waypoints}`;
    }

    return (

          <div className='h-full w-full bg-white'>
            <div>
                <table className="w-full table-auto">
                <thead className="">
                  <tr>
                  <th className="text-left deskver:px-6 px-3 py-3 font-semibold text-gray-700">

                    <span className='flex-row gap-2 items-center deskver:flex hidden'>
                    <Image
                      src={`/img/day.svg`}
                      width={20}
                      height={20}
                      alt="day"
                    />
                    Days</span>
                    
                    <span className='deskver:hidden text-[#909090] flex items-center justify-center'>
                      #
                    </span>
                    </th>
                  <th className="text-left deskver:px-6 px-2 py-3 font-semibold text-gray-700">
                    <span className='flex flex-row gap-2 items-center'>
                    <Image
                      src={`/img/mapmarker.svg`}
                      width={20}
                      height={20}
                      alt="day"
                    />
                    
                    <span className='deskver:block hidden'>
                      Destination
                    </span>
                    <span className='deskver:hidden block'>
                      Dest
                    </span>
                    </span>
                  </th>
                  <th className="text-left deskver:px-6 px-2 py-3 font-semibold text-gray-700">
                    <span className='flex flex-row gap-2 items-center'>
                    <Image
                      src={`/img/cost.webp`}
                      width={20}
                      height={20}
                      alt="day"
                    />
                    Cost
                    </span>
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    <span className='flex flex-row gap-2 items-center'>
                    <Image
                      src={`/img/itin.svg`}
                      width={20}
                      height={20}
                      alt="day"
                    />
                    Map</span></th>

                  </tr>
                </thead>
                {!dataJSON && (
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                  <tr key={index} className='border-b border-gray-300'>
                    <td className="px-6 py-5">
                      <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
                    </td>
                  </tr>
                  ))}
                
                </tbody>
                )}
                { dataJSON?.trip?.trip && (
                <tbody>
                  {Object.entries(dataJSON.trip.trip).map(([day, tripInfo], index) => (
                  <tr
                    key={day}
                    className='border-b border-gray-300'
                  >
                    <td className="py-5 text-gray-800 font-medium">

                    <span className='deskver:block px-6  hidden'>
                      {`Day ${day.replace("day", "")}`}
                    </span>

                    <span className='mobver:block px-3 justify-center flex deskver:hidden bg-'>
                      <span className='text-[#909090] rounded-full w-7 h-7 flex justify-center items-center'>
                        {`${day.replace("day", "")}`}
                      </span>
                    </span>

                    </td>
                    
                    <td className="deskver:px-6 px-2 py-4 text-gray-700">
                      {tripInfo.destination}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">{currencySymbol}{costDetails?.days[day].daytotalcost}</td>
                    <td className="p-3 select-none">


                        <a 
                        href={buildGmapUrl(tripInfo.places)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className='flex cursor-pointer flex-row gap-2 text-green-600 font-semibold items-center justify-center p-3 rounded-4xl hover:bg-green-100 transition duration-200 ease-in-out border-1 border-green-400'
                        >
                            
                        <Image
                          src={`/img/gmap.png`}
                          width={13}
                          height={13}
                          alt="gmap"
                        />
                        View
                        </a>
                    </td>
                  </tr>

                  ))}
                </tbody>
                )}
                </table>
            </div>
          </div>

  )
}

export default ItinerarySectionComponent