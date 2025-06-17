
import React from 'react';
import Header from '@/app/components/header';


const PlansPage = () => {

const cards = [
  { name: 'Miami', date: '20 Jun - 27 Jun', type: 'Luxury' },
  { name: 'Tokyo', date: '5 Aug - 15 Aug', type: 'Adventure' },
  { name: 'Paris', date: '1 Sep - 10 Sep', type: 'Romantic' },

];

    return (
        <>
        
      <Header />
<div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Your Trips</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cards.map((item, index) => (
            <a
              href={``}
              className="group h-[280px] w-full rounded-2xl overflow-hidden bg-center bg-cover relative shadow-xl transition-transform duration-300 hover:scale-105"
              style={{ backgroundImage: `url('/img/LA.jpg')` }}
              key={index}
            >
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end">
                <div>
                  <h2 className="text-white text-xl font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-200">{item.date}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20">
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Hover Underline */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-[60%]"></div>
            </a>
          ))}
        </div>
      </div>
    </div>
    
        </>
    );
};

export default PlansPage;