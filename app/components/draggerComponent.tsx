import React from 'react'

interface DraggerComponentProps {
    leftWidth: number;
    setLeftWidth: (width: number) => void;
    drag_direction: string | null;
    setDragDirection: (direction: string) => void;
    startDrag: () => void;
    isDragging: boolean;
    

}

const DraggerComponent = ({setLeftWidth, drag_direction, startDrag, isDragging}:DraggerComponentProps) => {
    const leftWidthConst = 600;
  return (
    
    <div
      className="relative w-[1px] bg-gray-300 cursor-grab z-20 group"
      onMouseDown={startDrag}
    >
    
      <span
        className="absolute select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group bg-gray-100/25 border-1 hover:w-20 border-gray-300 backdrop-blur-2xl rounded-full w-5 h-12 flex items-center justify-center text-sm font-bold text-gray-700 group-hover:scale-110 transition-transform duration-200 ease-in-out"
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
        {drag_direction && drag_direction !== "" && (
        <span className='material-icons text-gray-500'>
          chevron_{drag_direction === "right" ? "right" : drag_direction === "left" ? "left" : ""}
        </span>
        )}  
        {!isDragging && (
          <div className='flex items-center justify-center gap-2 text-gray-500'>
            <button 
            onClick={() => {
              setLeftWidth(leftWidthConst/window.innerWidth*100);
            }}
            className='cursor-pointer material-icons group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out'>chevron_left</button>
            <button 
            onClick={() => {
              setLeftWidth(100);
            }}
            className='cursor-pointer material-icons group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out'>chevron_right</button>
          </div>
        )}
      
      </span>
    </div>
    
  )
}

export default DraggerComponent