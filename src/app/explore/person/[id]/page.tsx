import { getPersonById } from "@/lib/entities";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import ReportErrorModal from "@/components/ReportErrorModal";
import { User } from "lucide-react";

export default async function PersonDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const person = await getPersonById(id);

    if (!person) {
        notFound();
    }

    const fullName = [person.name, person.surname].filter(Boolean).join(" ") || "Osoba nieznana";

    return (
        <div className="min-h-screen bg-[#f3f4f6] pt-32 pb-24 px-6 relative">
            <div className="absolute inset-0 lofi-grain z-0 pointer-events-none opacity-50"></div>

            <div className="max-w-5xl mx-auto relative z-10 w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-neutral-100 flex flex-col mt-8">

                {/* Top Actions */}
                <div className="flex justify-between items-start w-full mb-8">
                    <BackButton className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#1a1a1a] transition-colors font-medium" />
                    <ReportErrorModal objectId={id} objectType="person" objectName={fullName} />
                </div>

                {/* Top Section: Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">

                    {/* Left: Metadata */}
                    <div className="flex flex-col">
                        <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 self-start">
                            Osoba
                        </div>
                        <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-[#1a1a1a] mb-8 leading-tight">
                            {fullName}
                        </h1>

                        <div className="flex flex-col gap-4">
                            {person.birthDate && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Data urodzenia</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{person.birthDate}</span>
                                </div>
                            )}
                            {person.birthPlace && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Miejsce urodzenia</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{person.birthPlace}</span>
                                </div>
                            )}
                            {person.deathDate && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Data śmierci</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{person.deathDate}</span>
                                </div>
                            )}
                            {person.deathPlace && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Miejsce śmierci</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{person.deathPlace}</span>
                                </div>
                            )}
                            {person.occupations && person.occupations.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2 border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Zawody</span>
                                    <div className="flex flex-wrap gap-2">
                                        {person.occupations.map(occ => (
                                            <span key={occ} className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-[11px] font-medium">
                                                {occ}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {person.denominations && person.denominations.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2 border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Wyznanie</span>
                                    <div className="flex flex-wrap gap-2">
                                        {person.denominations.map(den => (
                                            <span key={den} className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-[11px] font-medium">
                                                {den}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Avatar Placeholder */}
                    <div className="w-full aspect-square rounded-[2rem] bg-neutral-100 flex items-center justify-center relative overflow-hidden border border-neutral-200/50 group">
                        <div className="absolute inset-0 lofi-grain grayscale opacity-40 mix-blend-multiply"></div>
                        <User className="w-32 h-32 text-neutral-300 relative z-10 transition-transform duration-700 group-hover:scale-110" strokeWidth={1} />
                        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400 font-medium uppercase tracking-widest z-10">
                            Brak zdjęcia
                        </span>
                    </div>
                </div>

                {/* Middle Section: Summary */}
                {person.summary && (
                    <div className="border-t border-neutral-200 pt-12 mb-12">
                        <h3 className="text-sm text-neutral-400 font-medium uppercase tracking-widest mb-6">Biogram</h3>
                        <p className="text-neutral-600 leading-relaxed font-light text-lg max-w-3xl whitespace-pre-line">
                            {person.summary}
                        </p>
                    </div>
                )}

                {/* Bottom Section: Bibliography */}
                <div className="border-t border-neutral-200 pt-12 mb-16">
                    <h3 className="text-sm text-neutral-400 font-medium uppercase tracking-widest mb-6">Wpisy Bibliograficzne</h3>

                    <div className="flex flex-col gap-4">
                        {person.bibliography.length > 0 ? (
                            person.bibliography.map((bib) => {
                                const sourceLine = [bib.title, bib.authors, bib.year]
                                    .filter(Boolean)
                                    .join(", ");

                                return (
                                    <div
                                        key={`${bib.sourceId}-${bib.entryId}`}
                                        className="flex flex-col gap-1 pb-4 border-b border-neutral-100 last:border-0 last:pb-0"
                                    >
                                        {/* Primary: entry description */}
                                        <span className="text-sm font-medium text-[#1a1a1a]">
                                            {bib.entryDescription}
                                        </span>

                                        {/* Secondary: source citation */}
                                        {sourceLine && (
                                            <span className="text-xs text-neutral-400 font-light italic">
                                                {sourceLine}
                                            </span>
                                        )}

                                        {/* Tertiary: who entered the data */}
                                        {bib.entryCreator && (
                                            <span className="text-xs text-neutral-400 font-light">
                                                Dodane przez: {bib.entryCreator}
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

            </div>
        </div>
    );
}
