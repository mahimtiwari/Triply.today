'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { signOut } from 'next-auth/react';

const UserComp = () => {

      const { data: session, status } = useSession();
      const router = useRouter();
      const inputNameRef = useRef<HTMLInputElement>(null);
      // Redirect if no session
      useEffect(() => {
        if (status === 'unauthenticated') {
          router.push('/user/signup');
        }
        setNameValue(session?.user?.name || '');
      }, [status, router]);

      const [nameLoading, setNameLoading] = useState<boolean>(false);

      const showSaveButton = useRef<boolean>(false);
      const [nameValue, setNameValue] = useState<string>(session?.user?.name || '');

      const [sideSelect, setSideSelect] = useState<string>('account');
      const [userEditBool, setUserEditBool] = useState<boolean>(false);
            useEffect(() => {
        if (inputNameRef.current) {
          inputNameRef.current.focus();
        }
      }, [userEditBool]);
    
      function changeName(){
        setNameLoading(true);
        fetch('/api/user/operations/namechange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: nameValue }),
        }).then((res) => {
          if (res.ok) {
            console.log('Name updated successfully');
            showSaveButton.current = false;
            setUserEditBool(false);
            setNameLoading(false);
          } else {
            console.error('Failed to update name');
            setNameLoading(false);
          }})
        
      }


  return (
    
          <div className="flex-1 flex flex-row font-[geist]">
            
        <div className="p-5 min-w-[250px] bg-white border-r-1 border-gray-200">
          <div className="flex flex-col gap-3">
            <button className="cursor-pointer flex items-center w-full p-3 gap-2 rounded-2xl"
                onClick={() => setSideSelect('account')}
                style={{
                    backgroundColor: sideSelect === 'account' ? '#306aff' : 'transparent',
                    color: sideSelect === 'account' ? 'white' : '#7a7a7a',
                }}
            >
              <span className="material-icons">person</span>
              <span className="font-semibold">Account</span>
            </button>
            <button className="cursor-pointer flex items-center w-full text-[#7a7a7a] p-3 gap-2 rounded-2xl"
                onClick={() => setSideSelect('trip-plans')}
                style={{
                    backgroundColor: sideSelect === 'trip-plans' ? '#306aff' : 'transparent',
                    color: sideSelect === 'trip-plans' ? 'white' : '#7a7a7a',
                }}
            >

              <span className="material-icons">travel_explore</span>
              <span className="font-semibold">Trip Plans</span>
            </button>
            {/* <button className="cursor-pointer flex items-center w-full text-[#7a7a7a] p-3 gap-2 rounded-2xl"
                onClick={() => setSideSelect('travel-history')}
                style={{
                    backgroundColor: sideSelect === 'travel-history' ? '#306aff' : 'transparent',
                    color: sideSelect === 'travel-history' ? 'white' : '#7a7a7a',
                }}
            >
              <span className="material-icons">timeline</span>
              <span className="font-semibold">Travel History</span>
            </button> */}
          </div>
        </div>
        
        <div className="w-full p-10 bg-[#f6f8fa]">
            <span className='text-2xl font-semibold text-gray-800'>
                {sideSelect === 'account' ? 'User' : sideSelect === 'trip-plans' ? 'Your Trip Plans' : sideSelect === 'travel-history' ? 'Your Travel History' : ''}
            </span>
            <div className="p-4 mt-4 bg-white rounded-xl">
            {sideSelect === 'account' && (
               
                <div>
                    {session && (
                        <>
                        
                        <div className='flex flex-row items-center gap-4'>
                        <Image
                            src={session?.user?.image || ""}
                            alt={session?.user?.name || "User Img"}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <span className='flex flex-col gap-1'>
                            {userEditBool ? (
                                <input 
                                ref={inputNameRef}
                                    type="text" 
                                    value={nameValue} 
                                    onChange={(e) => setNameValue(e.target.value)}
                                    className='outline-none focus:border-b-[2px] border-gray-300 font-medium leading-none text-xl transition-colors duration-200'

                                />
                            ) : (
                                <span className="text-gray-800 text-xl font-medium leading-none">{nameValue}</span>
                            )}
                            <span className='leading-none text-sm text-gray-500'>{session?.user?.email}</span>
                        </span>
                        <button 
                            className='ml-auto text-gray-400 hover:text-gray-500 hover:border-gray-400 flex flex-row gap-1 p-1 cursor-pointer rounded-lg items-center border-2 border-gray-300 transition-colors duration-200 '
                            onClick={() => {
                                showSaveButton.current = true;
                                setUserEditBool(!userEditBool);
                            }}>
                                <span className='material-icons'
                                style={{fontSize: "18px",}}>edit</span>
                                <span className='font-medium text-sm'>Edit</span>
                            </button>
                        </div>

                        <div className=''>
                            {showSaveButton.current && (
                                <button
                                className="px-5 mt-8 h-[40px] w-full py-2 border cursor-pointer border-green-400 text-green-700 rounded-lg hover:bg-green-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                                onClick={() => {
                                    setUserEditBool(false);
                                    changeName();
                                }}
                                disabled={nameLoading}
                                >
                                    {!nameLoading ? (
                                <span>Save Changes</span>
                                ): (
                                    <span className="flex items-center justify-center">
                                        <span className="animate-spin material-icons text-gray-500" style={{ fontSize: "18px" }}>
                                            refresh
                                        </span>
                                    </span>
                                )}
                                </button>


                            )}
                        </div>
                        <div className="mt-4">
                            <button
                                className="px-5 h-[40px] w-full py-2 border cursor-pointer border-red-400 text-red-700 rounded-lg hover:bg-red-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                                onClick={() => {
                                    signOut({ callbackUrl: '/' });
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                        </>
                    )}
                </div>
            )}
            {sideSelect === 'trip-plans' && (
              <a href="/user/plans" className='text-blue-500 underline'>View your Trip Plans</a>
            )}
            {/* <div className="flex items-center space-x-4">
              <Image
              
                src={session?.user?.image}
                alt={session?.user?.name}
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

            <SignOutBtn /> */}
          </div>
        </div>
        
      </div>
  )
}

export default UserComp