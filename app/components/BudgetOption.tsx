import React, { useState } from 'react';

interface BudgetOptionProps {
    onBudgetSelected: (budget: string) => void;
}

const BudgetOption: React.FC<BudgetOptionProps> = ({ onBudgetSelected }) => {
 
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelected(option);
        onBudgetSelected(option);
    };

    return (
        <>
            <div>
                <span>Select your trip type:</span>
                <div className='flex mt-4'>
                    {['Budget', 'Normal', 'Luxury'].map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`w-[30%] h-[150px] mx-2 my-2 text-lg rounded-lg border cursor-pointer transition-transform duration-300 box-border shadow-md ${
                                selected === option
                                    ? 'border-blue-500 bg-blue-100 scale-105'
                                    : 'border-gray-300 bg-white hover:scale-105'
                            }`}
                            style={{
                                backgroundClip: 'border-box',
                            }}
                        >
                            <div className="flex flex-col items-center">
                                {option === 'Budget' && <span>💰</span>}
                                {option === 'Normal' && <span>🌟</span>}
                                {option === 'Luxury' && <span>💎</span>}
                                <span>{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BudgetOption;