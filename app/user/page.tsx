'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Headers from '@/app/components/header';
import SignOutBtn from '@/app/components/signout';
import Image from 'next/image';
import { SessionProvider } from 'next-auth/react';
const User = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if no session
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/user/signup');
    }
  }, [status, router]);



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Headers />
      <div className="flex-1 flex flex-row font-[geist]">
        <div className="p-5 min-w-[250px] bg-white">
          <div className="flex flex-col gap-3">
            <button className="cursor-pointer flex items-center w-full text-white bg-[#306aff] p-3 gap-2 rounded-2xl">
              <span className="material-icons">person</span>
              <span className="font-semibold">Account</span>
            </button>
            <button className="cursor-pointer flex items-center w-full text-[#7a7a7a] p-3 gap-2 rounded-2xl">
              <span className="material-icons">travel_explore</span>
              <span className="font-semibold">Trip Plans</span>
            </button>
            <button className="cursor-pointer flex items-center w-full text-[#7a7a7a] p-3 gap-2 rounded-2xl">
              <span className="material-icons">timeline</span>
              <span className="font-semibold">Travel History</span>
            </button>
          </div>
        </div>
        
        <div className="w-full p-10">
          <div className="max-w-xl p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={session?.user?.image || '/default-avatar.png'}
                alt={session?.user?.name || 'User'}
                width={48}
                height={48}
                className="rounded-full border shadow-sm"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Welcome, {session?.user?.name}!
                </p>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
            </div>

            <SignOutBtn />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default User;
