
interface FileInfoProps {
    fileSize: number | null
}
export default function FileInfo({ fileSize }: FileInfoProps) {

    return (
        <div className="space-y-3 pt-6 border-t border-gray-200">
            {fileSize &&
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Original:</span>
                    <span className="font-medium text-gray-800">{fileSize} KB</span>
                </div>}
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Compressed:</span>
                <span className="font-medium text-green-600">450 KB</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saved:</span>
                <span className="font-medium text-violet-600">82%</span>
            </div>
        </div>
    )
}