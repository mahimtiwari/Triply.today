"use client";
import React, { useEffect, useRef, useState } from 'react';

interface suggestion_Type {
    search: string;
    region: string;
}

const SearchBarAutocomplete = () => {
    const [query, setQuery] = useState('');
    const [boolSuggestions, setBoolSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<suggestion_Type[]>([]);
    const lastSelectedSuggestion = useRef<string | null>(null);

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
    }

    return (
        <form className="w-full max-w-[500px] mt-[70px] mx-[10px]">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input
                    type="search"
                    autoComplete='off'
                    id="default-search"
                    className="block w-full font-bold text-[18px] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-300 focus:ring-3 outline-none transition-all duration-300"
                    placeholder="Search Countries or Cities"
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
                        className="absolute z-10 w-[100%] mt-2 bg-white border border-gray-300 rounded-2xl shadow-lg  overflow-y-auto divide-y divide-gray-200 transition-all duration-300 transform "
                        style={{
                            animation: boolSuggestions
                                ? 'fadeInScale 0.3s ease-out forwards'
                                : 'fadeOutScale 0.2s ease-in forwards',
                        }}
                    >
                        {filteredSuggestions.map((suggestion, idx) => (
                            <li
                                key={suggestion.search + idx}
                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2 w-full"
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
                                    <p className="text-sm text-gray-500">{suggestion.region}</p>
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
                    className="text-white absolute end-2.5 bottom-0 rounded-2xl rounded-bl-none rounded-tl-none bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-[14px] h-[100%] right-0 w-[100px]"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBarAutocomplete;
