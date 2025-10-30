
interface FileInfoProps {
    originalSize: number;
    compressedSize: number;
    savedPercentage: number
}
export default function FileInfo({ originalSize, compressedSize, savedPercentage }: FileInfoProps) {

    return (
        <div className="space-y-3 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original:</span>
                <span className="font-medium text-gray-800">{originalSize} KB</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Compressed:</span>
                <span className="font-medium text-green-600">{compressedSize} KB</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saved:</span>
                <span className="font-medium text-violet-600">{savedPercentage}%</span>
            </div>
        </div>
    )
}