import React from 'react'

const SearchBarAutocomplete = () => {
    return (
        <form className="w-full max-w-[500px] mt-[70px] mx-[10px]">    
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                                <input 
                                    type="search" 
                                    id="default-search" 
                                    className="block w-full font-bold text-[18px] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-300 focus:ring-3 outline-none transition-all duration-300" 
                                    placeholder="Search Countries or Cities" 
                                    required 
                                />
                                <button 
                                    type="submit" 
                                    className="text-white absolute end-2.5 bottom-0 rounded-2xl rounded-bl-none rounded-tl-none bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-[14px] h-[100%] right-0 w-[100px]"
                                >
                                    Search
                                </button>
            </div>
        </form>
    )
}

export default SearchBarAutocomplete
