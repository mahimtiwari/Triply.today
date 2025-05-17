import React from 'react'

const StepsStatusBar = (parameters:any) => {
    const totalProgress: number = parseInt(parameters.totalProgress);
    const currentProgress: number = parseInt(parameters.currentProgress);
  return (
    <div className={parameters.className} style={{ display: 'flex', alignItems: 'center', width: '100%' , gap: "10px"}}>
      {Array.from({ length: totalProgress }).map((_, index) => (
        <div
          key={index}
          className='w-full h-[4px] rounded-full '
          style={{
            transition: 'background-color 0.3s ease',
            backgroundColor: index < currentProgress ? 'blue' : 'lightgray',
          }}
        ></div>
      ))}
    </div>
  )
}

export default StepsStatusBar