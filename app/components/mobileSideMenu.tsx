import React from 'react'

interface MobileSideMenuProps {
    controlmenuOpen: boolean;
    setControlMenuOpen: (open: boolean) => void;
    sideSelected: string;
    setSideSelected: (selected: string) => void;
}

const MobileSideMenu = ({controlmenuOpen, setControlMenuOpen, sideSelected, setSideSelected}:MobileSideMenuProps) => {
  return (
    <div style={{
        visibility: `${controlmenuOpen ? "visible" : "hidden"}`,
        opacity: `${controlmenuOpen ? 1 : 0}`,
        transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out'
    }}>
        <div className='grid grid-cols-6  gap-2 mt-3'>
        <button className={`bg-[#0000000d] col-span-2 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "itin" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
            onClick={() => setSideSelected("itin")}>
            <span className="material-icons text-2xl">travel_explore</span>
            <span className='text-sm font-semibold'>Itin</span>
        </button>
        <button className={`bg-[#0000000d] col-span-2 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "plan" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
            onClick={() => setSideSelected("plan")}>
            <span className="material-icons text-2xl">map</span>
            <span className='text-sm font-semibold'>Plan</span>

        </button>
        <button className={`bg-[#0000000d] col-span-2 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "cost" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
            onClick={() => setSideSelected("cost")}>
            <span className="material-icons text-2xl">paid</span>
            <span className='text-sm font-semibold'>Cost</span>

        </button>
        <button className={`bg-[#0000000d] col-span-3 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "export" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
            onClick={() => setSideSelected("export")}>
            <span className="material-icons text-2xl">play_circle</span>
            <span className='text-sm font-semibold'>Export</span>

        </button>
        <button className={`bg-[#0000000d] col-span-3 otline-0 h-20 flex flex-col rounded-xl  items-center justify-center   ${sideSelected === "bag" ? "bg-[#001eff13] text-[#004079] scale-101" : "text-[#292929]"} transition-all duration-200 ease-in-out`}
            onClick={() => setSideSelected("bag")}>
            <span className="material-icons text-2xl">luggage</span>
            <span className='text-sm font-semibold'>Bag</span>

        </button>
        </div>
    </div>
  )
}

export default MobileSideMenu