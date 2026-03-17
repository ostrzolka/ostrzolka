"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
    fallbackHref?: string;
    label?: string;
    className?: string;
}

export default function BackButton({
    fallbackHref = "/explore",
    label = "Wróć do wyników",
    className = "inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#1a1a1a] transition-colors font-medium",
}: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    };

    return (
        <button onClick={handleBack} className={className}>
            <ChevronLeft className="w-4 h-4" />
            {label}
        </button>
    );
}
