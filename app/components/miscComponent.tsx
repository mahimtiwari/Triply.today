import React from 'react'
import Image from 'next/image'
import { useState, useRef } from 'react'

interface MiscComponentProps {
    name: string;
    inpval: number; // Add inpval as a prop
    onChange: (value: number) => void;
}

const MiscComponent: React.FC<MiscComponentProps> = ({ name, inpval, onChange }) => {
        const [InputValue, setInputValue] = useState<number>(inpval); // Initialize with inpval
        const InputValueRef = useRef<HTMLInputElement>(null);

        return (
                <div className="flex items-center justify-between cursor-pointer">
                        <h2 className="text-lg font-bold text-gray-700">{name}</h2>
                        <div className="flex items-center gap-4">
                                <div className="flex items-center bg-gradient-to-r from-green-300 via-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                        <span className="mr-2">$</span>
                                        <input
                                                ref={InputValueRef}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const value = e.target.value ? parseInt(e.target.value) : 0;
                                                        setInputValue(value);
                                                        onChange(value);
                                                }}
                                                value={InputValue}
                                                type="text"
                                                className="bg-transparent border-none outline-none text-white placeholder-white w-12 text-center"
                                                placeholder="0"
                                                style={{
                                                        width: `${Math.max(20, String(InputValue).length * 12)}px`,
                                                }}
                                        />
                                </div>
                                <button
                                        className="flex items-center cursor-pointer justify-center bg-gray-200 hover:bg-gray-300 transition-all duration-200 ease-in-out p-2 rounded-full"
                                        onClick={() => {
                                                InputValueRef.current?.focus();
                                        }}
                                >
                                        <Image src={`/img/pen.png`} width={16} height={16} alt="edit" />
                                </button>
                        </div>
                </div>
        );
};

export default MiscComponent
