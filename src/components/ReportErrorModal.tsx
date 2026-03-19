"use client";

import { useState } from "react";
import { Flag, X, Loader2, CheckCircle2 } from "lucide-react";
import { reportError } from "@/app/actions/reportError";

interface ReportErrorModalProps {
    objectId: string;
    objectType: "address" | "person" | "organisation";
    objectName: string;
}

export default function ReportErrorModal({ objectId, objectType, objectName }: ReportErrorModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleOpen = () => {
        setIsOpen(true);
        setIsSuccess(false);
        setErrorMsg("");
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setIsOpen(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        formData.append("objectId", objectId);
        formData.append("objectType", objectType);
        formData.append("objectName", objectName);

        const result = await reportError(formData);

        if (result.success) {
            setIsSuccess(true);
        } else {
            setErrorMsg(result.error || "Wystąpił nieoczekiwany błąd.");
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-red-600 transition-colors font-medium border border-transparent hover:border-red-100 hover:bg-red-50 px-4 py-2 rounded-full self-start"
            >
                <Flag className="w-4 h-4" />
                <span>Zgłoś błąd</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm transition-opacity"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-xl border border-neutral-100 flex flex-col transform transition-all">
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-[#1a1a1a] transition-colors"
                            disabled={isSubmitting}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-2xl text-[#1a1a1a]">Dziękujemy!</h3>
                                <p className="text-neutral-500 font-light text-sm">
                                    Twoje zgłoszenie zostało wysłane i oczekuje na weryfikację.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="mt-6 px-6 py-3 bg-[#1a1a1a] text-[#f3efe6] rounded-full text-sm font-semibold tracking-wide hover:bg-neutral-800 transition-colors w-full"
                                >
                                    Zamknij
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] tracking-widest font-bold uppercase mb-4">
                                        Zgłoszenie błędu
                                    </span>
                                    <h3 className="font-serif text-2xl tracking-tight text-[#1a1a1a] mb-2">
                                        Coś się nie zgadza?
                                    </h3>
                                    <p className="text-neutral-500 font-light text-sm">
                                        Opisz problem z wpisem <strong className="font-medium text-[#1a1a1a]">{objectName}</strong>. Poprawimy to najszybciej jak to możliwe.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="message" className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
                                            Twój komentarz
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            required
                                            disabled={isSubmitting}
                                            placeholder="Na przykład: Literówka w nazwisku, nieprawidłowa data, złe zdjęcie..."
                                            className="w-full rounded-2xl border border-neutral-200 p-4 text-sm text-[#1a1a1a] bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all disabled:opacity-50 resize-none font-light placeholder:text-neutral-400"
                                        />
                                    </div>

                                    {errorMsg && (
                                        <div className="text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            disabled={isSubmitting}
                                            className="px-6 py-3 border border-neutral-200 rounded-full text-sm font-medium text-neutral-600 hover:text-[#1a1a1a] hover:bg-neutral-50 transition-colors flex-1"
                                        >
                                            Anuluj
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-3 bg-[#1a1a1a] text-[#f3efe6] rounded-full text-sm font-semibold tracking-wide hover:bg-neutral-800 transition-colors flex-1 flex items-center justify-center h-[46px]"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                "Wyślij"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
