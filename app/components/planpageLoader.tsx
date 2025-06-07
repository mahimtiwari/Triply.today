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
            
                const reducer = pDone > 85 ? 1/(pDone) : 1;
                const next = !dataStatus ? pDone + addVal*reducer : pDone + 100;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {setVisible(false);onComplete()}, 300);

                }
                if (next >= 100 && dataStatus) {
                    pDone = 100;
                } else {
                    pDone = next;
                }
                onProgress(pDone)

                return next;
            
        }, gap);

        

        return () => clearInterval(timer);
    }, [defaultTime, dataStatus]);

    if (!visible) return null;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white/50 z-[100]">
<p className="mb-6 text-xl text-gray-700 font-semibold animate-pulse">
  Loading, please wait...
</p>
<div className="w-72 h-[8px] bg-gray-300 rounded-full overflow-hidden shadow-inner">
  <div
    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-in-out"
    style={{ width: `${progressProp}%` }}
  ></div>
</div>

        </div>
    );
};

export default BufferComponent;
