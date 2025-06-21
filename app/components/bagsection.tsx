"use client";
import React, {useState, useRef, useEffect} from 'react';
import Image from 'next/image';
import PackingCard from '@/app/components/packingCard';
interface dataPck {
    name: string; 
    checked: boolean 
}
interface PackingCardProps {
    
    name: string,
    values: {
        data: dataPck[], 
        color?: string
    }

}

const BagSection = ({pckList, destination, changePck}:{pckList:PackingCardProps[], destination:string, changePck: (list:PackingCardProps[]) => void}) => {


function aiGeneratePackingList() {
  setGenAiPackLoad(true);
  gradientBgRefLoader.current!.style.display = "block";
  fetch(`/api/packlist?destination=${destination}`)
    .then((response) => response.json())
    .then((packListData) => {
      // packingCardContRef.current!.innerHTML = "";
      
      pckList = packListData;
      changePck(pckList);

      gradientBgRefLoader.current!.style.display = "none";
      setGenAiPackLoad(false);
    })
    .catch((error) => {
      console.error('Error fetching packing list:', error);
    });
}
    
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const gradientBgRefLoader = useRef<HTMLDivElement>(null);
  const [genAiPackLoad, setGenAiPackLoad] = useState<boolean>(false);

  const aiGlowEffect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const button = buttonRef.current;
    if (!button) return;
    gradientRef.current!.style.opacity = "100";
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  };

  
  // Dragability for Packing Cards
  const packingCardContRef = useRef<HTMLDivElement | null>(null);
  const packCardRef = useRef<HTMLDivElement[]>([]);
  function drag_packCard(e: React.MouseEvent<HTMLDivElement>, idx: number) {
    
    if(packCardRef.current && packCardRef.current[idx] && packingCardContRef.current) {
      const card = packCardRef.current[idx];
      const containerRect = packingCardContRef.current.getBoundingClientRect();
      
  
        const determineNewListPos = (x: number, y: number) => {
          const draggableElements = packCardRef.current.filter((card) => card !== null);
          let closestElement: HTMLDivElement | null = null;
          let closestDistance = Number.POSITIVE_INFINITY;
  
          draggableElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const distance = Math.sqrt(
              Math.pow(x - (rect.left + rect.width / 2), 2) +
              Math.pow(y - (rect.top + rect.height / 2), 2)
            );
  
            if (distance < closestDistance) {
              closestDistance = distance;
              closestElement = element;
            }
          });
  
          if (closestElement && packingCardContRef.current) {
            packingCardContRef.current.insertBefore(card, closestElement);
          } else if (packingCardContRef.current) {
            packingCardContRef.current.appendChild(card);
          }
        };
  
  
  
  
      const PackingCardOrderProcessor = (list: HTMLDivElement[], mevent:MouseEvent) => {
        
        const Cardrect = card.getBoundingClientRect();
  
  
  
        if (packingCardContRef.current) {
           var x = mevent.clientX;
          if (mevent.clientX <= containerRect.left) {
            x = containerRect.left; 
          }
          else if (mevent.clientX + Cardrect.width >= containerRect.right) {
            x = containerRect.right- Cardrect.width;
          }
  
          var y = mevent.clientY;
          
          if (mevent.clientY <= containerRect.top) {
            y = containerRect.top;
          } else if (mevent.clientY + Cardrect.height >= containerRect.bottom) {
            y = containerRect.bottom - Cardrect.height;
          }
  
          card.style.position = 'absolute';
          card.style.left = `${x}px`;
          card.style.top = `${y}px`;
          card.style.zIndex = '10';
          card.style.cursor = 'grabbing';
          card.style.userSelect = 'none';
          card.style.opacity = '0.6';
          determineNewListPos(x, y);
  
        }
  
      }
      const onMouseMove = (moveEvent: MouseEvent) => {
        
        PackingCardOrderProcessor(packCardRef.current, moveEvent);
      };
  
      const onMouseUp = () => {
        
        card.style.position = 'static';
        card.style.cursor = 'pointer';
        card.style.userSelect = 'auto';
        card.style.opacity = '1';
        card.style.zIndex = '1';
  
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
  
  
  
      };
  
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }

  return (

            <div  className='h-full w-full bg-white p-5 flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-gray-800 font-bold">Packing List</span>
    
    <button
      ref={buttonRef}
      onMouseMove={aiGlowEffect}
      className="relative group  cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-200"
      title="AI Suggestions"
              onMouseLeave={() => {
          gradientRef.current!.style.opacity = "0%";
        }}
        
      onClick={() => aiGeneratePackingList() }    >
      
      <div
        ref={gradientBgRefLoader}
        className="absolute inset-0 animate-pulse hidden z-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500  transition-all duration-300"
        
      />

      <div
        ref={gradientRef}
        className="absolute inset-0 z-0 opacity-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500  transition-all duration-300"
        style={{
          WebkitMaskImage:
            'radial-gradient(120px at var(--x, 50%) var(--y, 50%), white 0%, transparent 60%)',
          maskImage:
            'radial-gradient(120px at var(--x, 50%) var(--y, 50%), white 0%, transparent 60%)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',

        }}


      />

      <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-white border-1 border-gray-300 rounded-[inherit]">
        <Image src="/img/ai.png" width={20} height={20} alt="AI Icon" />
        <span className="text-sm font-medium text-black" >Generate</span>
      </div>
    </button>


            </div>
            <button
              className="flex select-none items-center gap-2 text-green-600 cursor-pointer hover:text-green-800 font-medium rounded-lg px-2 py-1 transition-colors duration-200"
              onClick={() => {
                changePck([...pckList, { name: "New Category", values: {data:[]} }]);
                // setSumCards([...pckList.current]);
              }}
            >
              <span className="text-xl leading-none ml-auto">+</span>
              <span className='mr-auto'>Add</span>
            </button>
            </div>
            <div  className='flex justify-center'>
              {!genAiPackLoad && (
              <div ref={packingCardContRef}  className='flex flex-row gap-3 justify-evenly flex-wrap mx-auto w-fit'>
              {/* {pckList.current[0].values.data[0].name} */}
              {/* <div>
                {JSON.stringify(sumCards)}
              </div> */}
              { pckList.map((itm, idx) => (
                <div key={idx} ref={(elem) => {if(packCardRef.current && elem) packCardRef.current[idx]=elem}} className='' onMouseDown={(e) => {
                  drag_packCard(e, idx);
                }}>
                {/* <span className="text-gray-500 text-sm">{itm.values.data.map(item => item.name).join(", ")}</span> */}

                <PackingCard name={itm.name} values={ itm.values } 
                onChange={(values, cardN) => {
                  pckList[idx].name = cardN;
                  if (!pckList.some(item => item.name === itm.name)) {
                    pckList.push({ name: itm.name, values });
                  }else {
                    pckList[idx].values = values;
                  }
                  changePck([...pckList]);
                }}
                />
                </div>
            ))}
              </div>
              )}
            </div>
            </div>

  )
}

export default BagSection