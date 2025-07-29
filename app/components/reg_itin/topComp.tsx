"use client";
import React, { useState } from 'react'
import Sharepopup from '../sharepopup';

const TopComp = ({serverResStateProp}:{serverResStateProp:boolean}) => {
const [serverResState, setServerResState] = useState<boolean>(serverResStateProp);


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
    </>
  )
}

export default TopComp