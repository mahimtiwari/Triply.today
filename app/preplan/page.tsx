"use client";
import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../components/header';
import StepsStatusBar from '../components/progressSlideBar';


const PrePlanTrip = () => {
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination');
    const processNum = useRef<number>(1);
    const totalProcess = 4;
    const increaseProcessNum = () => {
        processNum.current = totalProcess === processNum.current ? processNum.current : processNum.current + 1;
    }
    const decreaseProcessNum = () => {
        processNum.current = processNum.current === 1 ? processNum.current : processNum.current - 1;
    }
    if (!destination) {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
        return null;
    }
    return (
    <>

        <Header/>
        <div className='p-6 max-w-[500px] mx-auto mt-[10px]'>
            <div className="text-[16px]  text-gray-800 leading-tight font-[geist] ">
                <span>Your Trip to</span>
                <span className='mt-2 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text px-2 py-1 w-fit font-bold '>
                    {destination}
                </span>
            </div>
            <StepsStatusBar totalProgress={totalProcess} currentProgress={processNum.current.toString()} className="mt-[10px]"/>
            <div className="mt-6">
                <label htmlFor="travel-dates-start" className="block text-sm font-medium text-gray-700">
                    Choose your travel dates:
                </label>
                <div className="flex space-x-2 mt-1">
                    <input
                        type="date"
                        id="travel-dates-start"
                        name="travel-dates-start"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Start date"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        id="travel-dates-end"
                        name="travel-dates-end"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="End date"
                    />
                </div>
            </div>
                
            

        </div>
    
    </>
    )
}
export default PrePlanTrip
