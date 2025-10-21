
import CrossSquareIcon from "../icons/cross";
import DoneIcon from "../icons/done";

interface ImageRemovePopUpProps {
    accept: () => void;
    reject: () => void
}

export default function ImageRemovePopUp({ accept, reject }: ImageRemovePopUpProps) {

    return (
        <div className="w-[100vw] h-[100v] bg-black/30 fixed z-40 inset-0">
            <div className="w-[max(30vw,_30vh)] flex flex-col justify-center items-center font-bold bg-white text-neutral-700 z-20 shadow-2xl px-2 sm:px-0 py-6 rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 ">
                <span className="w-full text-center">are you sure?</span>
                <div className="w-full flex justify-evenly items-center mt-4">
                    <span onClick={() => reject()}><CrossSquareIcon className="h-9 w-9 text-red-500 cursor-pointer" /></span>
                    <span onClick={() => accept()}><DoneIcon className="h-8 w-9 text-green-500 cursor-pointer" /></span>
                </div>
            </div>
        </div>
    )
}