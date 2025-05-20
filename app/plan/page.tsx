"use client";
import React, { use, useEffect, useState } from 'react'
const PlanTrip = () => {


 const [tripDetails, setTripDetails] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    peopleType: '',
    adults: '',
    children: '',
  });

const [dataJSON, setDataJSON] = useState(null);


  useEffect(() => {
    // This code runs only in the browser after the component mounts

    let locData: string;

    fetch('https://ipinfo.io/json')
      .then((res) => res.json())
      .then((locationData) => {
        locData = `${locationData.city}, ${locationData.region}, ${locationData.country}`;
        
        
        fetch(`/api/plantrip?${params.toString()}&clientLocation=${locData}`)
          .then((response) => response.json())
          .then((data) => {
            setDataJSON(data);
          })
          .catch((error) => {
            console.error('Error fetching trip data:', error);
          });
          })


      .catch((err) => {
        console.error("Error fetching location:", err);
      });
    
    const params = new URLSearchParams(window.location.search);
    setTripDetails({
      destination: params.get('destination') || '',
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      budget: params.get('budget') || '',
      peopleType: params.get('peopleType') || '',
      adults: params.get('adults') || '',
      children: params.get('children') || '',
    });


  }, []);



  return (
    <>
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Trip Details</h2>
        <div className="text-gray-600 space-y-1">
          <p><span className="font-semibold">Destination:</span> {tripDetails.destination}</p>
          <p><span className="font-semibold">Start Date:</span> {tripDetails.startDate}</p>
          <p><span className="font-semibold">End Date:</span> {tripDetails.endDate}</p>
          <p><span className="font-semibold">Budget:</span> {tripDetails.budget}</p>
          <p><span className="font-semibold">People Type:</span> {tripDetails.peopleType}</p>
          <p><span className="font-semibold">Adults:</span> {tripDetails.adults}</p>
          <p><span className="font-semibold">Children:</span> {tripDetails.children}</p>
        </div>
      </div>
      Data is being fetched from the API and will be displayed below:
      <p className="text-gray-500 text-sm mt-2 animate-pulse">Please wait...</p>
      {dataJSON && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Trip Plan Data</h2>
          <pre className="text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(dataJSON, null, 2)}
          </pre>
        </div>
      )}

    </>
  )
}
export default PlanTrip
