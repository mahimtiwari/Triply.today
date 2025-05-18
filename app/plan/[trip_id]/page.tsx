"use client";
import React from 'react'
import { useParams } from 'next/navigation';
const PlanTrip = () => {
  const params = useParams();
  const id = params.trip_id;
  return (
    <>
    <div>{id}</div>
    <div>Working on this page :)</div>
    </>
  )
}
export default PlanTrip
