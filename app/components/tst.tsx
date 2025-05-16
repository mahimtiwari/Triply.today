'use client'

import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
    'New York',
    'London',
    'Paris',
    'Tokyo',
    'Sydney',
    'Berlin',
    'Los Angeles',
    'Toronto',
    'Singapore',
    'Dubai',
    'Rome',
    'Barcelona',
    'Bangkok',
    'Istanbul',
    'Amsterdam',
    'San Francisco',
    'Cape Town',
    'Moscow',
    'Hong Kong',
    'Rio de Janeiro'
];

const SearchBarAutocomplete = () => {
    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (query.trim() === '') {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        const filtered = SUGGESTIONS.filter(s =>
            s.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
    }, [query]);

    // Hide suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
    };

    const handleFocus = () => {
        if (filteredSuggestions.length > 0) setShowSuggestions(true);
    };

    return (
        <form className="w-full max-w-[500px] mt-[70px] mx-[10px]" autoComplete="off">
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
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    autoComplete="off"
                />
                {showSuggestions && (
                    <ul
                        ref={suggestionsRef}
                        className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
                    >
                        {filteredSuggestions.map((suggestion, idx) => (
                            <li
                                key={suggestion}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                onMouseDown={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
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
