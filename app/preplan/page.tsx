"use client";
import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../components/header';
import StepsStatusBar from '../components/progressSlideBar';
import RangeCalendar from '../components/RangeCalendar'; // Adjust the path as needed
import BudgetOption from '../components/BudgetOption';
import TypeOfPeople from '../components/typeOfPeople'; // Adjust the path as needed


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
            
                {/* <RangeCalendar
                    className="mt-6"
                    onDateSelected={(date) => {
                        console.log(date);
                    }}/> */}
            
            {/* <BudgetOption onBudgetSelected={(budget: string) => {
                console.log(`Selected budget: ${budget}`);
            }}/> */}
            <TypeOfPeople />

        </div>
    
    </>
    )
}
export default PrePlanTrip
