import { set } from 'date-fns';
import { tr } from 'date-fns/locale';
import React, { useState, useRef } from 'react'

const TypeOfPeople = () => {
    const [selected, setSelected] = useState<string | null>(null);

    const besideSolo = useRef(false);
    const setBesideSolo = (value: boolean) => {
        besideSolo.current = value;
    }

    const [ adults, setAdults ] = useState(1);
    const [ children, setChildren ] = useState(0);

    const changeAdults = (value: number, hardchange?:boolean) => {

        if (hardchange) {
            setAdults(value);
            return;
        }
        else if (adults+value > 0) {
            setAdults(adults+value);
        }else {
            
        }
    }
    const changeChildren = (value: number, hardchange?:boolean) => {
        if (hardchange){
            setChildren(value);
            return;
        }
        else if (children+value >= 0) {
            setChildren(children+value);
        }else {
            
        }
    }

    const handleSelect = (option: string) => {
        if (option === 'Family' || option === 'Custom') {
            setBesideSolo(true);
            if (option === 'Family') {
                changeAdults(2, true);
                changeChildren(2, true);
            } else if (option === 'Custom') {
                changeAdults(1, true);
                changeChildren(0, true);
            }

        } else {
            setBesideSolo(false);
            changeAdults(option === 'Solo' ? 1 : 2, true);
        }
        setSelected(option);

    };

    return (
        <>
            <div>
                <span className="">Select the type of people for your trip:</span>
                <div className='flex flex-wrap sm:flex-wrap mt-4 justify-between gap-5 sm:gap-10'>
                    {['Solo', 'Family', 'Couple', 'Custom'].map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`w-full sm:w-50 h-36 text-lg rounded-lg border cursor-pointer transition-transform duration-300 box-border shadow-md ${
                                selected === option
                                    ? 'border-blue-500 bg-blue-100 scale-105'
                                    : 'border-gray-300 bg-white hover:scale-105'
                            }`}
                            style={{
                                backgroundClip: 'border-box',
                            }}
                        >
                            <div className="flex flex-col items-center ">
                                {option === 'Solo' && <span>🧍</span>}
                                {option === 'Family' && <span>👨‍👩‍👧‍👦</span>}
                                {option === 'Couple' && <span>❤️</span>}
                                {option === 'Custom' && <span>✨</span>}
                                <span>{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {besideSolo.current && (
                <>
                <div id="change-anc" className="mt-6 mb-50 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
                    <div className="flex items-center justify-between">
        <div className="text-gray-700 font-medium text-lg">
          Adults
          <div className="text-sm text-gray-500">Age 13+</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all"
            aria-label="Decrease Adults"
            onClick={() => changeAdults(-1)}
            
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-800">{adults}</span>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all"
            aria-label="Increase Adults"
            onClick={() => changeAdults(1)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-gray-700 font-medium text-lg">
          Children
          <div className="text-sm text-gray-500">Ages 2–12</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all"
            aria-label="Decrease Children"
            onClick={() => changeChildren(-1)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-800">{children}</span>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all"
            aria-label="Increase Children"
            onClick={() => changeChildren(1)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
                </>
            )}
        </>
    );
}

export default TypeOfPeople