"use client";
import React, { useRef } from 'react'

const TimeSelector = () => {
    const clockRef = useRef<HTMLDivElement>(null);
    const [angle, setAngle] = React.useState(0);
function changeAngle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const rawAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90;
    const normalizedAngle = (rawAngle + 360) % 360;
    setAngle(normalizedAngle);

}

  return (
    <div className="absolute flex items-center justify-center bg-black/20 h-screen w-screen">
        <div className='bg-white rounded-lg p-3'>
            <span className='font-medium text-[15px]'>Select Time</span>
            <div className='flex flex-row gap-1 mt-3'>
                <span className='w-20 h-16 text-5xl rounded-xl flex items-center justify-center bg-blue-200 text-[#1d3f7b]'>07</span>
                <span className='text-5xl pt-1'>:</span>
                <span className='w-20 h-16 text-5xl rounded-xl flex items-center justify-center bg-[#dcdcdc] text-[#484848]'>30</span>
                <span className='flex flex-col h-16 rounded-lg border-1 border-[#dcdcdc] w-8 text-sm font-medium divide-y-1 divide-[#dcdcdc] ml-2'>
                    <span className='flex items-center justify-center h-1/2 bg-blue-200 rounded-t-lg'>AM</span>
                    <span className='flex items-center justify-center h-1/2'>PM</span>
                </span>
            </div>
            <div 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                changeAngle(e);
            }}
            ref={clockRef}
            className='h-40 w-40 bg-amber-200 flex '>
                <span className='mx-auto my-auto'>{angle}</span>
            </div>
            <div>
                <span>Cancel</span>
                <span>Save</span>
            </div>
        </div>
    </div>
  )
}

export default TimeSelector