import { motion } from "motion/react"
import CrossSquareIcon from "../icons/cross";
import DoneIcon from "../icons/done";

interface ImageRemovePopUpProps {
    accept: () => void;
    reject: () => void
}

export default function ImageRemovePopUp({ accept, reject }: ImageRemovePopUpProps) {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            className="w-[100vw] h-[100vh] bg-black/60 fixed inset-0 z-40"
        >
            <div className="w-[max(35vw,_35vh)] flex flex-col justify-center items-center font-bold bg-white text-neutral-700 z-20 shadow-2xl px-2 sm:px-0 py-6 rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 ">
                <span className="w-full text-center sm:text-lg">Delete all images?</span>
                <div className="w-full flex justify-evenly items-center mt-4">
                    <span onClick={() => reject()}><CrossSquareIcon className="h-9 w-9 text-red-500 cursor-pointer" /></span>
                    <span onClick={() => accept()}><DoneIcon className="h-8 w-9 text-green-500 cursor-pointer" /></span>
                </div>
            </div>
        </motion.div>
    )
}