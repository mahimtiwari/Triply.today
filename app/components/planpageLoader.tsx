import React, { useEffect, useState } from "react";
const BufferComponent: React.FC<{ defaultTime: number; progressProp:number; onProgress:(pDone:number)=>void; dataStatus?: boolean; onComplete: ()=>void }> = ({
    defaultTime,
    dataStatus = false,
    progressProp,
    onProgress = (pDone) => {},
    onComplete = () => {},
}) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const gap = 20;
        const stp = defaultTime / gap;
        const addVal = 100 / stp;
        var pDone = progressProp;
        
        let timer = setInterval(() => {
            
                const reducer = pDone > Math.floor(Math.random()*8) + 90 ? 1/(pDone) : 1;
                const next = !dataStatus ? pDone + addVal*reducer : pDone + 100;
                if (next >= 100) {
                    if (dataStatus){
                    pDone = 100;
                    clearInterval(timer);
                    setTimeout(() => {setVisible(false);onComplete()}, 500);
                    }else{
                        return 99;
                    }
                }else {
                    pDone = next;
                }
                

                onProgress(pDone)
                return next;
            
        }, gap);

        

        return () => clearInterval(timer);
    }, [defaultTime, dataStatus]);

    if (!visible) return null;
    return (<>
    <div className="w-full h-full hidden deskver:flex flex-col items-center justify-center bg-white z-[100]">
        <p className="mb-6 text-xl text-gray-700 font-semibold animate-pulse">
        Loading, please wait...
        </p>
        <div className="w-72 h-[8px] bg-gray-300 rounded-full overflow-hidden shadow-inner">
        <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${progressProp}%` }}
        >

        </div>
        </div>
    </div>

<div className="deskver:hidden fixed top-0 left-0 flex flex-col gap-10 items-center justify-center w-full h-full z-[1000] bg-white">
    <div className="relative w-[200px] h-[200px]">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#off-gradient)"
                strokeWidth="10"
                fill="none"
            />
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="10"
                fill="none"
                strokeDasharray="282.743"
                strokeDashoffset={`${282.743 - (progressProp / 100) * 282.743}`}
                strokeLinecap="round"
                style={{
                    transition: "stroke-dashoffset 0.3s ease-in-out",
                }}
            >
            </circle>
            
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue-500)" />
                    <stop offset="50%" stopColor="var(--color-purple-500)" />
                    <stop offset="100%" stopColor="var(--color-pink-500)" />
                </linearGradient>
                <linearGradient id="off-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue-200)" />
                    <stop offset="50%" stopColor="var(--color-purple-200)" />
                    <stop offset="100%" stopColor="var(--color-pink-200)" />
                </linearGradient>
            </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold text-2xl">
            {Math.floor(progressProp)}%
        </div>
    </div>
    
    <div className="flex  flex-col font-semibold font-[geist] text-2xl items-center justify-center">
        <span className="text-gray-600">Your trip is being</span>
        <span className="animated-text-gradient w-fit ">
            planned
        </span>
    </div>


</div>

</>
        
    );
};

export default BufferComponent;
