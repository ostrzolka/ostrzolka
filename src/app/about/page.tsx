"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    // Force 3D hardware acceleration for all GSAP transforms globally to prevent lag
    gsap.config({ force3D: true });
}

export default function AboutPage() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. Hero Text Letter-by-Letter Pop-up
        gsap.fromTo(".hero-char",
            { yPercent: 100, autoAlpha: 0 },
            {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.05,
                scrollTrigger: {
                    trigger: ".hero-heading",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // 2. Horizontal Scroll Timeline
        const horizontalContainer = document.querySelector(".horizontal-scroll-container");
        if (horizontalContainer) {
            gsap.to(horizontalContainer, {
                x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-scroll-wrapper",
                    start: "top top",
                    end: () => `+=${horizontalContainer.scrollWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        }

        // 3. Dark Section Morph & Text Scrub Lightening
        const darkSectionTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".dark-section",
                start: "top 50%",
                end: "bottom center",
                scrub: true,
            }
        });

        // Morph wrapper to dark
        darkSectionTl.to(".about-page-wrapper", {
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            ease: "none",
            duration: 1
        });

        // Scrub text opacity
        gsap.to(".scrub-word", {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: ".scrub-text",
                start: "top 80%",
                end: "bottom 30%",
                scrub: 1,
            }
        });

        // Return to light mode after dark section ends
        ScrollTrigger.create({
            trigger: ".spring-gallery-section",
            start: "top 50%",
            onEnter: () => {
                gsap.to(".about-page-wrapper", {
                    backgroundColor: "#f3f4f6", // Match body bg
                    color: "#1a1a1a",
                    duration: 0.5,
                    overwrite: "auto"
                });
            },
            onLeaveBack: () => {
                gsap.to(".about-page-wrapper", {
                    backgroundColor: "#0a0a0a",
                    color: "#ffffff",
                    duration: 0.5,
                    overwrite: "auto"
                });
            }
        });

        // 4. Spring Box Gallery Entrance
        gsap.fromTo(".spring-card",
            { y: 150, opacity: 0, scale: 0.8, rotationZ: 5 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationZ: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: ".spring-gallery-section",
                    start: "top 70%"
                }
            }
        );

    }, { scope: container });

    const heroText = "O nas";
    const scrubText = "Tworzymy przestrzeń, w której historia staje się żywa, namacalna i dostępna dla każdego. Przeszłość miasta to nie tylko zakurzone archiwa, to tętniąca życiem opowieść o ludziach, miejscach i wydarzeniach, które ukształtowały naszą teraźniejszość.";

    // Split text helper to preserve spaces
    const renderHeroChars = (text: string) => {
        return text.split("").map((char, index) => (
            <span key={index} className="hero-char uppercase will-change-transform" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                {char === " " ? " " : char}
            </span>
        ));
    };

    return (
        <div ref={container} className="about-page-wrapper w-full h-full bg-[#f3f4f6] text-[#1a1a1a] transition-colors duration-200 overflow-hidden relative rounded-b-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-b border-black/5 z-10 will-change-[background-color]">
            {/* Global Texture Overlay - removed mix-blend-multiply for scroll performance */}
            <div className="absolute inset-0 lofi-grain z-0 pointer-events-none opacity-20"></div>

            {/* 1. Hero Section */}
            <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-32 px-6">
                <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400 mb-8 z-10">Poznaj Zespół</span>
                <h1 className="hero-heading font-serif text-[clamp(6rem,20vw,20rem)] leading-none tracking-tighter text-center overflow-hidden flex z-10">
                    {renderHeroChars(heroText)}
                </h1>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-10">
                    <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-black to-transparent"></div>
                </div>
            </section>

            {/* 2. Horizontal Scroll Timeline */}
            <section className="horizontal-scroll-wrapper relative z-10 flex h-screen w-full items-center bg-white border-y border-neutral-200 overflow-hidden">
                {/* Visual marker line */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-200 -translate-y-1/2 z-0 pointer-events-none"></div>

                <div className="horizontal-scroll-container flex h-full items-center pl-6 md:pl-24 pr-[50vw] will-change-transform">

                    {/* Panel 1 */}
                    <div className="flex-none w-[85vw] md:w-[60vw] h-[55vh] md:h-[65vh] mr-8 md:mr-16 bg-[#f8f9fa] rounded-[2rem] p-8 md:p-16 flex flex-col justify-center border border-neutral-200 shadow-sm relative overflow-hidden group hover:bg-white transition-colors duration-500">
                        <div className="absolute inset-0 lofi-grain opacity-20 pointer-events-none"></div>
                        <div className="relative z-10">
                            <span className="text-sm uppercase tracking-widest font-bold text-neutral-300 mb-6 block">Rozdział I / 2018</span>
                            <h2 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight group-hover:bg-[linear-gradient(90deg,rgba(237,27,36,1)_0%,rgba(0,85,150,1)_100%)] group-hover:text-transparent group-hover:bg-clip-text transition-all duration-500">
                                Początki Inicjatywy
                            </h2>
                            <p className="text-xl md:text-2xl text-neutral-500 font-light leading-relaxed max-w-2xl">Zrodzona z pasji małej grupy lokalnych historyków, Ostrzółka rozpoczęła się jako zbiór skanów trzymanych w piwnicach i starych serwerach miejskiej biblioteki.</p>
                        </div>
                    </div>

                    {/* Panel 2 */}
                    <div className="flex-none w-[85vw] md:w-[60vw] h-[55vh] md:h-[65vh] mr-8 md:mr-16 bg-[#f8f9fa] rounded-[2rem] p-8 md:p-16 flex flex-col justify-center border border-neutral-200 shadow-sm relative overflow-hidden group hover:bg-white transition-colors duration-500">
                        <div className="absolute inset-0 lofi-grain opacity-20 pointer-events-none"></div>
                        <div className="relative z-10">
                            <span className="text-sm uppercase tracking-widest font-bold text-neutral-300 mb-6 block">Rozdział II / 2021</span>
                            <h2 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight group-hover:bg-[linear-gradient(90deg,rgba(237,27,36,1)_0%,rgba(0,85,150,1)_100%)] group-hover:text-transparent group-hover:bg-clip-text transition-all duration-500">
                                Cyfryzacja Dziedzictwa
                            </h2>
                            <p className="text-xl md:text-2xl text-neutral-500 font-light leading-relaxed max-w-2xl">Kolejne lata przyniosły nieoczekiwane znaleziska. Zapomniane plany miasta z okresu międzywojennego, prywatne pamiętniki z lat 50. Postanowiliśmy to wszystko uratować.</p>
                        </div>
                    </div>

                    {/* Panel 3: Flashy transition panel */}
                    <div className="flex-none w-[85vw] md:w-[60vw] h-[55vh] md:h-[65vh] mr-12 bg-[#151515] text-white rounded-[2rem] p-8 md:p-16 flex flex-col justify-center shadow-2xl relative overflow-hidden group">
                        {/* Removed mix-blend-screen and massive blur filters to prevent layout thrashing on scroll */}
                        <div className="absolute inset-0 lofi-grain opacity-20 pointer-events-none z-10"></div>
                        <div className="absolute -inset-24 bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-full z-0"></div>
                        <div className="relative z-20">
                            <span className="text-sm uppercase tracking-widest font-bold text-neutral-500 mb-6 block">Rozdział III / Współczesność</span>
                            <h2 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(90deg,rgba(237,27,36,1)_0%,rgba(0,85,150,1)_100%)] transition-all duration-500">
                                Otwarte Archiwum
                            </h2>
                            <p className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-w-2xl">Oddajemy to bogactwo w ręce społeczności, głęboko wierząc, że swobodne rozumienie historii pozwala o wiele lepiej kształtować naszą wspólną przyszłość.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Dark Section with Flashing Text Scrub */}
            <section className="dark-section relative z-10 w-full min-h-[150vh] flex items-center justify-center py-48 px-6 md:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto w-full">
                    <p className="scrub-text font-serif text-3xl md:text-5xl lg:text-7xl leading-[1.3] tracking-tight">
                        {scrubText.split(" ").map((word, index) => {
                            // Flashy words highlighting
                            const isFlashy = ["żywa,", "namacalna", "tętniąca"].includes(word);

                            return (
                                <span key={index} className="inline-block mr-[0.25em] mb-4 md:mb-6">
                                    <span
                                        className={`scrub-word will-change-opacity opacity-20 ${isFlashy
                                            ? 'bg-[linear-gradient(90deg,rgba(237,27,36,1)_0%,rgba(0,85,150,1)_100%)] bg-clip-text text-transparent font-medium drop-shadow-sm'
                                            : 'text-inherit transition-colors duration-300'
                                            }`}
                                    >
                                        {word}
                                    </span>
                                </span>
                            );
                        })}
                    </p>
                </div>
            </section>

            {/* 4. Spring Gallery Section */}
            {/* Added translate-z-0 to force hardware acceleration on the container */}
            <section className="spring-gallery-section relative z-10 w-full min-h-screen py-32 px-6 translate-z-0">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-24 text-center">
                        <h2 className="font-serif text-5xl md:text-7xl tracking-tight text-[#1a1a1a] mb-6">Nasze Wartości</h2>
                        <p className="text-neutral-500 font-light text-xl md:text-2xl max-w-2xl mx-auto">To, co kieruje naszymi decyzjami w cyfryzacji i dystrybucji wiedzy miejskiej.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Spring Card 1 */}
                        <div className="spring-card will-change-transform bg-white rounded-[2rem] p-10 shadow-sm border border-neutral-100 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center font-serif text-2xl group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors duration-300">01</div>
                            <h3 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] tracking-tight">Otwartość</h3>
                            <p className="text-neutral-500 leading-relaxed font-light text-lg">Wierzymy, że historia należy do wszystkich. Udostępniamy nasze zasoby w najwyższej możliwej jakości bez absolutnie żadnych barier czy paywalli.</p>
                        </div>

                        {/* Spring Card 2 - Highlighted */}
                        {/* Removed massive absolute blur pseudo background for performance */}
                        <div className="spring-card will-change-transform bg-[#1a1a1a] text-white rounded-[2rem] p-10 shadow-md border border-neutral-800 flex flex-col gap-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 lofi-grain opacity-20 pointer-events-none z-0"></div>

                            <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center font-serif text-2xl relative z-10 group-hover:bg-white group-hover:text-[#1a1a1a] transition-colors duration-300">02</div>
                            <h3 className="font-serif text-3xl md:text-4xl tracking-tight relative z-10">Rzetelność</h3>
                            <p className="text-neutral-300 leading-relaxed font-light text-lg relative z-10">Każdy skan i dokument poddawany jest ścisłej weryfikacji historycznej. Prawda o przeszłości jest naszym bezkompromisowym fundamentem.</p>
                        </div>

                        {/* Spring Card 3 */}
                        <div className="spring-card will-change-transform bg-white rounded-[2rem] p-10 shadow-sm border border-neutral-100 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center font-serif text-2xl group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors duration-300">03</div>
                            <h3 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] tracking-tight">Społeczność</h3>
                            <p className="text-neutral-500 leading-relaxed font-light text-lg">Ostrzółka to nie tylko sucha baza danych. To dynamiczna platforma zrzeszająca wszystkich ludzi ciekawych tego, co działo się tutaj na długo przed nami.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
