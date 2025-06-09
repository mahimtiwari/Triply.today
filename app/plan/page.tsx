"use client";
import React, { use, useEffect, useRef, useState } from 'react'
import Header from '../components/header'; 
import Map from '../components/map'; 
import { set } from 'date-fns';
import Image from 'next/image';
import countryToCurrency from 'country-to-currency';
import MiscComponent from '../components/miscComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, XAxis, CartesianGrid, YAxis, Legend, Line, BarChart, Bar } from 'recharts';
import { get } from 'http';
import PackingCard from '../components/packingCard';
import { off } from 'process';
import BufferComponent from '../components/planpageLoader';
import "../../public/css/plan.css"

const PlanTrip = () => {



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

interface GraphicalCostData {
  expByCategory: {name: string, value: number}[],
  stackedDayData: {name: string, transportation: number, hotel: number, food: number, sightseeing: number}[],
  miscCosts: {name: string, value: number}[]
}

const graphicalCostDataRef = useRef<GraphicalCostData | null>(null);

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

  graphicalCostDataRef.current = {
    expByCategory,
    stackedDayData,
    miscCosts: miscCosts,
  };
}

const updateTotalCostDetails = (costDetails: CostDetailsType) => {
  costDetails.totalcost = costDetails.totaltransportation + costDetails.totalhotel + costDetails.totalfood + costDetails.totalsightseeing;
  costDetails.totalcost = costDetails.totalcost + (costDetails.shopping || 0) + (costDetails.insurance || 0) + (costDetails.visa || 0) + (costDetails.other || 0);
  
  
  updateGraphicalCostData(costDetails);
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
    if (trip[day].arriving) transportCost += getTransportationCost(transportation, trip[day].arriving.from, trip[day].arriving.to, trip[day].arriving.preffered_transport);
    if (trip[day].departing) transportCost += getTransportationCost(transportation, trip[day].departing.from, trip[day].departing.to, trip[day].departing.preffered_transport);
    
    for (const place of trip[day].places) {
      if (place.category.toLowerCase() === "hotel" && hNumber === 0) {
        hotelCost = parseInt(place.cost.replace(/[^0-9.-]+/g, ""));
        hNumber++;
      }
      if (place.category.toLowerCase() === "restaurant") {
        foodCost += parseInt(place.cost.replace(/[^0-9.-]+/g, ""));
      }
      if (place.category.toLowerCase() === "sightseeing") {
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

const [bufferBool, setBufferBool] = useState(false);
const [serverResState, setServerResState] = useState(false);


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
        // setCurrencySymbol("$")
        console.log("Currency Code:", currencyCode);
        fetch(`/api/plantrip?${params.toString()}&clientLocation=${locData}&curcode=${currencyCode}`)
          .then((response) => response.json())
          .then((data) => {
            costDetailsRef.current = costProcessor(data);
            setTotalCost(costDetailsRef.current.totalcost);
            updateGraphicalCostData(costDetailsRef.current);
            setDataJSON(data);
            setBufferBool(true);
          })
          .catch((error) => {
            console.error('Error fetching trip data:', error);
            if (error.message.includes('503')) {
              setServerResState(true);
            }
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


const buildGmapUrl = (places: Place[]): string => {


  const bUrl: string = "https://www.google.com/maps/dir/?api=1&";

  var waypoints:string = "";
  for (let i =0; i < places.length; i++) {

    waypoints += i!== 0 ? `${places[i].from}|` : '';
  }
  
  return `${bUrl}origin=${places[0].from}&destination=${places[places.length - 1].to}&waypoints=${waypoints}`;
}
const COLORS = [
  '#ff6b6b',
  '#feca57', 
  '#48dbfb', 
  '#1dd1a1', 
  '#5f27cd', 
  '#ff9ff3',
  '#54a0ff',
  '#00d2d3', 
];

const pckList = useRef<{name: string, values: {data: { name: string; checked: boolean }[], color?: string}}[]>([

  
    {
      name: "Essentials",
      values: {
        data: [
          { name: "Passport", checked: false },
          { name: "Tickets", checked: false },
          { name: "Wallet", checked: false },
        ],
      },
    },
    {
      name: "Clothing",
      values: {
        data: [
          { name: "Shirts", checked: false },
          { name: "Pants", checked: false },
          { name: "Shoes", checked: false },
        ],
      },
    },
    {
      name: "Toiletries",
      values: {
        data: [
          { name: "Toothbrush", checked: false },
          { name: "Shampoo", checked: false },
          { name: "Soap", checked: false },
        ],
      },
    },
  

]);

const [sumCards, setSumCards] = useState<{name: string, values: {data: { name: string; checked: boolean }[], color?: string}}[]>(pckList.current);


// Dragability for Packing Cards
const packingCardContRef = useRef<HTMLDivElement | null>(null);
const packCardRef = useRef<HTMLDivElement[]>([]);
function drag_packCard(e: React.MouseEvent<HTMLDivElement>, idx: number) {
  
  if(packCardRef.current && packCardRef.current[idx] && packingCardContRef.current) {
    const card = packCardRef.current[idx];
    const containerRect = packingCardContRef.current.getBoundingClientRect();
    

      const determineNewListPos = (x: number, y: number) => {
        const draggableElements = packCardRef.current.filter((card) => card !== null);
        let closestElement: HTMLDivElement | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        draggableElements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const distance = Math.sqrt(
            Math.pow(x - (rect.left + rect.width / 2), 2) +
            Math.pow(y - (rect.top + rect.height / 2), 2)
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestElement = element;
          }
        });

        if (closestElement && packingCardContRef.current) {
          packingCardContRef.current.insertBefore(card, closestElement);
        } else if (packingCardContRef.current) {
          packingCardContRef.current.appendChild(card);
        }
      };




    const PackingCardOrderProcessor = (list: HTMLDivElement[], mevent:MouseEvent) => {
      
      const Cardrect = card.getBoundingClientRect();



      if (packingCardContRef.current) {
         var x = mevent.clientX;
        if (mevent.clientX <= containerRect.left) {
          x = containerRect.left; 
        }
        else if (mevent.clientX + Cardrect.width >= containerRect.right) {
          x = containerRect.right- Cardrect.width;
        }

        var y = mevent.clientY;
        
        if (mevent.clientY <= containerRect.top) {
          y = containerRect.top;
        } else if (mevent.clientY + Cardrect.height >= containerRect.bottom) {
          y = containerRect.bottom - Cardrect.height;
        }

        card.style.position = 'absolute';
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        card.style.zIndex = '10';
        card.style.cursor = 'grabbing';
        card.style.userSelect = 'none';
        card.style.opacity = '0.6';
        determineNewListPos(x, y);

      }

    }
    const onMouseMove = (moveEvent: MouseEvent) => {
      
      PackingCardOrderProcessor(packCardRef.current, moveEvent);
    };

    const onMouseUp = () => {
      
      card.style.position = 'static';
      card.style.cursor = 'pointer';
      card.style.userSelect = 'auto';
      card.style.opacity = '1';
      card.style.zIndex = '1';

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);



    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
const [bufSate, setBufState] = useState<boolean>(false);
// here the order matters sooooo dont forget that-------------------------
const dayTimeBufferT = [{days:14, time:60000}, {days:10, time:50000}, {days: 7, time:35000} ,{days:3, time:15000}, {days:1, time:10000}]; // this is the buffer time for the trip days, it will be used to show the loading state
// here the order matters sooooo dont forget that----------------------------------



  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);




const startDate = new Date(tripDetails.startDate);
const endDate = new Date(tripDetails.endDate);
const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
const tripDayLen = Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1;
const [progressNum, setProgressNum] = useState<number>(0);

const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(50);

const [bottomSheetRestrictedHeight, setBottomSheetRestrictedHeight] = useState<number>(50);
// Order matters here........!!!!!!!! lowest -> highest
const BottomSheetHeightVariations = [20, 50, 100]
const [bottomSheetDiff, setBottomSheetDiff] = useState<number>(0);
const bottomSheetRef = useRef<HTMLDivElement | null>(null);

const [sureHeightChangeBottomSheet, setSureHeightChangeBottomSheet] = useState<boolean>(false);
const bottomsheetYintial = useRef<number>(0);

function bottomSheetHeightStartChange(e: React.TouchEvent) {

  

  setControlMenuOpen(false)
  if (e.touches.length > 0) {
  const cont = bottomSheetRef.current?.getBoundingClientRect();
  if (cont) {
      const touch = e.touches[0];
      bottomsheetYintial.current = touch.clientY;
      setBottomSheetDiff(cont.top - touch.clientY);

    }
  }
}

function bottomSheetHeightChange(e: React.TouchEvent) {
  if (!sureHeightChangeBottomSheet && Math.abs(bottomsheetYintial.current - e.touches[0].clientY) > 50) {
    setSureHeightChangeBottomSheet(true);
  };

  if (e.touches.length > 0 && sureHeightChangeBottomSheet) {
    
    const touch = e.touches[0] ;
    const newHeight = 100 - ((touch.clientY+bottomSheetDiff) /window.innerHeight)*100;
    if (sureHeightChangeBottomSheet){
      setBottomSheetHeight(newHeight);
    }
  }
}

function bottomSheetHeightRestrictedEndChange(e: React.TouchEvent) {
  setBottomSheetHeight(prevHeight => {
    var nHeight:number = prevHeight; 
    
    if (prevHeight <= bottomSheetRestrictedHeight) {
      if (bottomSheetRestrictedHeight < BottomSheetHeightVariations[0]) {
        nHeight = BottomSheetHeightVariations[0]; 
      }
      else if (prevHeight < BottomSheetHeightVariations[1]) {
        nHeight = BottomSheetHeightVariations[0];
      }
      else if (prevHeight < BottomSheetHeightVariations[2]){
        nHeight = BottomSheetHeightVariations[1];
      }
    } else if (prevHeight > bottomSheetRestrictedHeight) {
      if (prevHeight > BottomSheetHeightVariations[0]) {
        nHeight = BottomSheetHeightVariations[1]; 
      }
      if (prevHeight > BottomSheetHeightVariations[1]) {
        nHeight = BottomSheetHeightVariations[2]; 
      }
    }
    setSureHeightChangeBottomSheet(false);
    setBottomSheetRestrictedHeight(nHeight);
    return nHeight;

    
  })
}

const [controlmenuOpen, setControlMenuOpen] = useState<boolean>(false);


useEffect(() => {
  const dayScrll = document.querySelector(`#${dayExpanded}-${sideSelected}`) as HTMLDivElement | null;
  dayScrll?.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  console.log("Day Expanded:", dayExpanded);
  setTimeout(() => {

    if (dayScrll) {
      dayScrll.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }    
  }, 0);
}, [dayExpanded])


  return (
    <>

{serverResState && (
<div className='absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-300 border-1 border-red-500 rounded-2xl p-5 z-100'>
  <span>API is Currently Overloaded. Try again later (4-5min)</span>
  <button 
  onClick={() => {setServerResState(false)}}
  className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
    ×
  </button>
</div>
)}
{/* Desk Ver */}
<div className=' flex-col h-screen deskver:flex hidden'>
  <div className="flex flex-row flex-grow ">

      <div className="h-[100vh] flex min-w-[600px]" style={{ width: `${["play", "bag"].includes(sideSelected) ? 100 : leftWidth}%`}}>
        
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

<div>
</div>
          {!bufSate && sideSelected !== "bag" && screenWidth!>900 && (
            <BufferComponent onComplete={() => {
              setBufState(true);
            }}
            onProgress={(pDone) => {setProgressNum(pDone);}}
            progressProp={progressNum}
            defaultTime={dayTimeBufferT.find((day) => day.days <= tripDayLen)?.time || 60000} dataStatus={bufferBool}/>
          )}



          {sideSelected === "itin" && bufSate && (
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
          
          )}

          {sideSelected === "plan" && bufSate && (
            <div className='h-full w-full bg-white'>
              { !dataJSON && (
                <>
                {Array.from({ length: 7 }, (_, index) => (
                <div key={index} className="animate-pulse bg-gray-200 h-6 my-6 mx-3  rounded"></div>
                
              ))}
              </>
              )}

              { dataJSON?.trip?.trip && Object.entries(dataJSON.trip.trip).map(([day, tripInfo]) => (
                <div key={day} className="bg-white border-b-1 border-gray-300 p-4" id={`${day}-plan`}>
                    <div className="flex items-center justify-between cursor-pointer" onClick={(e) => {
                    
                    setDayExpanded(dayExpanded === day ? null : day);



                    }}>
                    <h2 className="text-lg font-bold text-gray-700">{`Day ${day.replace("day", "")}`}<span className='font-medium ml-4'>( {tripInfo.destination} )</span></h2>
                    <span className="text-sm font-medium text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
                  </div>
                  {dayExpanded === day && (
                    <div className="mt-4 flex flex-col gap-4">
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

                      {tripInfo.places.map((place, index) => (
                        <div key={index} className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">
                          
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
                          <div className={` ${place.category.toLowerCase() == "intermediate_transport" ? "" : "mt-4 border-t-[2px] pt-4"} border-gray-300 `}>
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


          )}

          {sideSelected === "cost"  && bufSate && (
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
                      {currencySymbol}{costDetailsRef.current!.days[day].daytotalcost}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{dayExpanded === day ? "Hide Details" : "Show Details"}</span>
                  </div>
                  {dayExpanded === day && (
                    <div className="mt-4 flex flex-col gap-4">
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
                      {tripInfo.places.map((place, index) => (
                        <div key={index} className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">
                          {/* Header Section */}

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
          
          {sideSelected === "play" && bufSate && (
            <div>Animation Here</div>
          )}
          {sideSelected === "bag" && (
            <div  className='h-full w-full bg-white p-5 flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
            <span className='text-xl text-gray-700 font-semibold'>Packing List</span>
            <button
              className="flex select-none items-center gap-2 text-green-600 cursor-pointer hover:text-green-800 font-medium rounded-lg px-2 py-1 transition-colors duration-200"
              onClick={() => {
                pckList.current = [...pckList.current, { name: "New Category", values: {data:[]} }];
                setSumCards([...pckList.current]);
              }}
            >
              <span className="text-xl leading-none ml-auto">+</span>
              <span className='mr-auto'>Add</span>
            </button>
            </div>
            <div  className='flex justify-center'>
              <div ref={packingCardContRef}  className='flex flex-row gap-3 justify-evenly flex-wrap mx-auto w-fit'>
              { pckList.current.map((itm, idx) => (
                <div key={idx} ref={(elem) => {if(packCardRef.current && elem) packCardRef.current[idx]=elem}} className='' onMouseDown={(e) => {
                  drag_packCard(e, idx);
                }}>
                <PackingCard name={itm.name} values={ itm.values } 
                onChange={(values, cardN) => {
                  pckList.current[idx].name = cardN;
                  if (!pckList.current.some(item => item.name === itm.name)) {
                    pckList.current.push({ name: itm.name, values });
                  }else {
                    pckList.current[idx].values = values;
                  }
                }}
                />
                </div>
            ))}
              </div>
            </div>
            </div>
          )}
          </div>


        </div>

      </div>
{!["play", "bag"].includes(sideSelected) && (
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
)}
        
            
            <div className={`flex-grow ${ sideSelected === "itin" || sideSelected === "plan" ? "block" : "hidden" }`}>
            <Map 
              placesNames={React.useMemo(() => ['San Francisco', 'Mountain View', 'Los Angeles'], [])} 
              onClick={React.useCallback(
              (placeName: string) => {
                console.log("place:", placeName);
              }, 
              []
              )} 
            />
            </div>
          <div className={`flex-grow overflow-y-hidden ${ sideSelected === "cost" ? "block" : "hidden" }`}>
            { graphicalCostDataRef.current && (      
              <div className=" h-[100vh]">

                {costType === "day" && (
                <div className='p-5 flex flex-col gap-7 text-gray-700 h-full font-[geist] text-sm'>

                <span className='text-xl'>Daily Spend by Category</span>

                <ResponsiveContainer width="100%" height={400} className="my-auto mx-auto">
                    <BarChart data={graphicalCostDataRef.current.stackedDayData}>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${currencySymbol}${value}`}/>
                      <CartesianGrid strokeDasharray="3 3" />
    <Tooltip
      content={({ active, payload, label }) => {
        if (active && payload && payload.length) {
          const total = payload.reduce((sum, entry) => sum + (entry.value ? Number(entry.value) : 0), 0);
          return (
            <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              {payload.map((entry, index) => (
                <div key={index} className={`flex justify-between text-sm gap-1 font-semibold`}
                style={{ color: COLORS[index % COLORS.length] }}
                >
                  <span>{entry.name}</span>
                  <span>{currencySymbol}{entry.value}</span>
                </div>
              ))}
              <div className="mt-2 border-t pt-2 flex justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span>{currencySymbol}{total}</span>
              </div>
            </div>
          );
        }
        return null;
      }}
    />
    <Legend iconType="circle" height={36} />

                      {Object.keys(graphicalCostDataRef.current.stackedDayData[0] || {}).filter(key => key !== 'name').map((key, index) => (
                      <Bar key={index} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                      ))}
                    </BarChart>
                </ResponsiveContainer>
                </div>
                )}
                {costType === "misc" && (
                <div className='p-5 flex flex-col gap-7 text-gray-700 h-full font-[geist] text-sm'>
                <span className='text-xl'>Miscellaneous Costs</span>
                <ResponsiveContainer>
        <PieChart>
          <Pie
            data={graphicalCostDataRef.current.miscCosts}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            label
            isAnimationActive={true}
          >
            {graphicalCostDataRef.current.miscCosts.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
                    <p className="text-sm font-semibold text-gray-900">{currencySymbol}{payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
                </ResponsiveContainer>
                </div>
                  
                )}
                {costType === "total" && (
                <div className='p-5 flex flex-col gap-7 text-gray-700 h-full font-[geist] text-sm'>

                <span className='text-xl'>Daily Spend by Category</span>
                <ResponsiveContainer>
        <PieChart>
          <Pie
            data={graphicalCostDataRef.current.expByCategory}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            label
            isAnimationActive={true}
          >
            {graphicalCostDataRef.current.expByCategory.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
                    <p className="text-sm font-semibold text-gray-900">{currencySymbol}{payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
                </ResponsiveContainer>

                </div>
                )}

              </div>
            )}     
          </div>

  </div>
</div>

{/* Mobile Ver */}
            <BufferComponent onComplete={() => {
              setBufState(true);
            }}
            onProgress={(pDone) => {setProgressNum(pDone);}}
            progressProp={progressNum}
            defaultTime={dayTimeBufferT.find((day) => day.days <= tripDayLen)?.time || 60000} dataStatus={bufferBool}/>

<div className='deskver:hidden flex flex-col h-[100vh] font-[geist] overflow-y-hidden'>
    <div className='absolute top-0 z-1000 w-full p-2'>
      <div className={`w-full bg-[#ffffff7d] backdrop-blur-[15px] rounded-2xl p-3  z-1000`}
      style={{
        height: `${controlmenuOpen ? "255px" : "75px"}`,
        transition: 'height 0.3s ease-in-out',
      }}
      >
          <div className='flex flex-row items-center h-[50px]' onClick={()=>setControlMenuOpen(!controlmenuOpen)}>
            <button  className='rounded-full flex justify-center items-center h-[20px] p-5 w-[20px] bg-green-300 '>
                <span className="material-icons text-white">menu</span>
            </button>
            {tripDetails.destination && (
            <span className='ml-3 h-fit flex flex-col'>
                <h1 className='animated-text-gradient w-fit leading-tight font-bold text-xl'>{tripDetails.destination.split(",")[0]}</h1>
              <span className='text-sm text-gray-700 font-semibold leading-tight'>{`${tripDetails.startDate.split("-")[2]} ${monthNames[parseInt(tripDetails.startDate.split("-")[1])]} - ${tripDetails.endDate.split("-")[2]} ${monthNames[parseInt(tripDetails.endDate.split("-")[1])]}`}</span>
            </span>
            )}
          </div>

          {/* Side select menu (mobile ver) */}
            <div style={{
              visibility: `${controlmenuOpen ? "visible" : "hidden"}`,
              opacity: `${controlmenuOpen ? 1 : 0}`,
              transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out'
            }}>
              <div className='grid grid-cols-6  gap-2 mt-3'>
                <button className={`bg-[#0000000d] col-span-2 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "itin" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
                  onClick={() => setSideSelected("itin")}>
                  <span className="material-icons text-2xl">travel_explore</span>
                  <span className='text-sm font-semibold'>Itin</span>
                </button>
                <button className={`bg-[#0000000d] col-span-2 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "plan" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
                  onClick={() => setSideSelected("plan")}>
                  <span className="material-icons text-2xl">map</span>
                  <span className='text-sm font-semibold'>Plan</span>

                </button>
                <button className={`bg-[#0000000d] col-span-2 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "cost" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
                  onClick={() => setSideSelected("cost")}>
                  <span className="material-icons text-2xl">paid</span>
                  <span className='text-sm font-semibold'>Cost</span>

                </button>
                <button className={`bg-[#0000000d] col-span-3 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "play" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
                  onClick={() => setSideSelected("play")}>
                  <span className="material-icons text-2xl">play_circle</span>
                  <span className='text-sm font-semibold'>Play</span>

                </button>
                <button className={`bg-[#0000000d] col-span-3 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "bag" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
                  onClick={() => setSideSelected("bag")}>
                  <span className="material-icons text-2xl">luggage</span>
                  <span className='text-sm font-semibold'>Bag</span>

                </button>
              </div>
            </div>
      </div>
    </div>
    <div className='absolute w-full h-[100vh] bg-amber-400 ' 
    onTouchMove={() => setControlMenuOpen(false)}
    onClick={() => setControlMenuOpen(false)}>
      <Map 
        placesNames={React.useMemo(() => ['San Francisco', 'Mountain View', 'Los Angeles'], [])} 
        onClick={React.useCallback(
        (placeName: string) => {
          console.log("place:", placeName);
        }, 
        []
        )}
        controls={false} 
      />
    </div>
    <div className={`sticky bg-white z-50 top-[100vh] transition-all duration-300 overflow-y-auto`}
      style={
        {height: `${bottomSheetHeight}vh`,
      transitionTimingFunction: 'cubic-bezier(0.2, 0.56, 0.16, 0.98)',
      borderRadius: bottomSheetRestrictedHeight !== BottomSheetHeightVariations[2] ? '30px 30px 0 0':"",
      }} onTouchMove={(e) =>bottomSheetHeightChange(e)} 
      onTouchEnd={(e)=> bottomSheetHeightRestrictedEndChange(e)}
      onTouchStart={(e) => bottomSheetHeightStartChange(e)}
      ref={bottomSheetRef}>
        {/* bottomsheet slider bar */}
        <div className='w-full flex justify-center items-center h-7 bg-white sticky top-0 z-10'
        ><div className='w-[40px] h-[5px] bg-gray-300 rounded-full'></div>
        </div>
        {/* Bottom sheet cont */}

        <div
        style={
          {
            marginTop:bottomSheetHeight !== BottomSheetHeightVariations[2] ? "0px" :"60px",
            transition: 'margin-top 0.3s cubic-bezier(0, 0, 0, 0.91)',
          }
        }
        >
          {/* Main Content of the bottom sheet here..... */}


          {sideSelected === "itin" && bufSate && (
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
          
          )}

          {sideSelected === "plan" && bufSate && (
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
                    <div className="mt-4 flex flex-col gap-4">
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

                      {tripInfo.places.map((place, index) => (
                        <div key={index} className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">
                          
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
                          <div className={` ${place.category.toLowerCase() == "intermediate_transport" ? "" : "mt-4 border-t-[2px] pt-4"} border-gray-300 `}>
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


          )}

          {sideSelected === "cost"  && bufSate && (
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
                    <div className="mt-4 flex flex-col gap-4">
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
                      {tripInfo.places.map((place, index) => (
                        <div key={index} className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">
                          {/* Header Section */}

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
          
          {sideSelected === "play" && bufSate && (
            <div>Very Cool Animation Here</div>
          )}

        </div>


    </div>
</div>


    </>
  )
}
export default PlanTrip
