"use client";
import React from 'react'
import Image from 'next/image'
import { useState, useRef } from 'react'





interface SidebarProps {
    sideSelected: string;
    setSideSelected: (side: string) => void;
    dataJSON: any;
    tripDetails?: any;
    currencySymbol?: string;
    costDetailsRef?: any;
    status?: 'authenticated' | 'unauthenticated';
    routePush: (path: string) => void;
    

}

const PlanSideBar = ({sideSelected, setSideSelected, dataJSON, tripDetails, currencySymbol, costDetailsRef, status, routePush}:SidebarProps) => {

  const saveButton = useRef<HTMLButtonElement>(null);
  const saveText = useRef<HTMLSpanElement>(null);
async function saveTrip() {


  if ( status === 'authenticated') {
    saveButton.current!.disabled = true;
    saveText.current!.innerText = "cached";
    saveText.current!.classList.add("animate-spin");

    try {
      const res = await fetch('/api/user/operations/plan/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: tripDetails.destination,
          visibility: "PRIVATE",
          metadata: tripDetails,
          plan: dataJSON,
          currencyCode: currencySymbol,
          costO: costDetailsRef.current,
        }),
      });

      const responseJSON = await res.json();  // properly await JSON

      if (res.ok) {

        routePush(`/user/plans/${responseJSON.tripId}`);

      } else {
        saveButton.current!.disabled = false;
        saveText.current!.innerText = "save";
        saveButton.current!.style.backgroundColor = "red";
        setTimeout(() => {
          saveButton.current!.style.backgroundColor = "white";
        }, 2000);
        alert(`Failed to save trip: ${responseJSON.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Something went wrong while saving the trip.");
    }
  } else{
    routePush('/user/signin');
  }
}

  return (
    
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
              () => setSideSelected("export")
            }
              style={{ backgroundColor: sideSelected === "export" ? "#f0f0f0" : "transparent", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
            >
            <Image 
              src={'/img/export.png'} 
              width={20} 
              className='mx-auto'
              height={20} 
              alt='marker' 
              style={{ filter: 'invert(50%) sepia(0%) saturate(0%) brightness(80%)' }} // Adjust color to gray using CSS filter
            />
            <span>Exp</span>
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
          <div className='text-gray-600 w-full mb-4 gap-5 flex flex-col font-semibold'>
            {dataJSON?.trip?.trip && (

                <button ref={saveButton} className='flex outline-0 justify-center mx-auto rounded-full p-2 w-fit flex-col cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-200' 
                onClick={() => saveTrip()}
                >
                
                <span ref={saveText} className='material-icons'>save</span>
                
                </button>

            )}
          </div>
        </div>
    
  )
}

export default PlanSideBar