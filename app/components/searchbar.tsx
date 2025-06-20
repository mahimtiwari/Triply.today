"use client";
import React, { useEffect, useRef, useState } from 'react';

interface suggestion_Type {
    search: string;
    region: string;
}

const SearchBarAutocomplete = (parameters: any) => {
    const [query, setQuery] = useState('');
    const [boolSuggestions, setBoolSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<suggestion_Type[]>([]);
    const lastSelectedSuggestion = useRef<string | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    useEffect(() => {
        if (query.trim() === '' || query === lastSelectedSuggestion.current) {
            setFilteredSuggestions([]);
            setBoolSuggestions(false);
            return;
        }

        fetch(`/api/search?query=${encodeURIComponent(query)}`)
            .then((response) => response.json())
            .then((data) => {
                const suggestions: suggestion_Type[] = data.sugs;
                setFilteredSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
                setBoolSuggestions(suggestions.length > 0);
            })
            .catch((error) => {
                console.error('Error fetching suggestions:', error);
                setFilteredSuggestions([]);
                setBoolSuggestions(false);
            });

        return () => {
            setFilteredSuggestions([]);
            setBoolSuggestions(false);
        };
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (event.target !== document.getElementById('default-search')) {
                setBoolSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleSuggestionClick(suggestion: string) {
        setQuery(suggestion);
        lastSelectedSuggestion.current = suggestion;
        setBoolSuggestions(false);
        setTimeout(() => {
        if (formRef.current) {
            formRef.current.submit(); // Submit the form when a suggestion is clicked
        }
    }, 0);
    }

    return (
        <form ref={formRef} action="/preplan" className="w-full max-w-[500px] mt-[70px] mx-[10px]">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 z-1 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input
                    type="search"
                    name='destination'
                    autoComplete='off'
                    id="default-search"
                    className="block bg-white/50 backdrop-blur-[30px] w-full font-bold text-[18px] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl focus:ring-blue-300 focus:ring-3 outline-none transition-all duration-300"
                    placeholder={parameters.placeholder}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        lastSelectedSuggestion.current = null; // Reset when typing
                    }}
                    onFocus={() => {
                        const exactMatch = filteredSuggestions.some(s => s.search.toLowerCase() === query.toLowerCase());
                        setBoolSuggestions(filteredSuggestions.length > 0 && !exactMatch);
                    }}
                    value={query}
                    required
                />
                {boolSuggestions && (
                    <>
                    <ul
                        className="absolute z-10 w-[100%] mt-2 overflow-y-hidden overflow-x-hidden backdrop-blur-md border border-gray-300 rounded-2xl shadow-lg divide-y divide-gray-200 transition-all duration-300 transform "
                        style={{
                            backgroundColor: 'rgb(255 255 255 / 30%)',
                            animation: boolSuggestions
                                ? 'fadeInScale 0.3s ease-out forwards'
                                : 'fadeOutScale 0.2s ease-in forwards',
                        }}
                    >
                        {filteredSuggestions.map((suggestion, idx) => (
                            <li
                                key={suggestion.search + idx}
                                className="px-4 py-3 cursor-pointer hover:bg-white/45 hover:scale-102 transition-all duration-300 flex items-center gap-2 w-full"
                                onMouseDown={() => handleSuggestionClick(suggestion.search)}
                                onClick={() => handleSuggestionClick(suggestion.search)}
                            >
                                <svg
                                    className="w-5 h-5 text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16.88 3.549a9.953 9.953 0 00-9.76 0A9.953 9.953 0 003 12c0 3.866 2.186 7.243 5.4 8.88a9.953 9.953 0 009.76 0A9.953 9.953 0 0021 12c0-3.866-2.186-7.243-5.4-8.88z"
                                    />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">{suggestion.search}</p>
                                    <p className="text-sm text-left text-gray-500">{suggestion.region}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <style jsx>{`
                        @keyframes fadeInScale {
                            0% {
                                opacity: 0;
                                transform: scale(0.95);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                        @keyframes fadeOutScale {
                            0% {
                                opacity: 1;
                                transform: scale(1);
                            }
                            100% {
                                opacity: 0;
                                transform: scale(0.95);
                            }
                        }
                    `}</style>
                    </>
                )}
                
                <button
                    type="submit"
                    className="rounded-r-2xl text-white absolute end-2.5 bottom-0 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold text-sm px-6 py-3 h-[100%] right-0 w-[120px] transition-all duration-300 cursor-pointer"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBarAutocomplete;
