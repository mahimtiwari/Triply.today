import React, { ReactNode } from 'react'

const FormalPageComp = ({title, lastUpdated, children}: {title:string, lastUpdated:string, children: ReactNode}) => {
  return (
    <div className='font-[Poppins] flex flex-col'>
        <div className='w-full h-[200px] flex bg-[#fafafa]'>
            <div className='p-7 h-full max-w-screen-xl w-full mx-auto flex items-end justify-start'>
                <div className='h-fit flex flex-col items-start'>
                    <h1 className='text-5xl text-gray-800 font-[Poppins] text-center font-medium'>{title}</h1>
                    <p className='text-center text-gray-500 font-medium mt-2'>Last updated: {lastUpdated}</p>
                </div>
            </div>
        </div>
        <div className='w-full'>
            <div className='max-w-screen-xl mx-auto p-7 text-gray-700 text-lg font-[Poppins]'>
                {children}
            </div>
        </div>
    </div>
  )
}

export default FormalPageComp