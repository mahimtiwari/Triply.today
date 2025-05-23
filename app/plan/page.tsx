"use client";
import React, { use, useEffect, useRef, useState } from 'react'
import Header from '../components/header'; 
import Map from '../components/map'; 
import { set } from 'date-fns';
import Image from 'next/image';
import countryToCurrency from 'country-to-currency';
import MiscComponent from '../components/miscComponent';
const PlanTrip = () => {



interface Place {
  category: string;
  name: string;
  cost: string;
  time: string;
  from: string;
  to: string;
  preffered_transport: string;
}

interface ArrivingOrDeparting {
  from: string;
  to: string;
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



 const [tripDetails, setTripDetails] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    peopleType: '',
    adults: '',
    children: '',
  });



const [dataJSON, setDataJSON] = useState<Trip | null>(null);
const [sideSelected, setSideSelected] = useState("itin");


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



const updateTotalCostDetails = (costDetails: CostDetailsType) => {
  costDetails.totalcost = costDetails.totaltransportation + costDetails.totalhotel + costDetails.totalfood + costDetails.totalsightseeing;
  costDetails.totalcost = costDetails.totalcost + (costDetails.shopping || 0) + (costDetails.insurance || 0) + (costDetails.visa || 0) + (costDetails.other || 0);
  setTotalCost(costDetails.totalcost);
}
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

}  

const costProcessor = (data: Trip): CostDetailsType => {
  // Implementation goes here
  const costD: CostDetailsType = {
    days: {},
    totalcost: 0,
    totaltransportation: 0,
    totalhotel: 0,
    totalfood: 0,
    totalsightseeing: 0,
  };


  const trip = data.trip.trip;
  const transportation = data.trip.transportation;
  

  var totalTransportation = 0;
  var totalHotel = 0;
  var totalFood = 0;
  var totalSightseeing = 0;
  

  for (const day in trip) {
    var hNumber = 0;
    var hotelCost = 0;
    var foodCost = 0;
    var sightseeingCost = 0;
    var transportCost = 0;

    for (const place of trip[day].places) {

      if (place.category.toLocaleLowerCase() === "hotel" && hNumber === 0) {
        hotelCost = parseInt(place.cost.replace(/[^0-9.-]+/g, ""));
        hNumber++;
      }
      if (place.category.toLocaleLowerCase() === "restaurant") {
        foodCost += parseInt(place.cost.replace(/[^0-9.-]+/g, ""));
      }
      if (place.category.toLocaleLowerCase() === "sightseeing") {
        sightseeingCost += parseInt(place.cost.replace(/[^0-9.-]+/g, ""));
      }
      transportCost += getTransportationCost(transportation, place.from, place.to, place.preffered_transport);
    
    }
    const dayTotalCost = hotelCost + foodCost + sightseeingCost + transportCost;
    costD.days[day] = {
      daytotalcost: dayTotalCost,
      subcosts: {
        transportation: transportCost,
        hotel: hotelCost,
        food: foodCost,
        sightseeing: sightseeingCost,
      },
    };
    totalTransportation += transportCost;
    totalHotel += hotelCost;
    totalFood += foodCost;
    totalSightseeing += sightseeingCost;

  }
  costD.totalcost = totalTransportation + totalHotel + totalFood + totalSightseeing;
  costD.totaltransportation = totalTransportation;
  costD.totalhotel = totalHotel;
  costD.totalfood = totalFood;
  costD.totalsightseeing = totalSightseeing;

  return costD;
};

const [totalCost, setTotalCost] = useState(0);

