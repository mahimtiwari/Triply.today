import React from 'react';
import Headers from '@/app/components/header';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserComp from '../components/UserComp';
import { redirect } from 'next/navigation';
const User = async () => {

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/user/signup');
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Headers />
      <UserComp />
    </div>
  );
};

export default User;
