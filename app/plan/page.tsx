"use client";
import React, { use, useEffect, useRef, useState } from 'react'
import Header from '../components/header'; 
import Map from '../components/map'; 
import { set } from 'date-fns';
import Image from 'next/image';
import countryToCurrency from 'country-to-currency';

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
        setCurrencySymbol(new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
        }).format(0).replace(/\d/g, '').trim().replace('.', ''));

        fetch(`/api/plantrip?${params.toString()}&clientLocation=${locData}`)
          .then((response) => response.json())
          .then((data) => {
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
    setLeftWidth(Math.min(Math.max(newLeftWidth, 10), 90)); 
    
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

      <div className="h-[100vh] flex" style={{ width: `${leftWidth}%`}}>
        

        
        <div className='h-full w-[90px] font-[geist] flex items-center flex-col justify-start bg-white border-r-[1px] border-gray-300'>
          <div className='text-3xl font-semibold mt-[20px] text-gray-400'><a href='/'>t</a></div>
          <div className='mt-auto text-gray-600 w-full mb-auto gap-5 flex flex-col font-semibold'>
            <button className='flex justify-center py-2 w-full flex-col' onClick={
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
            <button className='flex justify-center py-2 w-full flex-col' onClick={
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
            <button className='flex justify-center py-2 w-full flex-col'
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
            <button className='flex justify-center py-2 w-full flex-col'
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
            <button className='flex justify-center py-2 w-full flex-col'
            onClick={
              () => setSideSelected("Packing")
            }
              style={{ backgroundColor: sideSelected === "Packing" ? "#f0f0f0" : "transparent", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
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
            <div className='flex items-left my-auto flex-col p-2 pl-4 font-[geist] text-gray-700 font-semibold '>
              {tripDetails.destination.split(",").length > 1 && (
              <>
                <span className='text-[25px] h-fit bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text'>{tripDetails.destination.split(",")[0]}</span>
                <span className='text-[12px]'>{`${tripDetails.startDate.split("-")[2]} ${monthNames[parseInt(tripDetails.startDate.split("-")[1])]} - ${tripDetails.endDate.split("-")[2]} ${monthNames[parseInt(tripDetails.endDate.split("-")[1])]}`}</span>
              </>
              )}
              </div>
<div className="flex flex-col my-auto mr-4 items-right font-[geist]">
  <span className='bg-gradient-to-r from-green-300 via-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xl font-semibold'>{currencySymbol}22.5L</span>
  {/* <span className={`text-right text-[13px] font-semibold ${tripDetails.budget === "Luxury" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text" : ""}`}>{tripDetails.budget}</span> */}
</div>

          </div>

          {/* Itenary DIV */}

            <div className='p-2 bg-[#f9fcfd] w-full h-full'>
          

          {sideSelected === "itin" && dataJSON?.trip?.trip && (
          <div className='h-full w-full'>
            <div></div>
          </div>
          
          )}



          {sideSelected === "plan" && dataJSON?.trip?.trip && (
          
            <div>
              {Object.entries(dataJSON.trip.trip).map(([day, tripInfo]) => (
                <div key={day} className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setDayExpanded(dayExpanded === day ? null : day)}>
                    <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}</h2>
                    <span className="text-sm text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
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
                              className="rounded-full font-"
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
                          <div className="flex items-center justify-between">
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



          {sideSelected === "cost" && dataJSON?.trip?.trip && (
            <div>
              {Object.entries(dataJSON.trip.trip).map(([day, tripInfo]) => (
                <div key={day} className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setDayExpanded(dayExpanded === day ? null : day)}>
                    <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}</h2>
                    <span className="text-sm text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
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
                              className="rounded-full font-"
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
                          <div className="flex items-center justify-between">
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
                            $100
                            </span>
                          </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

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



        <div className=" flex-grow">
          <Map />
        </div>
      </div>
</div>






    </>
  )
}
export default PlanTrip
