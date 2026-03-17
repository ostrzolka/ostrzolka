import { getOrganisationById } from "@/lib/entities";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import { Building2 } from "lucide-react";

export default async function OrganisationDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const org = await getOrganisationById(id);

    if (!org) {
        notFound();
    }

    const orgName = org.name || "Organizacja nieznana";

    return (
        <div className="min-h-screen bg-[#f3f4f6] pt-32 pb-24 px-6 relative">
            <div className="absolute inset-0 lofi-grain z-0 pointer-events-none opacity-50"></div>

            <div className="max-w-5xl mx-auto relative z-10 w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-neutral-100 flex flex-col mt-8">

                {/* Back Button */}
                <BackButton className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#1a1a1a] transition-colors self-start mb-8 font-medium" />

                {/* Top Section: Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">

                    {/* Left: Metadata */}
                    <div className="flex flex-col">
                        <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 self-start">
                            Organizacja
                        </div>
                        <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-[#1a1a1a] mb-8 leading-tight">
                            {orgName}
                        </h1>

                        <div className="flex flex-col gap-4">
                            {org.creationDate && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Data powstania</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{org.creationDate}</span>
                                </div>
                            )}
                            {org.dissolutionDate && (
                                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Data rozwiązania</span>
                                    <span className="text-sm font-semibold text-[#1a1a1a]">{org.dissolutionDate}</span>
                                </div>
                            )}
                            {org.nameVariants && org.nameVariants.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2 border-b border-neutral-100 pb-3">
                                    <span className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Inne nazwy</span>
                                    <div className="flex flex-wrap gap-2">
                                        {org.nameVariants.map(variant => (
                                            <span key={variant} className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-[11px] font-medium">
                                                {variant}
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
                        <Building2 className="w-32 h-32 text-neutral-300 relative z-10 transition-transform duration-700 group-hover:scale-110" strokeWidth={1} />
                        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400 font-medium uppercase tracking-widest z-10 leading-none text-center">
                            Brak logo /<br />zdjęcia
                        </span>
                    </div>
                </div>

                {/* Bottom Section: Bibliography */}
                <div className="border-t border-neutral-200 pt-12 mb-16">
                    <h3 className="text-sm text-neutral-400 font-medium uppercase tracking-widest mb-6">Wpisy Bibliograficzne</h3>

                    <div className="flex flex-col gap-4">
                        {org.bibliography.length > 0 ? (
                            org.bibliography.map((bib) => {
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