const costDetailsRef = useRef< CostDetailsType | null >(null);
const [costType, setCostType] = useState("day");
const [miscInputValue, setMiscInputValue] = useState(0);
const miscInputValueRef = useRef<HTMLInputElement>(null);
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);
  useEffect(() => {
    // Getting the data from /plantrip api

    let locData: string;

    fetch('https://ipinfo.io/json')
      .then((res) => res.json())
      .then((locationData) => {
        locData = `${locationData.city}, ${locationData.region}, ${locationData.country}`;
        
        const countryCode:string = locationData.country;
        const currencyCode: string = countryToCurrency[countryCode as keyof typeof countryToCurrency];
        // setCurrencySymbol(new Intl.NumberFormat('en-US', {
        //   style: 'currency',
        //   currency: currencyCode,
        // }).format(0).replace(/\d/g, '').trim().replace('.', ''));
        setCurrencySymbol("$")

        fetch(`/api/plantrip?${params.toString()}&clientLocation=${locData}`)
          .then((response) => response.json())
          .then((data) => {
            costDetailsRef.current = costProcessor(data);
            setTotalCost(costDetailsRef.current.totalcost);

            setDataJSON(data);
          })
          .catch((error) => {
            console.error('Error fetching trip data:', error);
          });
          })


      .catch((err) => {
        console.error("Error fetching location:", err);
      });
      
    const params = new URLSearchParams(window.location.search);
    setTripDetails({
      destination: params.get('destination') || '',
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      budget: params.get('budget') || '',
      peopleType: params.get('peopleType') || '',
      adults: params.get('adults') || '',
      children: params.get('children') || '',
    });
    

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);

    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

  }, []);

  const [leftWidth, setLeftWidth] = useState(50); // in percentage
  const [drag_direction, setDragDirection] = useState<string | null>(null);
  const isDragging = useRef(false);
  const prevLeftWidth = useRef(leftWidth);
const startDrag = () => {
    isDragging.current = true;
  };

  const onDrag = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    setLeftWidth(newLeftWidth); 
    
    const tolerance = 0.25; 
    if (Math.abs(newLeftWidth - prevLeftWidth.current) > tolerance) {
      setDragDirection(newLeftWidth > prevLeftWidth.current ? 'right' : 'left');
    }
    
    prevLeftWidth.current = newLeftWidth;
  };

  const stopDrag = () => {
    isDragging.current = false;

    setDragDirection(null);
  };
