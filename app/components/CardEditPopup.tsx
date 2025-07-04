"use client";
import React, { useRef, useState } from 'react'

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

interface preData {
    day: string;
    place: Place;
    placeIndex: number;
}


const CardEditPopup = ({ preData, onClose }: { preData: preData | null, onClose: () => void }) => {
  const bottomSheetRef = useRef<HTMLDivElement>(null);
    
  const [name, setName] = useState(preData?.place.name || '');
  
  return (
    <div
    style={{
        display: preData ? 'flex' : 'none',
        transition: 'all 0.3s ease-in-out',
        opacity: preData ? 1 : 0,
        pointerEvents: preData ? 'auto' : 'none'
    }}
    className='h-screen flex font-[Poppins] w-screen absolute top-0 left-0 bg-black/30 z-100000000000'>
        <div 
        ref={bottomSheetRef}
        style={{
            transform: preData ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease-in-out'
        }}
        className='bg-white deskver:p-4 p-6 mt-auto deskver:mb-auto rounded-t-2xl w-full'>
            <div className='flex items-center justify-between'>
                <span className='font-medium text-2xl'>Edit Trip</span>
                <button 
                onClick={()=>{
                    onClose();
                }}
                className='flex items-center justify-center'>
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </button>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <div className='flex flex-col'>
                    <span className='text-gray-600 text-sm font-medium'>
                        Name:
                    </span>
                    <input
                        className="outline-none border border-gray-300 focus:border-blue-500 transition-colors py-2 px-4 rounded-lg shadow-sm text-base bg-gray-50"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter place name"
                        autoComplete="off"
                    />
                </div>
                <div className='flex flex-col'>
                    <span className='text-gray-600 text-sm font-medium'>
                        Time:
                    </span>
                    
                <div className='outline-none border border-gray-300 focus:border-blue-500 transition-colors py-2 px-4 rounded-lg shadow-sm text-base bg-gray-50'>
                    {preData?.place.time}
                </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default CardEditPopup