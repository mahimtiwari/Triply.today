import { ca } from 'date-fns/locale';
import React, { useState } from 'react';

interface PackingCardInterface {
  name: string;
  values: { name: string; checked: boolean }[];
  onChange: (values: { name: string; checked: boolean }[], cardN: string) => void;
}

const PackingCard: React.FC<PackingCardInterface> = ({ name, values, onChange }) => {
  const [vals, setValues] = useState(values);
  const [cardName, setCardName] = useState(name);
  if (vals.length === 0) {
    vals.push({ name: '', checked: false });
    setValues(vals);
    onChange(vals, cardName);
  }

  const handleItemChange = (index: number, updatedItem: { name: string; checked: boolean }) => {
    const newValues = [...vals];
    newValues[index] = updatedItem;
    setValues(newValues);
    onChange(newValues, cardName);
  };

  return (
    <div className="border-1 h-fit border-gray-500 w-fit flex flex-col gap-2 rounded-lg items-center">
      <span className="p-2 w-full text-center rounded-t-lg border-b-1 border-gray-500 bg-amber-200">
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
        {vals.map((item, index) => (
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
    if (vals[vals.length - 1].name !== '') {
      const newItem = { name: '', checked: false };
      const newValues = [...vals, newItem];
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