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
<div className="relative group h-fit w-fit flex flex-col gap-2 border border-gray-500 rounded-lg items-center">
  
  {/* tools menu above the card */}
  <div className="absolute -top-8 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
    <button className="p-1 rounded bg-white border border-gray-300 hover:bg-gray-100 text-sm">✏️</button>
    <button className="p-1 rounded bg-white border border-gray-300 hover:bg-gray-100 text-sm">🗑️</button>
  </div>

      <span className={`p-2 w-full text-center rounded-t-lg border-b-1 border-gray-500 ${vals.color}`}>
        <input
          className="outline-0 text-center"
          type="text"
          value={cardName}
          onChange={(e) => {setCardName(e.target.value)
            onChange(vals, e.target.value)
          }}
        />
      </span>
      <div className="p-3 flex flex-col gap-2">
        {vals.data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              className="outline-0"
              type="text"
              value={item.name}
              placeholder='Item Name'
              onChange={(e) =>
                handleItemChange(index, { ...item, name: e.target.value })
              }
            />
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) =>
                handleItemChange(index, { ...item, checked: e.target.checked })
              }
            />
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