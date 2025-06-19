"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/app/components/header';
import { set } from 'date-fns';

interface Card {
  name: string;
  date: string;
  type: string;
  id?: string; // Optional id for the card
}

const PlansPage = () => {


const [cards, setCards] = useState<Card[]>([]);
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const [cardLoading, setCardLoading] = useState<boolean>(true);
 useEffect(() => {
    fetch('/api/user/operations/plan/fetch/whole', {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
      if (data && data.plans) {
        const formattedPlans = data.plans.map(plan => ({
          name: plan.destination,
          date: `${new Date(plan.metadata.startDate).getDate()} ${monthNames[new Date(plan.metadata.startDate).getMonth()]} - ${new Date(plan.metadata.endDate).getDate()} ${monthNames[new Date(plan.metadata.endDate).getMonth()]}`,
          type: plan.metadata.budget || 'General',
          id: plan.id
        }))
        setCardLoading(false);
        setCards(formattedPlans);
      }
      })
      .catch(error => console.error('Error fetching plans:', error));
    }, []);


    return (
        <>
        
      <Header />
<div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Your Trips</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {!cardLoading ? (
            <>
            {cards.length === 0 && (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-500">
                <p>No trips found. Start planning your next adventure!</p>
              </div>
            )}
          {cards.map((item, index) => (
            <div
              onClick={(e) => {
                if ((e.target as HTMLElement).id !== 'remove-tripbtn') {
                  window.location.href = `/user/plans/${item.id}`;
                }
              }}
              className="group cursor-pointer h-[200px] w-full rounded-2xl overflow-hidden bg-white border border-gray-300 relative shadow-md p-4 flex flex-col justify-between"
              key={index}
            >
              <div>
              <h2 className="text-gray-900 text-xl font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.date}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                {item.type}
              </span>
              <button
              id='remove-tripbtn'
                onClick={() => {
                  // Handle card removal logic here
                  fetch('/api/user/operations/plan/delete', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: item.id }),
                  })
                    .then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        setCards(cards.filter((_, i) => i !== index));
                      } else {
                        alert('Failed to remove the trip');
                      }
                    })
                    .catch(error => console.error('Error removing trip:', error));
                }}
                className="text-sm px-3 py-1 rounded-full bg-red-400 text-white hover:bg-red-600 cursor-pointer transition"
              >
                Remove
              </button>
              </div>
            </div>
          ))}
          </>
          ):(
            <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-500">
              <p>Loading your trips...</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
        </>
    );
};

export default PlansPage;