
import Image from "next/image";
import NavBar from "./navbar";
import DropDown from "./dropDown";
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10 dark:bg-[#1a1229]/80  dark:border-purple-900/50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="w-full flex items-center justify-between gap-4">
                    <div className="sm:mb-2.5 bg-white/15 py-1 px-0.5 sm:px-1 rounded-xl">
                        <Link href="/">
                            <Image src={"/logo/logo.png"} alt="logo" width={150} height={150} priority style={{ height: "auto", width: "auto" }} />
                        </Link>
                    </div>
                    <div className="hidden w-full sm:w-[80%] sm:flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
                        <NavBar />
                    </div>
                    <DropDown />


                </div>
            </div>
        </header>
    )
}