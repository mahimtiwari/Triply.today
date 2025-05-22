import React from 'react'


const PopularDestination = [
    {destination: "San Fransisco", src: "/img/thailand.jpg"},
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




            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">


                        <div className="group h-[250px] w-[250px] rounded-2xl overflow-hidden bg-center bg-cover relative group cursor-pointer shadow-2xl transition-transform duration-300 hover:scale-105"
  style={{ backgroundImage: `url('/img/thailand.jpg')` }}>

  <div 
    className="absolute flex bottom-4 left-1/2 -translate-x-1/2 w-[90%] px-4 py-2 text-lg font-semibold text-white rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md"
  >
    
    <span className="text-center">Thailand</span>
    <span className="ml-auto text-center text-transparent  bg-white group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 bg-clip-text">❤️</span>
  
  </div>

  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-[60%]"></div>
</div>

                
     


                </div>
                    

            </div>

        </div>


    </>
  )
}

export default PopularDestinationComponent