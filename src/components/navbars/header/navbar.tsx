
export default function NavBar() {

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                <span>aaaabnnbaa</span>
                <span>bbb55bbb</span>
                <span>cccccc</span>
                <span>ddddmbvnvdd</span>
            </div>
            <div className="w-full sm:w-[25%] justify-center flex gap-3">
                <button className="w-[45%]  sm:w-[max(45%,_80px)] bg-white text-center border border-neutral-300 rounded-lg px-2.5 py-1">logIn</button>
                <button className="w-[45%]  sm:w-[max(45%,_80px)] bg-blue-500 text-center text-white rounded-lg px-2.5 py-1">sinUp</button>
            </div>
        </>
    )
}