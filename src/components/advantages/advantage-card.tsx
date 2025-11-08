import { IAdvantage } from "./advantage"
export default function AdvantageCard({ title, description, svg }: IAdvantage) {

    return (
        <div className="bg-white dark:bg-[#1a1229] rounded-xl p-6 border border-purple-100 dark:border-[#2d2142]">
            <div className="bg-violet-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                {svg}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-[#8b7fb8] mb-1">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-[#b4a7d6]">
                {description}
            </p>
        </div>
    )
} 