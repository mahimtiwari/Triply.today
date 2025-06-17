"use client";
import React from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { signOut } from 'next-auth/react';
const UserProfHeader = () => {
      const { data: session, status } = useSession();
      const router = useRouter();
  return (
    <a className='rounded-full bg-white ml-2'
        href='/user'
    >
        <Image
        src={session?.user?.image || ''}
        alt="User Profile"
        width={35}
        height={35}
        className="rounded-full"
        />
    </a>
  )
}

export default UserProfHeader