"use client";
import React, { useState } from 'react'
import Image from 'next/image';
import MiscComponent from '@/app/components/miscComponent';
import ReactDOM from 'react-dom';
import CardEditPopup from './CardEditPopup';
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

interface GraphicalCostData {
    expByCategory: {name: string, value: number}[],
    stackedDayData: {name: string, transportation: number, hotel: number, food: number, sightseeing: number}[],
    miscCosts: {name: string, value: number}[],
    
}

interface CostSectionComponentProps{
    costType:string,
    setCostType: (type: string) => void;
    dayExpanded: string|null;
    setDayExpanded: (day: string | null) => void;
    dataJSON: Trip | null;
    currencySymbol: string;
    costDetailsRef: CostDetailsType;
    graphicalCostDataRef: GraphicalCostData | null;
    setGraphCostRef: (data: GraphicalCostData) => void;
    setTotalCost: (cost: number) => void;
    totalCost?: number;
    changeData: (data: Trip | null) => void;
}



const CostSectionComponent = ({ costType, setCostType, dayExpanded, setDayExpanded, dataJSON, currencySymbol, costDetailsRef, graphicalCostDataRef, setGraphCostRef, setTotalCost, totalCost, changeData }:CostSectionComponentProps) => {


    const getTransportationCost = (transportation: Transportation[], from:string, to:string, prefOption:string): number => {

        for (const transport of transportation) {
            if (transport.from === from && transport.to === to) {
            for (const option of transport.options) {
                if (option.type === prefOption) {
                return parseInt(option.cost.replace(/[^0-9.-]+/g, ""));
                }
            }
            }
        }
        return 0;
    
    };
    

    const updateGraphicalCostData = (costDetails: CostDetailsType) => {
    const expByCategory = [
        { name: 'Transportation', value: costDetails.totaltransportation },
        { name: 'Hotel', value: costDetails.totalhotel },
        { name: 'Food', value: costDetails.totalfood },
        { name: 'Sightseeing', value: costDetails.totalsightseeing },
        { name: 'Shopping', value: costDetails.shopping || 0 },
        { name: 'Insurance', value: costDetails.insurance || 0 },
        { name: 'Visa', value: costDetails.visa || 0 },
        { name: 'Other', value: costDetails.other || 0 },
    ].filter(item => item.value !== 0);

    const stackedDayData = Object.entries(costDetails.days).map(([day, details]) => ({
        name: `Day ${day.replace("day", "")}`,
        transportation: details.subcosts.transportation,
        hotel: details.subcosts.hotel,
        food: details.subcosts.food,
        sightseeing: details.subcosts.sightseeing,
    }));
    const miscCosts = [
        { name: 'Shopping', value: costDetails.shopping || 0 },
        { name: 'Insurance', value: costDetails.insurance || 0 },
        { name: 'Visa', value: costDetails.visa || 0 },
        { name: 'Other', value: costDetails.other || 0 },
    ].filter(item => item.value !== 0);

    setGraphCostRef({
        expByCategory,
        stackedDayData,
        miscCosts: miscCosts,
    });
    }

    const updateTotalCostDetails = (costDetails: CostDetailsType) => {
    costDetails.totalcost = costDetails.totaltransportation + costDetails.totalhotel + costDetails.totalfood + costDetails.totalsightseeing;
    costDetails.totalcost = costDetails.totalcost + (costDetails.shopping || 0) + (costDetails.insurance || 0) + (costDetails.visa || 0) + (costDetails.other || 0);
    
    
    updateGraphicalCostData(costDetails);
    setTotalCost(costDetails.totalcost);
    }


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
      prereviousPlaceName: dataJSON?.trip.trip[day].places[placeIndex].name || ""
    });
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
        <div className='w-full flex pl-4 border-b-[1px] border-gray-300'>
        <button 
        className={`px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out ${costType === "day" ? 'border-b-[3px] border-blue-500 text-blue-600' : 'border-b-[3px] border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'}`} 
        onClick={() => setCostType("day")}>
        Day
        </button>
        <button 
        className={`px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out ${costType === "misc" ? 'border-b-[3px] border-blue-500 text-blue-600' : 'border-b-[3px] border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'}`} 
        onClick={() => setCostType("misc")}>
        Misc
        </button>
        <button 
        className={`px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out ${costType === "total" ? 'border-b-[3px] border-blue-500 text-blue-600' : 'border-b-[3px] border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'}`} 
        onClick={() => setCostType("total")}>
        Total
        </button>
        </div>
        <div></div>
        { !dataJSON && (
        <>
        {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className="animate-pulse bg-gray-200 h-6 my-6 mx-3  rounded"></div>
        ))}
        </>
        )}

        {dataJSON?.trip?.trip && costType==="day" && Object.entries(dataJSON.trip.trip).map(([day, tripInfo]) => (
        <div key={day} className="bg-white border-b-1 border-gray-300 p-4" id={`${day}-cost`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setDayExpanded(dayExpanded === day ? null : day)}>
            <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}<span className='font-medium ml-4'>( {tripInfo.destination} )</span></h2>
            <span className="bg-gradient-to-r mr-6 ml-auto from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currencySymbol}{costDetailsRef.days[day].daytotalcost}
            </span>
            <span className="text-sm font-medium text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
            </div>
            {dayExpanded === day && (
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

                    <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium ">{tripInfo.arriving.preffered_transport} Cost:</span>
                    <span className="bg-gradient-to-r from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currencySymbol}{getTransportationCost(dataJSON.trip.transportation, tripInfo.arriving.from, tripInfo.arriving.to, tripInfo.arriving.preffered_transport)}
                    </span>
                    </div>

                </div>
                )}

                <div className='h-[20px] w-full flex items-center deskver:opacity-50 opacity-100 deskver:hover:opacity-100 my-1 py-2 px-3'
                  style={{
                    transition: 'opacity 300ms ease-in-out',
                    cursor: 'pointer',
                  }}
                >
                  <button 
                  onClick={()=>{

                    addPlace(day, 0);

                  }}
                  className='h-[3px] rounded-full w-full bg-[#0099ff] flex items-center justify-center cursor-pointer'>
                    <div className='h-5 w-5 rounded-full bg-[#0099ff] flex items-center justify-center'>
                      <span 
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 16,
                          color: 'white',
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
                    key={index} 
                    className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">

                    { place.category.toLowerCase() !== "intermediate_transport" && (
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
                    <p className="text-sm text-gray-500 flex gap-2">                             
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
                    <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {place.cost}
                    </span>
                    </div>
                    </div>
                    )}

                    {/* Transportation Section */}
                    <div className={`${ place.category.toLowerCase() !== "intermediate_transport" ? "mt-4 border-t-[2px] border-gray-300 pt-4" : "pt-1"} `}>
                    <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">

                    <span className="text-sm text-gray-500">{`From: ${place.from}`}</span>
                    </div>
                    <div className="flex items-center gap-2">

                    <span className="text-sm text-gray-500">{`To: ${place.to}`}</span>
                    </div>
                    </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-300 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {place.preffered_transport}
                    </span>
                    </div>
                    <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currencySymbol}{getTransportationCost(dataJSON.trip.transportation, place.from, place.to, place.preffered_transport)}
                    </span>
                    </div>
                    </div>
                </div>

                <div className='h-[20px] w-full flex items-center deskver:opacity-50 opacity-100 deskver:hover:opacity-100 my-1 py-2 px-3'
                  style={{
                    transition: 'opacity 300ms ease-in-out',
                    cursor: 'pointer',
                  }}
                >
                  <button 
                  onClick={()=>{

                    addPlace(day, index);

                  }}
                  className='h-[3px] rounded-full w-full bg-[#0099ff] flex items-center justify-center cursor-pointer'>
                    <div className='h-5 w-5 rounded-full bg-[#0099ff] flex items-center justify-center'>
                      <span 
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 16,
                          color: 'white',
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

                    <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium ">{tripInfo.departing.preffered_transport} Cost:</span>
                    <span className="bg-gradient-to-r from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currencySymbol}{getTransportationCost(dataJSON.trip.transportation, tripInfo.departing.from, tripInfo.departing.to, tripInfo.departing.preffered_transport)}
                    </span>
                    </div>

                </div>
                )}
            </div>
            )}
        </div>
        ))}

        {dataJSON?.trip?.trip && costType==="misc" && (

        <div className='p-5 flex flex-col gap-7'>
            <MiscComponent name='Shopping' inpval={costDetailsRef.shopping || 0} onChange={(value) => {
            costDetailsRef.shopping = value;
            updateTotalCostDetails(costDetailsRef);
            }} 
            code={currencySymbol ? currencySymbol : "$"}
            />
            <MiscComponent name='Insurance' inpval={costDetailsRef.insurance || 0} onChange={(value) => {
            costDetailsRef.insurance = value;
            updateTotalCostDetails(costDetailsRef);
            }} 
            code={currencySymbol ? currencySymbol : "$"}
            />
            <MiscComponent name='Visa' inpval={costDetailsRef.visa || 0} onChange={(value) => {
            costDetailsRef.visa = value;
            updateTotalCostDetails(costDetailsRef);
            }} 
            code={currencySymbol ? currencySymbol : "$"}
            />
            <MiscComponent name='Other' inpval={costDetailsRef.other || 0} onChange={(value) => {
            costDetailsRef.other = value;
            updateTotalCostDetails(costDetailsRef);
            }} 
            code={currencySymbol ? currencySymbol : "$"}
            
            />

        </div>
        )}


        {dataJSON?.trip?.trip && costType==="total" && (
        
        <div className='p-5 flex flex-col gap-1'>
            {Object.entries(costDetailsRef.days).map(([day, costDetails]) => (
            <div key={day} className="bg-white p-1">
                <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}</h2>
                </div>
                <div className="">
                    <div className="flex justify-between text-sm text-gray-500">
                    <span>Transportation:</span>
                    <span>{currencySymbol}{costDetails.subcosts.transportation}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                    <span>Hotel:</span>
                    <span>{currencySymbol}{costDetails.subcosts.hotel}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                    <span>Food:</span>
                    <span>{currencySymbol}{costDetails.subcosts.food}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                    <span>Sightseeing:</span>
                    <span>{currencySymbol}{costDetails.subcosts.sightseeing}</span>
                    </div>
                    <div className="flex justify-between text-[15px] font-semibold text-gray-500">
                    <span>Day Total:</span>
                    <span>{currencySymbol}{costDetails.daytotalcost}</span>
                    </div>
                </div>
            </div>
            ))}
            <div className="p-1">
            <h2 className="text-lg font-bold text-gray-700">Misc</h2>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Shopping:</span>
                <span>{currencySymbol}{costDetailsRef.shopping || 0}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Insurance:</span>
                <span>{currencySymbol}{costDetailsRef.insurance || 0}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Visa:</span>
                <span>{currencySymbol}{costDetailsRef.visa || 0}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Other:</span>
                <span>{currencySymbol}{costDetailsRef.other || 0}</span>
            </div>
            <div className="flex justify-between text-[15px] font-semibold text-gray-500">
                <span>Misc Total:</span>
                <span>{currencySymbol}{(costDetailsRef.shopping || 0) + (costDetailsRef.insurance || 0) + (costDetailsRef.visa || 0) + (costDetailsRef.other || 0)}</span>
            </div>
            </div>
            <div className="py-4 px-3 border-t-2 border-b-2 border-gray-400">
            <div className="flex justify-between text-sm font-semibold text-gray-500">
                <span className='text-xl text-black '>Grand Total</span>
                <span className='text-xl text-black'>{currencySymbol}{totalCost}</span>
            </div>
            </div>
        </div>
        
        )}

    </div>
</>
  )
}

export default CostSectionComponent