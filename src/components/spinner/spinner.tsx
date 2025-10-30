import styles from "./spinner.module.css"

interface SpinnerProps {
    size?: number;     // سایز اسپینر (بر حسب px)
    color?: string;    // رنگ اسپینر
    className?: string; // برای اضافه کردن کلاس دلخواه
}

export default function Spinner({ className, size, color }: SpinnerProps) {

    return (
        <span
            className={`${styles.myloader} ${className} `}
            style={{
                fontSize: `${size}px`,
                color,
            }}
        ></span>
    )
}