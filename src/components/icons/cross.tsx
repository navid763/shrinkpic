export default function CrossSquareIcon({ className = "w-6 h-6 text-black" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={className}
        >
            <path d="M20.95 19.54c.39.39.39 1.02 0 1.41-.391.39-1.024.39-1.414 0L16 17.41l-3.536 3.54c-.39.39-1.023.39-1.414 0-.39-.39-.39-1.02 0-1.41L14.586 16l-3.536-3.54c-.39-.39-.39-1.02 0-1.41.391-.39 1.024-.39 1.414 0L16 14.59l3.536-3.54c.391-.39 1.024-.39 1.414 0 .39.39.39 1.02 0 1.41L17.414 16l3.536 3.54zM26 6H6C4.343 6 3 7.343 3 9v14c0 1.657 1.343 3 3 3h20c1.657 0 3-1.343 3-3V9c0-1.657-1.343-3-3-3z" />
        </svg>
    );
}
