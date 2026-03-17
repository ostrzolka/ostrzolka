import HeroRevealCurtain from "@/components/HeroRevealCurtain";
export default function ExploreLoading() {
    return (
        <div className="relative">
            <HeroRevealCurtain />

            <div className="min-h-screen bg-[#f3f4f6] pt-32 pb-24 px-6 relative">
                <div className="absolute inset-0 lofi-grain z-0 pointer-events-none opacity-50" />

                <div className="max-w-4xl mx-auto relative z-10 w-full">

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-[#1a1a1a] mb-4">
                            Wyszukiwarka <span className="italic font-light text-neutral-500">Ostrzółka</span>
                        </h1>
                        <p className="text-sm text-neutral-500 max-w-lg leading-relaxed font-light">
                            Przeszukaj naszą bazę coś tam ten.
                        </p>
                    </div>

                    {/* Search & Filter Bar — static placeholders */}
                    <div className="flex flex-col md:flex-row gap-4 mb-12">
                        <div className="flex-1 skeleton h-14 rounded-full" />
                        <div className="shrink-0 skeleton h-14 w-48 rounded-full" />
                    </div>

                    {/* Card Skeletons */}
                    <div className="flex flex-col gap-6 mb-16">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm"
                                style={{ opacity: 1 - i * 0.12 }}
                            >
                                <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4 mb-4">
                                    <div className="flex flex-col gap-2 flex-1">
                                        {/* Address heading */}
                                        <div className="skeleton h-7 w-48 md:w-72" />
                                        {/* Optional name */}
                                        <div className="skeleton h-4 w-32" />
                                    </div>
                                    {/* Year badge */}
                                    <div className="skeleton h-6 w-14 rounded-full" />
                                </div>
                                {/* Description lines */}
                                <div className="flex flex-col gap-2 mb-8">
                                    <div className="skeleton h-4 w-full max-w-xl" />
                                    <div className="skeleton h-4 w-3/4 max-w-md" />
                                </div>
                                {/* Tags */}
                                <div className="flex gap-2">
                                    <div className="skeleton h-5 w-20 rounded-full" />
                                    <div className="skeleton h-5 w-16 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

