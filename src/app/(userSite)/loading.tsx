import { LoaderCircleIcon } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="w-full flex items-center justify-center flex-1">
            <LoaderCircleIcon size={48} className="animate-spin" />
        </div>
    )
}
