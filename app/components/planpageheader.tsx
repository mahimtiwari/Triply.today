import React from 'react'

interface PlanPageHeaderProps {
    tripDetails: any;
    dataJSON: any;
    totalCost: number;
    currencySymbol: string;
    setAllExpand: () => void;
    allExpand: boolean;
    sideSelected: string;
}

const PlanPageHeader = ({ tripDetails, dataJSON, totalCost, currencySymbol, setAllExpand, allExpand, sideSelected }: PlanPageHeaderProps) => {

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


  return (

          <div className='flex justify-between flex-row h-[110px] w-full bg-white border-b-[1px] border-gray-300'>
            <div className='flex items-left my-auto flex-col p-2 pl-4 font-[geist] text-gray-700 font-bold '>
              {tripDetails.destination.split(",").length > 0 && (
              <>
                <span className='text-[25px] h-fit bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text'>{tripDetails.destination.split(",")[0]}</span>
                <span className='text-[12px]'>{`${tripDetails.startDate.split("-")[2]} ${monthNames[parseInt(tripDetails.startDate.split("-")[1])]} - ${tripDetails.endDate.split("-")[2]} ${monthNames[parseInt(tripDetails.endDate.split("-")[1])]}`}</span>
              </>
              )}
              </div>
              {dataJSON?.trip?.trip && (
                <div className="flex flex-col mr-4 items-right font-[geist] select-none">
                  <div className='h-[100%]'>

                  </div>
                  
                  <span className={`bg-gradient-to-r ${ tripDetails.budget.toLowerCase()==="luxury" ? "from-yellow-400 via-yellow-500 to-yellow-600" : "from-green-300 via-green-500 to-green-600"} text-white px-3 py-1 rounded-full text-xl font-semibold`}>{currencySymbol}{totalCost}</span>
                  {/* <span className={`text-right text-[13px] font-semibold ${tripDetails.budget === "Luxury" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text" : ""}`}>{tripDetails.budget}</span> */}
                  <div className='h-[100%] flex flex-col'>
                      <button onClick={()=>{
                        setAllExpand();
                      }} 
                      style={{
                        display: ["plan", "cost"].includes(sideSelected) ? "flex" : "none",
                      }}
                      title={allExpand ? "Collapse All" : "Expand All"} className='cursor-pointer my-auto flex flex-row items-center justify-center'>
                      <span 
                      style={{
                        fontSize: "20px",
                        color: "#777",
                      }}
                      className="material-symbols-outlined ">
                      {allExpand ? "collapse" : "expand"}_content
                      </span>
                      </button>
                  </div>
                </div>
              )}


          </div>

  )
}

export default PlanPageHeader