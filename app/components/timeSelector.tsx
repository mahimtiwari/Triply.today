"use client";
import { set } from 'date-fns';
import React, { useState, useRef, useEffect, use } from 'react'

const TimeSelector = ({timeSaved, defTime, close}:{timeSaved: (hour:string, minute:string, ampm:string)=>void, defTime:string, close: ()=>void}) => {
    const clockRef = useRef<HTMLDivElement>(null);
    const [angle, setAngle] = useState(0);
    const [mouseDown, setMouseDown] = useState(false);
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);
    const [hourState, setHourState] = useState(defTime ? defTime.split(':')[0].replace('AM', '').replace('PM', '').trim() : '');
    const [minuteState, setMinuteState] = useState(defTime ? defTime.split(':')[1].replace('AM', '').replace('PM', '').trim() : '');
    const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
    const [focusDict, setFocusDict] = useState<{ hour: boolean; minute: boolean }>({
        hour: true,
        minute: false,
    });
    useEffect(() => {
        setFocusDict({ hour: true, minute: false });

        if (hourState.length === 2){
            setFocusDict({ hour: false, minute: true });
        }

    }, [hourState]);
    useEffect(() => {
        setFocusDict({ hour: false, minute: true });
        // if( minuteState.length === 0) {
        //     setFocusDict({ hour: true, minute: false });
        // }
    }, [minuteState]);

    useEffect(() => {
        if (focusDict.hour && hourRef.current) {
            hourRef.current.focus();
        }
        if (focusDict.minute && minuteRef.current) {
            minuteRef.current.focus();
        }
    }, [focusDict]);

function changeAngle(x:number, y:number) {
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
    const normalizedAngle = (rawAngle + 360) % 360;
    setAngle(normalizedAngle);

}

  return (
    <div className="absolute flex items-center justify-center bg-black/20 h-screen w-screen">
        <div className='deskver:bg-transparent flex deskver:items-center items-start justify-center bg-white h-full w-full '>
            <div className='bg-white w-fit h-fit rounded-lg p-3'>
                <div className='flex flex-row justify-between items-center'>
                    <span className='font-medium text-[17px]'>Select Time</span>
                    <button 
                    onClick={close}
                    className='flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-all cursor-pointer'>
                        <span className='material-symbols-outlined'
                        style={{
                            fontSize: '20px',
                        }}
                        >close</span>
                    </button>
                </div>
                <div className='flex flex-row gap-1 mt-3'>
                    <input className='w-20 h-16 text-5xl rounded-xl flex items-center justify-center bg-blue-200 outline-0 text-center'
                    onFocus={()=>{
                        if (hourRef.current) {
                        }
                    }}
                    onClick={()=>{
                        setFocusDict({ hour: true, minute: false });
                    }}
                    style={{
                        color: focusDict.hour ? '#1d3f7b' : '#484848',
                        transition: 'all 0.3s ease',
                        backgroundColor: focusDict.hour ? 'var(--color-blue-200)' : '#dcdcdc',
                    }}
                    value={hourState}
                    ref={hourRef}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && (value === '' || parseInt(value) <= 12)) {
                            setHourState(value);
                        }
                        if( /^\d*$/.test(value) && value === '' || value.length > 2) {

                            setFocusDict({ hour: false, minute: true });
                            setMinuteState(value.slice(2));

                        }
                    }}
                    />
                    <span className='text-5xl pt-1'>:</span>
                    <input 
                    onClick={() => {
                        setFocusDict({ hour: false, minute: true });
                    }}
                    onKeyDown={(e)=>{
                        if (e.key === 'Backspace' && minuteState.length === 0) {

                                setFocusDict({ hour: true, minute: false });


                        }
                    }}
                    className='w-20 h-16 text-5xl rounded-xl flex items-center justify-center bg-[#dcdcdc] text-[#484848] outline-0 text-center'
                    value={minuteState}
                    style={{
                        color: focusDict.minute ? '#1d3f7b' : '#484848',
                        transition: 'all 0.3s ease',
                        backgroundColor: focusDict.minute ? 'var(--color-blue-200)' : '#dcdcdc',
                    }}
                    ref={minuteRef}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && (value === '' || parseInt(value) < 60)) {
                            setMinuteState(value);
                        }
                    }}
                    />
                    <span className='flex flex-col h-16 rounded-lg border-1 border-[#dcdcdc] w-8 text-sm font-medium divide-y-1 divide-[#dcdcdc] ml-2'>
                        <span onClick={() => setAmpm('AM')} 
                        style={{
                            transition: 'background-color 0.3s ease',
                        }}
                        className={`flex cursor-pointer items-center justify-center h-1/2 ${ampm === 'AM' ? 'bg-blue-200' : ''} rounded-t-lg`}>AM</span>
                        <span onClick={() => setAmpm('PM')} 
                        style={{
                            transition: 'background-color 0.3s ease',
                        }}
                        className={`flex cursor-pointer items-center justify-center h-1/2 ${ampm === 'PM' ? 'bg-blue-200' : ''} rounded-b-lg`}>PM</span>
                    </span>
                </div>
                {/* <div 
                onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    setMouseDown(true);
                    changeAngle(e.clientX, e.clientY);
                    
                }}
                onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    if (mouseDown) {
                        changeAngle(e.clientX, e.clientY);
                    }
                }}
                onMouseUp={()=>{
                    setMouseDown(false);
                }}
                onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
                    changeAngle(e.touches[0].clientX, e.touches[0].clientY);

                }}
                ref={clockRef}
                className='h-40 w-40 bg-amber-200 flex '>
                    <span className='mx-auto my-auto select-none'>{angle}</span>
                </div> */}

                <div className='flex flex-row mt-4'>

                    <button
                        className='rounded-4xl py-2 px-3 border-1 w-full border-gray-500 font-medium hover:bg-gray-200 cursor-pointer'
                        style={{
                            transition: 'background-color 0.3s ease',
                        }}
                        onClick={()=>{
                            timeSaved(hourState, minuteState, ampm);
                            close();
                        }}>
                        Save
                    </button>

                </div>
            </div>
        </div>
    </div>
  )
}

export default TimeSelector