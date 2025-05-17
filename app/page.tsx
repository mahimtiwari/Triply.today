import Image from "next/image";
import Header from "./components/header";
import SearchBarAutocomplete from "./components/searchbar";
import "../public/css/home.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative flex flex-col items-center justify-center h-[70vh] bg-gradient-to-b from-white via-blue-100 to-purple-100 px-4">
        {/* Background image overlay (optional) */}
        {/* <div className="absolute inset-0 z-0">
          <Image src="/images/travel-bg.jpg" alt="Background" fill className="object-cover opacity-20" />
        </div> */}

        {/* Main content */}
        <div className="z-10 flex flex-col items-center text-center space-y-6 animate-fade-in pb-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[geist] text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text leading-tight">
            Build your perfect trip plan ✈️
          </h1>
            <p className="text-gray-500 text-lg sm:text-xl max-w-xl ">
            Discover destinations, compare costs, and customize your next adventure—all in one place.
            </p>

          <SearchBarAutocomplete placeholder="Search destinations, interests..." />

        </div>
      </main>
    </>
  );
}
