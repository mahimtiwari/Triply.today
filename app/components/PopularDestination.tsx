import React from 'react'
import Image from 'next/image'


const PopularDestination = [
    {destination: "Los Angles", src: "/img/thailand.jpg"},
    {destination: "Thailand", src: "/img/thailand.jpg"},
    {destination: "Japan", src: "/img/thailand.jpg"},
];

const PopularDestinationComponent = () => {
  return (
    <>
    
        <div className="flex flex-col items-center justify-center py-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-[geist] text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text leading-tight">
            Popular Destinations
            </h2>
            <p className="text-gray-500 text-center text-base sm:text-lg md:text-lg max-w-md sm:max-w-lg md:max-w-xl">
            Explore the most sought-after travel spots around the world.
            </p>

            {/* <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">

                    {PopularDestination.map((item, index) => (

                        <div 
                        key={index}
                        className="h-[250px] w-[250px] rounded-xl overflow-hidden bg-center bg-cover relative group cursor-pointer transform transition duration-500 hover:scale-105 shadow-xl"
                        style={{ backgroundImage: `url('${item.src}')` }}>

                            
                            <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-[38px] transition duration-500 group-hover:scale-105 group-hover:rotate-[1deg] drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                                {item.destination}
                            </div>
                        </div>
                
     
                    )
                    )}

                </div>
                    

            </div> */}

        </div>


    </>
  )
}

export default PopularDestinationComponent