"use client";
import React, { useEffect, useState } from 'react'
import ExportCompMediate from './exportCompMediate'



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

interface Meta {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    peopleType: string;
    adults: string;
    children: string;
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

interface PackingCardProps {
    name: string;
    values: {
        data: { name: string; checked: boolean }[];
        color?: string;
    };
    
}

interface PDFprops {
    tripDetails: Trip,
    metadata: Meta,
    pckList: PackingCardProps[],
    costData: CostDetailsType,
    currencySymbol: string;
}


const exportComp = ({tripDetails, metadata, pckList, costData, currencySymbol}:PDFprops) => {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // if (isLoading) {
  //   return (
      
      
  //     <div className="flex flex-col items-center justify-center h-full">
  //       <h1 className="text-xl font-semibold text-gray-700">Preparing Your Export</h1>
  //       <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //     </div>

  //   );
  // }


  return (
    <ExportCompMediate currencySymbol={currencySymbol} tripDetails={tripDetails} metadata={metadata} pckList={pckList} costData={costData} />
  );
}

export default exportComp