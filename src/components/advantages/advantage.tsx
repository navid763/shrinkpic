import { ReactElement } from "react";
import AdvantageCard from "./advantage-card"
export interface IAdvantage {
    title: string;
    description: string;
    svg: ReactElement
}
const advantages = [
    {
        title: "Adjust Quality",
        description: "Control compression level to balance quality and file size",
        svg: <svg
            className="w-5 h-5 text-violet-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <circle cx={12} cy={12} r={3} />
            <path d="M12 1v6m0 6v6m-6-6h6m6 0h6" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>

    },
    {
        title: "Resize Images",
        description: "Change dimensions while maintaining aspect ratio",
        svg: <svg
            className="w-5 h-5 text-fuchsia-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>

    },
    {
        title: "Instant Download",
        description: "Get your optimized image ready in seconds",
        svg: <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
        </svg>

    }
]
export default function Advantages() {

    return (
        <div className="grid sm:grid-cols-3 gap-4 mt-8 ">
            {advantages.map((item: IAdvantage, i) => {
                return <AdvantageCard title={item.title} description={item.description} svg={item.svg} key={i} />
            })}
        </div>
    )
}