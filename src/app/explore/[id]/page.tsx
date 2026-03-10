import { getAddressById } from "@/lib/addresses";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DocumentDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const address = await getAddressById(id);

    if (!address) {
        notFound();
    }

    const hasCoords = address.latitude !== null && address.longitude !== null;
    const osmUrl = hasCoords
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${address.longitude! - 0.003},${address.latitude! - 0.002},${address.longitude! + 0.003},${address.latitude! + 0.002}&layer=mapnik&marker=${address.latitude},${address.longitude}`
        : null;

    return (
        <div className="min-h-screen bg-[#f3f4f6] pt-32 pb-24 px-6 relative">
            <div className="absolute inset-0 lofi-grain z-0 pointer-events-none opacity-50"></div>

            <div className="max-w-5xl mx-auto relative z-10 w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-neutral-100 flex flex-col mt-8">

                {/* Back Button */}
                <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#1a1a1a] transition-colors self-start mb-8 font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    Wróć do wyników
                </Link>

                {/* Top Section: Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">

                    {/* Left: Metadata */}
                    <div className="flex flex-col">
                        <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-[#1a1a1a] mb-2 leading-tight">
                            {address.addressLabel}
                        </h1>
                        {address.name && (
                            <h2 className="text-xl text-neutral-500 font-serif italic mb-8">
                                &quot;{address.name}&quot;
                            </h2>
                        )}
                        {!address.name && <div className="mb-8"></div>}

                        <div className="flex flex-col gap-4">
                            {address.constructionEnd && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Rok Budowy</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{address.constructionEnd}</span>
                                </div>
                            )}
                            {address.constructionStart && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Początek Budowy</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{address.constructionStart}</span>
                                </div>
                            )}
                            {address.buildingType && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Typ Budynku</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{address.buildingType}</span>
                                </div>
                            )}
                            {address.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {address.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-block px-3 py-1 bg-[#1a1a1a] text-[#f3efe6] rounded-full text-[10px] tracking-widest font-bold uppercase"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Map */}
                    <div className="w-full aspect-[4/3] lg:aspect-square rounded-[1.5rem] relative overflow-hidden">
                        {osmUrl ? (
                            <iframe
                                src={osmUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, display: "block" }}
                                title={`Mapa lokalizacji: ${address.addressLabel}`}
                                loading="lazy"
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-200 lofi-grain grayscale opacity-80 flex items-center justify-center">
                                <div className="absolute inset-0 bg-neutral-300/50 mix-blend-multiply"></div>
                                <span className="relative z-10 text-neutral-500 font-serif italic text-lg opacity-60 flex flex-col items-center">
                                    <span className="w-2 h-2 rounded-full bg-neutral-400 mb-2"></span>
                                    Brak danych lokalizacji
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle Section: Description */}
                {address.description && (
                    <div className="border-t border-neutral-200 pt-12 mb-12">
                        <h3 className="text-sm text-neutral-400 font-medium uppercase tracking-widest mb-6">Opis Obiektu</h3>
                        <p className="text-neutral-600 leading-relaxed font-light text-lg max-w-3xl whitespace-pre-line">
                            {address.description}
                        </p>
                    </div>
                )}

                {/* Bottom Section: Bibliography */}
                <div className="border-t border-neutral-200 pt-12 mb-16">
                    <h3 className="text-sm text-neutral-400 font-medium uppercase tracking-widest mb-6">Wpisy Bibliograficzne</h3>

                    <div className="flex flex-col gap-4">
                        {address.bibliography.length > 0 ? (
                            address.bibliography.map((bib) => {
                                const sourceLabel = [bib.title, bib.authors, bib.year, bib.publisher]
                                    .filter(Boolean)
                                    .join(", ");
                                const entryDetail = bib.entryDescription || bib.entryScope || null;

                                return (
                                    <div
                                        key={`${bib.sourceId}-${bib.entryId}`}
                                        className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-baseline gap-2 pb-4 border-b border-neutral-100 last:border-0 last:pb-0"
                                    >
                                        <span className="text-sm font-medium text-[#1a1a1a] flex-1">
                                            {sourceLabel || "Nieznane źródło"}
                                        </span>
                                        {entryDetail && (
                                            <span className="text-xs text-neutral-500 sm:text-right font-light italic max-w-xs">
                                                {entryDetail}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <span className="text-sm text-neutral-400 italic">Brak wpisów bibliograficznych.</span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-start border-t border-neutral-200 pt-8 mt-auto">
                    <Link
                        href="/explore"
                        className="px-6 py-3 border border-neutral-300 rounded-full text-sm font-medium text-neutral-500 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all flex items-center gap-2"
                    >
                        ← Wróć do wyników
                    </Link>
                </div>

            </div>
        </div>
    );
}
