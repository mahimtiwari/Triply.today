import React, { useEffect, useState } from "react";

const BufferComponent: React.FC<{ defaultTime: number; dataStatus?: boolean; onComplete: ()=>void }> = ({
    defaultTime,
    dataStatus = false,
    onComplete = () => {},
}) => {
    
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const gap = 20;
        const stp = defaultTime / gap;
        const addVal = 100 / stp;
        var pDone = 0;
        let timer = setInterval(() => {
            setProgress((prev) => {
                const reducer = pDone > 85 ? 1/(pDone) : 1;
                // console.log("reducer", reducer);
                const next = !dataStatus ? prev + addVal*reducer : prev + 100;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {setVisible(false);onComplete()}, 300);

                }
                if (next >= 100 && dataStatus) {
                    pDone = 100;
                } else {
                    pDone = next;
                }
                return next;
            });
            
        }, gap);

        

        return () => clearInterval(timer);
    }, [defaultTime, dataStatus]);

    if (!visible) return null;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white/50 z-[100]">
            <p className="mb-4 text-lg text-gray-600">Loading...</p>
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default BufferComponent;
