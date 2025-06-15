import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignOutBtn from '@/app/components/signout';
import { Sign } from 'crypto';
const User = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {session ? (
      <>
        <p>Welcome, {session.user?.name}!</p>
        <SignOutBtn />
      </>
      ) : (
      <p>Please log in.</p>
      )}
    </div>
  )
}

export default User