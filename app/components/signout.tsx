"use client";
import React from 'react'
import { signOut } from 'next-auth/react';
const SignOutBtn = () => {
  return (
    <button className='bg-red-400 p-3 rounded-2xl text-white' onClick={() => signOut()}>Logout</button>
  )
}

export default SignOutBtn