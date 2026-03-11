"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AddressCard } from "@/lib/addresses";

interface ExploreClientProps {
    addresses: AddressCard[];
    total: number;
    currentPage: number;
    perPage: number;
    searchQuery: string;
}

const COLLECTIONS = ["Wszystkie typy", "Kamienica", "Kościół", "Budynek publiczny", "Pomnik", "Inne"];
const PER_PAGE_OPTIONS = [10, 25, 50];

export default function ExploreClient({
    addresses,
    total,
    currentPage,
    perPage,
    searchQuery,
}: ExploreClientProps) {
    const router = useRouter();


    const [inputValue, setInputValue] = useState(searchQuery);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [perPageOpen, setPerPageOpen] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { setInputValue(searchQuery); }, [searchQuery]);

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    const buildUrl = (params: { q?: string; page?: number; per?: number }) => {
        const sp = new URLSearchParams();
        const q = params.q ?? searchQuery;
        const page = params.page ?? currentPage;
        const per = params.per ?? perPage;
        if (q) sp.set("q", q);
        if (page > 1) sp.set("page", String(page));
        if (per !== 25) sp.set("per", String(per));
        const qs = sp.toString();
        return qs ? `/explore?${qs}` : "/explore";
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setInputValue(q);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.replace(buildUrl({ q, page: 1 }), { scroll: false });
        }, 400);
    };

    const handlePageChange = (page: number) => {
        router.replace(buildUrl({ page }), { scroll: true });
    };

    const handlePerPageChange = (per: number) => {
        setPerPageOpen(false);
        router.replace(buildUrl({ per, page: 1 }), { scroll: false });
    };

    return (
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

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Wpisz nazwę lub opis obiektu…"
                            value={inputValue}
                            onChange={handleSearchChange}
                            className="w-full bg-white border border-neutral-200 rounded-full pl-12 pr-6 py-4 text-sm outline-none focus:border-[#1a1a1a] transition-colors shadow-sm text-[#1a1a1a]"
                        />
                    </div>

                    <div className="relative shrink-0">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full md:w-auto flex items-center justify-between gap-3 bg-white border border-neutral-200 rounded-full px-6 py-4 text-sm hover:border-[#1a1a1a] transition-colors shadow-sm text-[#1a1a1a]"
                        >
                            <span className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-neutral-400" />
                                Wszystkie typy
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", dropdownOpen && "rotate-180")} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute top-full left-0 right-0 md:right-auto md:w-56 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden z-20">
                                {COLLECTIONS.map(col => (
                                    <button
                                        key={col}
                                        onClick={() => setDropdownOpen(false)}
                                        className="w-full text-left px-6 py-3 text-sm text-[#1a1a1a] hover:bg-neutral-50 transition-colors first:pt-4 last:pb-4"
                                    >
                                        {col}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Document List */}
                <div className="flex flex-col gap-6 mb-16">
                    {addresses.length === 0 ? (
                        <div className="text-center py-24 text-neutral-400 font-serif italic text-lg">
                            Brak wyników dla podanych kryteriów.
                        </div>
                    ) : (
                        addresses.map((doc) => (
                            <Link
                                key={doc.id}
                                href={`/explore/${doc.id}`}
                                className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-100 flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 lofi-grain opacity-20 pointer-events-none z-0" />
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4 mb-4">
                                        <div className="flex flex-col">
                                            <h2 className="font-serif text-2xl text-[#1a1a1a] tracking-tight group-hover:text-neutral-600 transition-colors">
                                                {doc.addressLabel}
                                            </h2>
                                            {doc.name && (
                                                <span className="text-sm font-medium text-neutral-400 mt-1">{doc.name}</span>
                                            )}
                                        </div>
                                        {doc.year && (
                                            <span className="shrink-0 text-xs font-medium text-neutral-400 border border-neutral-200 rounded-full px-3 py-1">
                                                {doc.year}
                                            </span>
                                        )}
                                    </div>
                                    {doc.description && (
                                        <p className="text-sm text-neutral-500 leading-relaxed font-light mb-4 max-w-2xl line-clamp-2">
                                            {doc.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Pagination & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-neutral-200 pt-8 mt-8">

                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                        <span>{total.toLocaleString("pl")} wyników</span>
                        <span>·</span>
                        <div className="relative">
                            <button
                                onClick={() => setPerPageOpen(!perPageOpen)}
                                className="flex items-center gap-2 text-neutral-500 hover:text-[#1a1a1a] transition-colors"
                            >
                                <span>{perPage} na stronę</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {perPageOpen && (
                                <div className="absolute bottom-full left-0 mb-2 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden min-w-[120px] z-20">
                                    {PER_PAGE_OPTIONS.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handlePerPageChange(opt)}
                                            className="w-full text-left px-4 py-3 text-sm text-[#1a1a1a] hover:bg-neutral-50 transition-colors"
                                        >
                                            {opt} na stronę
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-300 text-neutral-400 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-sm">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .map((p, idx, arr) => (
                                    <React.Fragment key={p}>
                                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                                            <span className="text-neutral-400 text-xs">…</span>
                                        )}
                                        <button
                                            onClick={() => handlePageChange(p)}
                                            className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-full font-medium transition-colors",
                                                currentPage === p
                                                    ? "bg-[#1a1a1a] text-white"
                                                    : "text-neutral-500 hover:text-[#1a1a1a]"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    </React.Fragment>
                                ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-300 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
