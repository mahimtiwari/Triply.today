import Image from "next/image";
import Header from "./components/header";
import SearchBarAutocomplete from "./components/searchbar";
import "../public/css/home.css";
export default function Home() {
  return (
    <>
    <Header />
    <div className="flex justify-center flex-col items-center">

    <h1 className="text-[50px] mt-[50px] font-bold font-[geist] max-w-[800px] text-center">Hey, I’m Triply – your personal trip planner.</h1>
    <SearchBarAutocomplete />

    </div>
    </>
  );
}
