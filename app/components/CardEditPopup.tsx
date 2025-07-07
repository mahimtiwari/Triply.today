"use client";
import React, { useRef, useState, useEffect } from 'react'
import TimeSelector from './timeSelector';

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
    prereviousPlaceName: string;
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
    
    };
    

const CardEditPopup = ({ preData, onClose, currencySymbol, onSave, dataJSON, newPlace }: { preData: preData | null, onClose: () => void, currencySymbol: string, onSave: (newDataJSON: Trip | null) => void, dataJSON: Trip | null, newPlace:boolean }) => {
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(preData?.place.name || '');
  const [time, setTime] = useState(preData?.place.time || '');
  const initialCost = preData?.place.cost ? preData.place.cost.replace(/[^\d.]/g, '') : '';
  const [cost, setCost] = useState(initialCost);
  const [timeShown, setTimeShown] = useState(false);
  const [transportationCost, setTransportationCost] = useState(getTransportationCost(dataJSON?.trip.transportation || [], preData?.place.from || '', preData?.place.to || "", preData?.place.preffered_transport || '').toString() || '');
  const [transportationType, setTransportationType] = useState(preData?.place.preffered_transport || '');
  const [description, setDescription] = useState(preData?.place.description || '');
  const [category, setCategory] = useState(preData?.place.category || '');
  useEffect(()=>{
    const tPrice = getTransportationCost(dataJSON?.trip.transportation || [], preData?.place.from || '', name, transportationType).toString();
    setTransportationCost(tPrice || '');
    
  },[name, transportationType])


  function updateTripData(){
    var newDataJSON: Trip|null = dataJSON;
    
    if (preData && newDataJSON) {
      newDataJSON.trip.trip[preData.day || ""].places[preData.placeIndex || 0] = {
        category: category,
        name: name,
        cost: `${currencySymbol}${cost}`,
        time: time,
        from: preData.place.from,
        to: name,
        preffered_transport: transportationType,
        description: description
      }

      if(preData.place.to === name){
        newDataJSON.trip.transportation.forEach((transportation, index) => {
          
          if (transportation.from === preData.place.from && transportation.to === name) {
            
            if (preData.place.preffered_transport === transportationType){
              if (newDataJSON !== null){
                const dt = newDataJSON?.trip.transportation[index].options.map(option => {
                if (option.type === transportationType) {
                  return {
                    ...option,
                    cost: `${currencySymbol}${transportationCost}`
                  };
                }
                return option;
              }) || [];
              newDataJSON.trip.transportation[index].options = dt;
            }
            }else{
              newDataJSON?.trip.transportation[index].options.push({
                type: transportationType,
                cost: `${currencySymbol}${transportationCost}`
              });
            }
          }
        })
      }else{
        newDataJSON.trip.transportation.push({
          from: preData.place.from,
          to: name,
          options: [
            {
              type: transportationType,
              cost: `${currencySymbol}${transportationCost}`
            }
          ]
        })
      }
      if (name !== preData.place.name) {
        newDataJSON.trip.trip[preData.day || ""].places[preData.placeIndex+1 || 0].from = name;
      }
    }



    onSave(newDataJSON);
    
    onClose();
  }

  useEffect(() => {
    if (newPlace && preData) {
      setName(preData.place.name);
      setTime(preData.place.time);
      setCost(preData.place.cost.replace(/[^\d.]/g, ''));
      setTransportationType(preData.place.preffered_transport);
      setDescription(preData.place.description || '');
      setCategory(preData.place.category || '');
    }
  }, [newPlace]);

  const [done, setDone] = useState(false);
  useEffect(()=>{
  if (name !== "" && category !== "" && time !== "" && transportationType !== "" && name && category && time){
    setDone(true);
  }

  else{
    setDone(false);
  }

  }, [name, category, time, transportationType])

  function newTripPlace(){
    if (dataJSON) {
      const newPlace: Place = {
        category: category,
        name: name,
        cost: `${currencySymbol}${cost}`,
        time: time,
        from: preData?.prereviousPlaceName || '',
        to: name,
        preffered_transport: transportationType,
        description: description,
      };
      const day = Object.keys(dataJSON.trip.trip)[parseInt((preData?.day || '0').replace('day', '')) - 1];
      dataJSON.trip.trip[day].places.splice((preData?.placeIndex ?? 0) === 0 ? 0 : (preData?.placeIndex ?? 0)+1, 0, newPlace);
      dataJSON.trip.transportation.push({
        from: preData?.prereviousPlaceName || '',
        to: name,
        options: [
          {
            type: transportationType,
            cost: `${currencySymbol}${transportationCost}`
          }
        ]
      });
      onSave(dataJSON);
      onClose();
    }
  }

  return (

    <div
    style={{
    }}
    className='h-screen deskver:justify-center deskver:items-center flex font-[Poppins] w-screen fixed top-0 left-0 bg-black/30 z-100000000000'>
        {timeShown && (
          <TimeSelector defTime={preData?.place.time || ''} 
          timeSaved={(hour:string, minute:string, ampm:string) => {
            setTime(`${hour}:${minute} ${ampm.toUpperCase()}`);
          }}
          close={() => {
            setTimeShown(false);
          }}
          />
        )}

        <div 
        ref={bottomSheetRef}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 transparent',
        }}
        className='bg-white max-h-[calc(100vh)] overflow-y-auto flex flex-col  deskver:p-4 p-6 deskver:mb-auto deskver:rounded-2xl deskver:max-w-[600px] deskver:h-fit h-full w-full'>
            <div className='flex flex-col gap-4'>

            <div className='flex items-center justify-between'>
                <span className='font-medium text-2xl'>{!newPlace ? 'Edit' : 'New'} Place</span>
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
                        Category:
                    </span>

                    <div className='flex mt-2 flex-row gap-2'>
                      <button
                        className='border-2 w-[100%] cursor-pointer font-semibold rounded-full py-1 px-4'
                        style={{
                          borderColor: category === 'hotel' ? 'var(--color-blue-800)' : '#999',
                          color: category === 'hotel' ? 'var(--color-blue-800)' : '#555',
                          backgroundColor: category === 'hotel' ? 'var(--color-blue-50)' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                        onClick={() => setCategory('hotel')}
                      >Hotel</button>
                      <button
                        className='border-2 w-[100%] cursor-pointer font-semibold rounded-full py-1 px-4'
                        style={{
                          borderColor: category === 'sightseeing' ? 'var(--color-blue-800)' : '#999',
                          color: category === 'sightseeing' ? 'var(--color-blue-800)' : '#555',
                          backgroundColor: category === 'sightseeing' ? 'var(--color-blue-50)' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                        onClick={() => setCategory('sightseeing')}
                      >Sightseeing</button>
                      <button
                        className='border-2 w-[100%] cursor-pointer font-semibold rounded-full py-1 px-4'
                        style={{
                          borderColor: category === 'restaurant' ? 'var(--color-blue-800)' : '#999',
                          color: category === 'restaurant' ? 'var(--color-blue-800)' : '#555',
                          backgroundColor: category === 'restaurant' ? 'var(--color-blue-50)' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                        onClick={() => setCategory('restaurant')}
                      >Food</button>
                    </div>

                </div>

                <div className='flex flex-col' onClick={
                  () => {
                    setTimeShown(true);
                  }
                }
                >
                    <span className='text-gray-600 text-sm font-medium'>
                        Time:
                    </span>
                    
                <div className='outline-none cursor-pointer border border-gray-300 focus:border-blue-500 transition-colors py-2 px-4 rounded-lg shadow-sm text-base bg-gray-50'>
                    {time || "Select time"}
                </div>
                </div>

                <div className='flex flex-col'>
                    <span className='text-gray-600 text-sm font-medium'>
                        Cost:
                    </span>
                    
                <div className='outline-none border flex flex-row gap-2 border-gray-300 focus:border-blue-500 transition-colors py-2 px-4 rounded-lg shadow-sm text-base bg-gray-50'>
                    {currencySymbol}
                    <input placeholder='Enter cost' type="number" className='outline-0 w-full' value={cost} onChange={(e) => setCost(e.target.value)} />
                </div>
                </div>
                

                <div className='flex flex-col'>
                    <span className='text-gray-600 text-sm font-medium'>
                        Description:
                    </span>
                    
                <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='outline-none border flex flex-row gap-2 border-gray-300 focus:border-blue-500 transition-colors py-2 px-4 rounded-lg shadow-sm text-base bg-gray-50'
                
                >
                </textarea>

                </div>
                


                <div className='flex flex-col'>
                    <span className='text-gray-600 text-sm font-medium'>
                        Transportation:
                        <span className='bg-gray-300 ml-2 rounded-2xl px-2 py-1'>{preData?.prereviousPlaceName} - {name}</span>
                    </span>
                <div className='flex flex-col gap-2 mt-2'>
                <input
                  className="outline-none w-full border border-gray-300 focus:border-blue-500 transition-colors py-2 px-4 rounded-lg shadow-sm text-base bg-gray-50"
                  type="text"
                  value={transportationType}
                  onChange={(e) => setTransportationType(e.target.value)}
                  placeholder="Enter transportation type"
                  autoComplete="off"
                />
                <div className='outline-none border flex flex-row gap-2 border-gray-300 focus:border-blue-500 transition-colors py-2 px-4 rounded-lg shadow-sm text-base bg-gray-50'>
                    {currencySymbol}
                    <input placeholder='Enter transportation cost' type="number" className='outline-0 w-full' value={transportationCost} onChange={(e) => setTransportationCost(e.target.value)} />
                </div>
                </div>
                </div>



            </div>
  
            </div>
            <button
            onClick={()=>{
              if(newPlace){
                newTripPlace();
              }else{
                updateTripData();
              }

            }}
            disabled={!done}
            className={`${done ? "bg-blue-800" : "bg-gray-400"} mt-3 text-white py-2 px-4 rounded-3xl cursor-pointer ${ done ? "hover:bg-blue-600" : "" }`}
            style={{
              transition: 'all 0.15s ease',
            }}
            >Done</button>
        </div>
    </div>
)
}

export default CardEditPopup