"use client";
import React, { useState } from 'react'
import Image from 'next/image';
import CardEditPopup from './CardEditPopup';
import ReactDOM from 'react-dom';
import { CurrencyEuroIcon } from '@heroicons/react/24/outline';
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


interface PlanSectionComponentProps {
    dataJSON: Trip | null;
    dayExpanded: string|null;
    currencySymbol: string;
    setDayExpanded: (day: string | null) => void;
    changeData: (data: Trip | null) => void;
    expandAllDays: boolean;
  }

const PlanSectionComponent = ({ dataJSON, dayExpanded, currencySymbol, setDayExpanded, changeData, expandAllDays}: PlanSectionComponentProps) => {
  
const [editPopUpData, setEditPopUpData] = useState<{
  day: string;
  place: Place;
  placeIndex: number;
  prereviousPlaceName: string;
} | null>(null);


  function editPopUp(day: string, place: Place, placeIndex: number, prereviousPlaceName:string) {
  

    setEditPopUpData({ day, place, placeIndex, prereviousPlaceName });
  

  }


  const [newPlace, setNewPlace] = useState< {
    day: string;
    place: Place;
    placeIndex: number;
    prereviousPlaceName: string;
  } | null >(null);

  function addPlace(day:string, placeIndex:number){
    
    setNewPlace({
      day,
      place: {
        category: "",
        name: "",
        cost: "",
        time: "",
        from: "",
        to: "",
        preffered_transport: "",
      },
      placeIndex,
      prereviousPlaceName: !(placeIndex === 0 && day.toLowerCase().replace("day", "").trim() == "1") ? (dataJSON?.trip.trip[day].places[placeIndex].name || "") : dataJSON?.trip.trip["day1"].arriving?.to || "",
    });
  }


  
  function getTimeFraction(time: string): number {
    if ("12:00am" == time.toLowerCase().trim().replace(" ", "")) return 0;
    if ("12:00pm" == time.toLowerCase().trim().replace(" ", "")) return 0.5;
    const minSince12 = parseInt(time.split(":")[0].trim())*60+(parseInt(time.split(":")[1].trim().toLowerCase().replace("am","").replace("pm", "")) || 0) + (time.toLowerCase().includes("pm") ? 12 : 0)*60;
    return minSince12 / (60*24);
  }



  return (
  <>

    { (editPopUpData || newPlace ) && ReactDOM.createPortal(
      <CardEditPopup
        preData={newPlace ? newPlace : editPopUpData}
        onClose={() => {
          setEditPopUpData(null);
          setNewPlace(null);
        }}
        currencySymbol={currencySymbol}
        onSave={(newDataJSON) => {
          changeData(newDataJSON);
        }}
        dataJSON={dataJSON}
        newPlace={newPlace !== null}

      />,
      document.body
    )}


    <div className='h-full w-full bg-white'>
      { !dataJSON && (
        <>
        {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className="animate-pulse bg-gray-200 h-6 my-6 mx-3  rounded"></div>
        
      ))}
      </>
      )}

      { dataJSON?.trip?.trip && Object.entries(dataJSON.trip.trip).map(([day, tripInfo]) => (
        <div 
        key={day} className="bg-white border-b-1 border-gray-300 p-4" id={`${day}-plan`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={(e) => {
            setDayExpanded(dayExpanded === day ? null : day);
            // console.log("Clicked Day:", day);
            // document.getElementById(`${day}-plan`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

}}>
            <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}<span className='font-medium ml-4'>( {tripInfo.destination} )</span></h2>
            <span className="text-sm font-medium text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
          </div>
          {(expandAllDays ? true : dayExpanded === day) && (
            <div className="mt-4 flex flex-col gap-1">
              {tripInfo.arriving && (
                <div className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Arriving</h3>
                  <span className="bg-gradient-to-r from-blue-300 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {tripInfo.arriving.preffered_transport}
                  </span>
                  </div>
                  <div className="mt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">
                
                    <span className="text-sm text-gray-500">{`From: ${tripInfo.arriving.from}`}</span>
                    </div>
                    <div className="flex items-center gap-2">

                    <span className="text-sm text-gray-500">{`To: ${tripInfo.arriving.to}`}</span>
                    </div>
                  </div>
                  </div>
                </div>
              )}
                <div className='h-[20px] w-full flex items-center opacity-100 deskver:hover:opacity-100 my-1 py-2 px-3'
                  style={{
                    transition: 'opacity 300ms ease-in-out',
                    cursor: 'pointer',
                  }}
                >
                  <button 
                  onClick={()=>{

                    addPlace(day, 0);

                  }}
                  className='h-[3px] rounded-full w-full bg-transparent flex items-center justify-center cursor-pointer'>
                    <div className='h-5 w-5 rounded-full bg-[transparent] hover:bg-[#0099ff] flex items-center justify-center'>
                      <span 
                        className="material-symbols-outlined hover:text-white text-gray-400"
                        style={{
                          fontSize: 16,
                        }}
                      >add</span>
                    </div>
                  </button>

                </div>
              {tripInfo.places.map((place, index) => (
                <React.Fragment key={index}>
                <div 
                onClick={()=>{
                  editPopUp(day, place, index, place.from);
                }}

                key={index} className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4"
                  
                >
                  
                  {/* Header Section */}
                  {place.category.toLowerCase() !== "intermediate_transport" && (
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                    src={`/img/${place.category.toLowerCase()}.png`}
                    width={40}
                    height={40}
                    alt="category"
                    className="rounded-full"
                    style={{
                      filter:
                      'invert(20%) sepia(50%) saturate(300%) hue-rotate(200deg) brightness(90%) contrast(85%)',
                    }}
                    />
                    <div>
                    <h3 className="text-lg font-semibold text-gray-700">{place.name}</h3>
                    <p className="text-sm text-gray-500  font-semibold flex gap-2">                             
                      <Image
                      src={`/img/clock.svg`}
                      width={15}
                      height={15}
                      alt="clock"
                      className="rounded-full"
                      style={{
                      filter:
                        'invert(20%) sepia(50%) saturate(300%) hue-rotate(200deg) brightness(90%) contrast(85%)',
                      }}
                    /> {place.time}</p>
                    </div>
                  </div>
                  </div>
                  )}
                  <div className='w-full flex flex-row h-[2px] my-4 bg-gray-300 rounded-full'>
                    <div 
                    style={{
                      width: `${index !== 0 ? (getTimeFraction(tripInfo.places[index-1].time) * 100) : 0}%`,
                    }}
                    className='h-full bg-transparent'>

                    </div>
                    <div 
                    style={{
                      width: `${(index !== tripInfo.places.length - 1 ? (getTimeFraction(place.time) * 100) : 100) - (index !== 0 ? (getTimeFraction(tripInfo.places[index-1].time) * 100) : 0)}%`,
                    }}
                    className='h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>

                    </div>
                  </div>
                  <div>
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">

                    <span className="text-sm text-gray-500">{`From: ${place.from}`}</span>
                    </div>
                    <div className="flex items-center gap-2">

                    <span className="text-sm text-gray-500">{`To: ${place.to}`}</span>
                    </div>
                  </div>
                  {place.category !== "intermediate_transport" && place.description && (
                    <div className="mt-2 text-sm text-gray-600 italic bg-gray-200 p-3 rounded-lg shadow-inner border-l-4 border-blue-300">
                      {place.description}
                    </div>
                  )}
                  </div>
                  

                </div>

                <div className='h-[20px] w-full flex items-center opacity-100 deskver:hover:opacity-100 my-1 py-2 px-3'
                  style={{
                    transition: 'opacity 300ms ease-in-out',
                    cursor: 'pointer',
                  }}
                >
                  <button 
                  onClick={()=>{

                    addPlace(day, index);

                  }}
                  className='h-[3px] rounded-full w-full bg-transparent flex items-center justify-center cursor-pointer'>
                    <div className='h-5 w-5 rounded-full bg-[transparent] hover:bg-[#0099ff] flex items-center justify-center'>
                      <span 
                        className="material-symbols-outlined hover:text-white text-gray-400"
                        style={{
                          fontSize: 16,
                        }}
                      >add</span>
                    </div>
                  </button>

                </div>

                </React.Fragment>
              ))}

              {tripInfo.departing && (
                <div className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Departing</h3>
                  <span className="bg-gradient-to-r from-blue-300 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {tripInfo.departing.preffered_transport}
                  </span>
                  </div>
                  <div className="mt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">
                
                    <span className="text-sm text-gray-500">{`From: ${tripInfo.departing.from}`}</span>
                    </div>
                    <div className="flex items-center gap-2">

                    <span className="text-sm text-gray-500">{`To: ${tripInfo.departing.to}`}</span>
                    </div>
                  </div>
                  </div>


                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </>
  )
}

export default PlanSectionComponent