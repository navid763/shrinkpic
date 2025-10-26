
export default function ImagePlaceholderIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className || "w-24 h-24 mx-auto mb-4 opacity-50"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    )
}