const [dayExpanded, setDayExpanded] = useState<null | string>(null);

  return (
    <>
<div className='flex flex-col h-screen'>
<div className="flex flex-row flex-grow ">

      <div className="h-[100vh] flex min-w-[600px]" style={{ width: `${leftWidth}%`}}>
        
        <div className='h-full w-[90px] font-[geist] flex items-center flex-col justify-start bg-white border-r-[1px] border-gray-300'>
          <div className='text-3xl font-semibold mt-[20px] text-gray-400'><a href='/'>t</a></div>
          <div className='mt-auto text-gray-600 w-full mb-auto gap-5 flex flex-col font-semibold'>
            <button className='flex outline-0 justify-center py-2 w-full flex-col cursor-pointer transition-all duration-200 ease-in-out'  onClick={
              () => setSideSelected("itin")}
              style={{ backgroundColor: sideSelected === "itin" ? "#f0f0f0" : "transparent", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px"  }}
              >
            <Image 
              src={'/img/itin.svg'} 
              width={20} 
              className='mx-auto'
              height={20} 
              alt='itin' 
              style={{ filter: 'invert(50%) sepia(0%) saturate(0%) brightness(80%)' }} // Adjust color to gray using CSS filter
            />
            <span>Itin</span>
            </button>
            <button className='flex outline-0 justify-center py-2 w-full flex-col cursor-pointer transition-all duration-200 ease-in-out'  onClick={
              () => setSideSelected("plan")}
              style={{ backgroundColor: sideSelected === "plan" ? "#f0f0f0" : "transparent", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px"  }}
              >
            <Image 
              src={'/img/mapmarker.svg'} 
              width={20} 
              className='mx-auto'
              height={20} 
              alt='marker' 
              style={{ filter: 'invert(50%) sepia(0%) saturate(0%) brightness(80%)' }} // Adjust color to gray using CSS filter
            />
            <span>Plan</span>
            </button>
            <button className='flex outline-0 justify-center py-2 w-full flex-col cursor-pointer transition-all duration-200 ease-in-out' 
            onClick={
              () => setSideSelected("cost")}
              style={{ backgroundColor: sideSelected === "cost" ? "#f0f0f0" : "transparent", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
            >
            <Image 
              src={'/img/cost.webp'} 
              width={20} 
              className='mx-auto'
              height={20} 
              alt='marker' 
              style={{ filter: 'invert(50%) sepia(0%) saturate(0%) brightness(80%)' }} // Adjust color to gray using CSS filter
            />
            <span>Cost</span>
            </button>
            <button className='flex outline-0 justify-center py-2 w-full flex-col cursor-pointer transition-all duration-200 ease-in-out' 
            onClick={
              () => setSideSelected("play")
            }
              style={{ backgroundColor: sideSelected === "play" ? "#f0f0f0" : "transparent", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
            >
            <Image 
              src={'/img/play.webp'} 
              width={20} 
              className='mx-auto'
              height={20} 
              alt='marker' 
              style={{ filter: 'invert(50%) sepia(0%) saturate(0%) brightness(80%)' }} // Adjust color to gray using CSS filter
            />
            <span>Play</span>
            </button>
            <button className='flex outline-0 justify-center py-2 w-full flex-col cursor-pointer transition-all duration-200 ease-in-out' 
            onClick={
              () => setSideSelected("bag")
            }
              style={{ backgroundColor: sideSelected === "bag" ? "#f0f0f0" : "transparent", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
            >
            <Image 
              src={'/img/backpack.svg'} 
              width={20} 
              className='mx-auto'
              height={20} 
              alt='marker' 
              style={{ filter: 'invert(50%) sepia(0%) saturate(0%) brightness(80%)' }} // Adjust color to gray using CSS filter
            />
            <span>Bag</span>
            </button>
          </div>
        </div>
        <div className="flex font-[geist] flex-col h-full overflow-y-auto overflow-x-hidden w-full">
          <div className='flex justify-between flex-row h-[100px] w-full bg-white border-b-[1px] border-gray-300'>
            <div className='flex items-left my-auto flex-col p-2 pl-4 font-[geist] text-gray-700 font-bold '>
              {tripDetails.destination.split(",").length > 0 && (
              <>
                <span className='text-[25px] h-fit bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text'>{tripDetails.destination.split(",")[0]}</span>
                <span className='text-[12px]'>{`${tripDetails.startDate.split("-")[2]} ${monthNames[parseInt(tripDetails.startDate.split("-")[1])]} - ${tripDetails.endDate.split("-")[2]} ${monthNames[parseInt(tripDetails.endDate.split("-")[1])]}`}</span>
              </>
              )}
              </div>
              {dataJSON?.trip?.trip && (
                <div className="flex flex-col my-auto mr-4 items-right font-[geist] select-none">
                  <span className={`bg-gradient-to-r ${ tripDetails.budget.toLowerCase()==="luxury" ? "from-yellow-400 via-yellow-500 to-yellow-600" : "from-green-300 via-green-500 to-green-600"} text-white px-3 py-1 rounded-full text-xl font-semibold`}>{currencySymbol}{totalCost}</span>
                  {/* <span className={`text-right text-[13px] font-semibold ${tripDetails.budget === "Luxury" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text" : ""}`}>{tripDetails.budget}</span> */}
                </div>
              )}
</div>
          {/* Itenary DIV */}

            <div className='bg-[#f9fcfd] w-full h-full'>
          

          {sideSelected === "itin" && (
          <div className='h-full w-full bg-white'>
            <div>
                <table className="w-full table-auto">
                <thead className="">
                  <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    <span className='flex flex-row gap-2 items-center'>
                    <Image
                      src={`/img/day.svg`}
                      width={20}
                      height={20}
                      alt="day"
                    />
                    Days</span></th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    <span className='flex flex-row gap-2 items-center'>
                    <Image
                      src={`/img/mapmarker.svg`}
                      width={20}
                      height={20}
                      alt="day"
                    />
                    Destination</span></th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    <span className='flex flex-row gap-2 items-center'>
                    <Image
                      src={`/img/cost.webp`}
                      width={20}
                      height={20}
                      alt="day"
                    />
                    Cost</span></th>
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
                    <td className="px-6 py-5 text-gray-800 font-medium">

                    
                      {`Day ${day.replace("day", "")}`}
                    
                    </td>
                    <td className="px-6 py-4 text-gray-700">{tripInfo.destination}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">{currencySymbol}{costDetailsRef.current?.days[day].daytotalcost}</td>
                    <td className="p-3 select-none">
                      <a className='flex cursor-pointer flex-row gap-2 text-green-600 font-semibold items-center justify-center p-3 rounded-4xl hover:bg-green-100 transition duration-200 ease-in-out border-1 border-green-400'>
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
          
          )}



          {sideSelected === "plan" && (
            
            <div className='h-full w-full bg-white'>

              { !dataJSON && (
                <>
                {Array.from({ length: 7 }, (_, index) => (
                <div key={index} className="animate-pulse bg-gray-200 h-6 my-6 mx-3  rounded"></div>
                
              ))}
              </>
              )}

              { dataJSON?.trip?.trip && Object.entries(dataJSON.trip.trip).map(([day, tripInfo]) => (
                <div key={day} className="bg-white border-b-1 border-gray-300 p-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setDayExpanded(dayExpanded === day ? null : day)}>
                    <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}<span className='font-medium ml-4'>( {tripInfo.destination} )</span></h2>
                    <span className="text-sm font-medium text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
                  </div>
                  {dayExpanded === day && (
                    <div className="mt-4">
                      {tripInfo.places.map((place, index) => (
                        <div key={index} className="flex flex-col bg-[#e1e1e148] rounded-lg shadow-md p-4 mb-4">
                          {/* Header Section */}
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

                          {/* Timing Section */}
                          <div className="mt-4 border-t-[2px] border-gray-300 pt-4">
                          <div className="flex items-center justify-between font-semibold">
                            <div className="flex items-center gap-2">

                            <span className="text-sm text-gray-500">{`From: ${place.from}`}</span>
                            </div>
                            <div className="flex items-center gap-2">

                            <span className="text-sm text-gray-500">{`To: ${place.to}`}</span>
                            </div>
                          </div>
                          </div>

                          {/* Transport Section */}
                          <div className="mt-4 flex items-center justify-between">

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>


          )}



          {sideSelected === "cost"  && (
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


              { !dataJSON && (
                <>
                {Array.from({ length: 7 }, (_, index) => (
                <div key={index} className="animate-pulse bg-gray-200 h-6 my-6 mx-3  rounded"></div>
              ))}
              </>
              )}

              {dataJSON?.trip?.trip && costType==="day" && Object.entries(dataJSON.trip.trip).map(([day, tripInfo]) => (
                <div key={day} className="bg-white border-b-1 border-gray-300 p-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setDayExpanded(dayExpanded === day ? null : day)}>
                    <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}<span className='font-medium ml-4'>( {tripInfo.destination} )</span></h2>
                    <span className="bg-gradient-to-r mr-6 ml-auto from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {currencySymbol}{costDetailsRef.current!.days[day].daytotalcost}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
                  </div>
                  {dayExpanded === day && (
                    <div className="mt-4">
                      {tripInfo.places.map((place, index) => (
                        <div key={index} className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4 mb-4">
                          {/* Header Section */}
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
                          {/* Timing Section */}
                          <div className="mt-4 border-t-[2px] border-gray-300 pt-4">
                          <div className="flex items-center justify-between font-semibold">
                            <div className="flex items-center gap-2">

                            <span className="text-sm text-gray-500">{`From: ${place.from}`}</span>
                            </div>
                            <div className="flex items-center gap-2">

                            <span className="text-sm text-gray-500">{`To: ${place.to}`}</span>
                            </div>
                          </div>
                          </div>
                          {/* Transport Section */}
                          <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-gradient-to-r from-blue-300 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {place.preffered_transport}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gradient-to-r from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ${getTransportationCost(dataJSON.trip.transportation, place.from, place.to, place.preffered_transport)}
                            </span>
                          </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {dataJSON?.trip?.trip && costType==="misc" && (
                <div className='p-5 flex flex-col gap-7'>

                  <MiscComponent name='Shopping' inpval={costDetailsRef.current!.shopping || 0} onChange={(value) => {
                    costDetailsRef.current!.shopping = value;
                    updateTotalCostDetails(costDetailsRef.current!);
                  }} />
                  <MiscComponent name='Insurance' inpval={costDetailsRef.current!.insurance || 0} onChange={(value) => {
                    costDetailsRef.current!.insurance = value;
                    updateTotalCostDetails(costDetailsRef.current!);
                  }} />
                  <MiscComponent name='Visa' inpval={costDetailsRef.current!.visa || 0} onChange={(value) => {
                    costDetailsRef.current!.visa = value;
                    updateTotalCostDetails(costDetailsRef.current!);
                  }} />
                  <MiscComponent name='Other' inpval={costDetailsRef.current!.other || 0} onChange={(value) => {
                    costDetailsRef.current!.other = value;
                    updateTotalCostDetails(costDetailsRef.current!);
                  }} />

                </div>
              )}


              {dataJSON?.trip?.trip && costType==="total" && (
              
                <div className='p-5 flex flex-col gap-1'>
                  {Object.entries(costDetailsRef.current!.days).map(([day, costDetails]) => (
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
                      <span>{currencySymbol}{costDetailsRef.current!.shopping || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Insurance:</span>
                      <span>{currencySymbol}{costDetailsRef.current!.insurance || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Visa:</span>
                      <span>{currencySymbol}{costDetailsRef.current!.visa || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Other:</span>
                      <span>{currencySymbol}{costDetailsRef.current!.other || 0}</span>
                    </div>
                    <div className="flex justify-between text-[15px] font-semibold text-gray-500">
                      <span>Misc Total:</span>
                      <span>{currencySymbol}{(costDetailsRef.current!.shopping || 0) + (costDetailsRef.current!.insurance || 0) + (costDetailsRef.current!.visa || 0) + (costDetailsRef.current!.other || 0)}</span>
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

          )}

          
          {sideSelected === "play" && (
            <div>Animation Here</div>
          )}

          {sideSelected === "bag" && (
            <div>Thing to carry here</div>
          )}

          </div>



        </div>

      </div>

{/* Divider Scroller */}
<div
  className="relative w-[1px] bg-gray-300 cursor-grab z-20 group"
  onMouseDown={startDrag}
>
  <span
    className="absolute select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 rounded-full w-5 h-12 flex items-center justify-center text-sm font-bold text-gray-700 group-hover:scale-110 transition-transform duration-200 ease-in-out"
    style={{
      transition: "all 0.3s ease-in-out",
      color: "blue",

      ...(drag_direction === 'right'
        ? { width: "30px", borderRadius: "0 50% 50% 0", translate: "0 -50%" }
        : drag_direction === 'left'
        ? { width: "30px", borderRadius: "50% 0 0 50%", translate: "-100% -50%" }
        : {})
    }}
  >
    {drag_direction === "right" ? ">" : drag_direction === "left" ? "<" : ""}
  </span>
</div>


        {/* Map DIV */}

          <div className={`flex-grow ${ sideSelected !== "cost" ? "block" : "hidden" }`}>
            <Map />
          </div>
          <div className={`flex-grow ${ sideSelected === "cost" ? "block" : "hidden" }`}>
            Graphs Here!!!
            
          </div>


      </div>
</div>






    </>
  )
}
export default PlanTrip
