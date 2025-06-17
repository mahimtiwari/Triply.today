
'use client';
import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserProfHeader from './userProfHeader';
import Image from 'next/image';
import { signOut } from 'next-auth/react';


export default function CHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data: session, status } = useSession();
  const router = useRouter();
  

  return (
    
    <header className="backdrop-blur-md sticky top-0 z-100 font-[geist]" style={{backgroundColor: 'rgb(255 255 255 / 70%)',}}>
      <nav aria-label="Global" className="mx-auto flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-blue-600 font-[geist] tracking-tight">
              Triply<span className="text-black ml-[2px]">.today</span>
            </span>
            {/* <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            /> */}
          </a>
        </div>
        <div className="flex lg:hidden">


          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          {status === 'authenticated' && (
          <UserProfHeader />
          )}

        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {/* <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Product
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >

            </PopoverPanel>
          </Popover> */}

          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Trip Plans
          </a>
          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Travel History
          </a>
        </PopoverGroup>
        
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {status !== 'authenticated' && (
            <a href="/user/signin" className="text-sm/6 font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
            )}
            {status === 'authenticated' && (
          <UserProfHeader />
          )}
          </div>

        
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel 
        className="bg-white border-l-1 flex flex-col h-full border-gray-200 fixed inset-y-0 right-0 z-100 w-full overflow-y-auto sm:max-w-sm">
          <div className=' w-full'>
           
            <div className="flex items-center justify-between px-4 py-6">
              <div>
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-bold text-blue-600 font-[geist] tracking-tight">
                    Triply<span className="text-black ml-[2px]">.today</span>
                  </span>
                </a>
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
            </div>
            

            <div className='px-5 flex flex-col gap-2'>
                <a 
                href="/" 
                className="w-full p-3 flex items-center gap-2 text-[18px] font-semibold text-gray-500 rounded-xl  hover:bg-gray-100 transition duration-200"
                >
                  <span className='material-icons'
                  style={{fontSize: "20px",}}
                  >
                    home
                  </span>
                Home
                </a>
                <a 
                href="" 
                className="w-full p-3 flex items-center gap-2 text-[18px] font-semibold text-gray-500 rounded-xl  hover:bg-gray-100 transition duration-200"
                >
                  <span className='material-icons'
                  style={{fontSize: "20px",}}
                  >
                    travel_explore
                  </span>
                Trip Plans
                </a>
                <a 
                href="" 
                className="w-full p-3 flex items-center gap-2 text-[18px] font-semibold text-gray-500 rounded-xl  hover:bg-gray-100 transition duration-200"
                >
                  <span className='material-icons'
                  style={{fontSize: "20px",}}
                  >
                    timeline
                  </span>
                Travel History
                </a>

            </div>

          </div>
          <div className='mt-auto'>
            {status === 'authenticated' ?  (
                <div className="flex items-center gap-4 p-4 border-t border-gray-200 bg-gray-50">
                  <UserProfHeader />
                  <div className="flex flex-col ">
                  <p className="text-lg font-semibold text-gray-800 leading-tight">{session.user?.name}</p>
                  <p className="text-sm text-gray-500 leading-tight">Welcome back!</p>
                  </div>
                </div>
            ) : 
            (
              <div className='w-full flex flex-row gap-2 p-3 text-lg font-semibold'>
                <a href="/user/signin" className='w-full text-center p-3 bg-[#306bffdb] rounded-4xl text-white'>Sign In</a>
                <a href="/user/signup" className='w-full text-center p-3 border-2  border-[#306aff] rounded-4xl text-[#306aff]'>Sign Up</a>
              </div>
            )
            }

          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
