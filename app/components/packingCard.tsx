import { set } from 'date-fns';
import { ca } from 'date-fns/locale';
import { on } from 'events';
import React, { useEffect, useRef, useState } from 'react';
type valuesType = {data: { name: string; checked: boolean }[], color?: string};
interface PackingCardInterface {
  name: string;
  values: valuesType;
  onChange: (values: valuesType, cardN: string) => void;
}

const PackingCard: React.FC<PackingCardInterface> = ({ name, values, onChange }) => {
  const [vals, setValues] = useState(values);
  const [cardName, setCardName] = useState(name);
  const cardTopColors = [
    'bg-amber-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-red-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-yellow-200',
    'bg-gray-200',
    'bg-teal-200',
    'bg-indigo-200',
    'bg-lime-200',
    'bg-cyan-200',
    'bg-orange-200',
    'bg-violet-200',
    'bg-rose-200',
    'bg-sky-200',
    'bg-emerald-200',
    'bg-fuchsia-200'
    ]

  useEffect(() => {
    onChange(vals, cardName);
  }, [vals]);

  const color = useRef<string>(!vals.color ? cardTopColors[Math.floor(Math.random() * cardTopColors.length)] : vals.color);
  if (!vals.color) {
    console.log('Setting default color');
    setValues({...vals, color: color.current});

  }

  if (vals.data.length === 0) {
    setValues({data:[{ name: '', checked: false }], color: vals.color});

  }
  const handleItemChange = (index: number, updatedItem: { name: string; checked: boolean }) => {
    const newValues = {...vals};
    newValues.data[index] = updatedItem;
    newValues.color = color.current;
    setValues(newValues);

  };

  return (
<div className="relative group h-fit w-fit flex flex-col gap-2 border bg-white border-gray-500 rounded-lg items-center ">


      <span className={`p-2 w-full text-center rounded-t-lg border-b-1 border-gray-500 ${vals.color}`}>
        <input
          className="outline-0 text-center "
          type="text"
          value={cardName}
          onChange={(e) => {setCardName(e.target.value)
            onChange(vals, e.target.value)
          }}
        />
      </span>
      <div className="p-3 flex flex-col gap-2 ">
        {vals.data.map((item, index) => (
          <div key={index} className="select-none flex items-center gap-2 group/item">
<div
  className={`w-4 h-4 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ease-in-out
    ${item.checked ? 'bg-green-100 shadow-lg scale-105 border-1 border-green-600' : 'border-1 border-gray-300 group-hover/item:bg-gray-100 group-hover/item:border-green-400'}`}
  onClick={() =>
    handleItemChange(index, { ...item, checked: !item.checked })
  }
>

    <svg
      className={`w-3.5 h-3.5  transition-opacity duration-200 ease-in-out ${
      item.checked ? 'opacity-100 text-green-600' : 'opacity-0 group-hover/item:opacity-100  text-green-400'
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>

</div>
  <div className="relative">
    <input
      className="outline-0 pr-2 select-none"
      style={{color: item.checked ? 'gray' : 'black'}}
      type="text"
      value={item.name}
      disabled={item.checked}
      placeholder="Item Name"
      onChange={(e) =>
        handleItemChange(index, { ...item, name: e.target.value })
      }
    />

  </div>
            
            <button
              className="flex items-center cursor-pointer justify-center w-4 h-4 text-white bg-red-400 rounded-full hover:bg-red-500 transition-colors duration-200"
              onClick={() => {
              const newValues = { ...vals };
              newValues.data.splice(index, 1);
              setValues(newValues);
              onChange(newValues, cardName);
              }}
            >
              <span className="text-[8px] font-bold">✕</span>
            </button>
          </div>
        ))}
        <div>
<button
  className="flex items-center w-full gap-2 text-green-600 cursor-pointer hover:text-green-800 font-medium rounded-lg px-2 py-1 transition-colors duration-200"
  onClick={() => {
    if (vals.data[vals.data.length - 1].name !== '') {
      const newValues = {...vals};
      newValues.data.push({ name: '', checked: false });
      setValues(newValues);
      onChange(newValues, cardName);
    }
  }}
>
  <span className="text-xl leading-none ml-auto">+</span>
  <span className='mr-auto'>Add</span>
</button>
        </div>
      </div>
    </div>
  );
};

export default PackingCard;