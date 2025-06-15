'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
export default function SignInButtons() {
  return (
    <div className='flex flex-col gap-3 w-full mt-5'>
<button
  onClick={() => signIn('google')}
  className="group relative inline-flex hover:bg-gray-50 transition-all duration-200 cursor-pointer items-center w-full justify-center px-5 h-[50px] overflow-hidden rounded-xl border border-gray-300 bg-white "
>
  
  <Image
    src="/img/sGoogle.webp"
    alt="Google Sign In"
    width={21}
    height={21}
    className="z-10 rounded-full"
  />
  
  <span className="z-10 ml-3 text-gray-700 font-medium text-sm group-hover:text-black transition-colors duration-300">
    Sign in with Google
  </span>
</button>
{/* <button
  onClick={() => signIn('apple')}
  className="group relative inline-flex w-full transition-all duration-200 cursor-pointer bg-black items-center justify-center px-5 h-[50px] overflow-hidden rounded-xl border border-gray-200 "
>
  <Image
    src="/img/sappleW.png"
    alt="Apple Sign In"
    width={20}
    height={20}
    className="z-10 rounded-full"
  />

  <span className="z-10 ml-3 text-white font-medium text-sm transition-colors duration-300">
    Sign in with Apple
  </span>
</button> */}
</div>

  );
}
