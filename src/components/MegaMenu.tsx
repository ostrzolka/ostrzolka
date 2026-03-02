"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

interface MegaMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const MENU_ITEMS = [
    { title: "Nasz Cel", href: "/#mission", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" },
    { title: "Archiwum", href: "/explore", image: "https://images.unsplash.com/photo-1444858345149-8ff40887589b?q=80&w=1000&auto=format&fit=crop" },
    { title: "O nas", href: "/about", image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format&fit=crop" },
    { title: "Kontakt", href: "/#kontakt", image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop" },
];

export default function MegaMenu({ isOpen, setIsOpen }: MegaMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number>(0);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.classList.add('lenis-stopped');
        } else {
            document.body.style.overflow = "";
            document.documentElement.classList.remove('lenis-stopped');
        }

        return () => {
            document.body.style.overflow = "";
            document.documentElement.classList.remove('lenis-stopped');
        };
    }, [isOpen]);

    useGSAP(() => {
        gsap.set(".mega-menu-overlay", { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", display: "none" });
        gsap.set(".mega-menu-link-wrapper", { y: 100, opacity: 0 });
        gsap.set(".mega-menu-preview", { opacity: 0, scale: 0.95 });

        const tl = gsap.timeline({ paused: true });
        tlRef.current = tl;

        tl.to(".mega-menu-overlay", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            display: "flex",
            duration: 0.8,
            ease: "power4.inOut",
        })
            .to(".mega-menu-preview", {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.4")
            .to(".mega-menu-link-wrapper", {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "power4.out",
            }, "-=0.6");

    }, { scope: containerRef });

    useEffect(() => {
        if (tlRef.current) {
            if (isOpen) {
                tlRef.current.play();
            } else {
                tlRef.current.reverse();
            }
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative z-[60]">
            <div className="mega-menu-overlay fixed inset-0 bg-[#0a0a0a] text-white hidden flex-col md:flex-row pb-12 pt-32 px-6 md:px-12 lg:px-24">

                {/* Left Side: Navigation Links */}
                <div className="w-full md:w-1/2 flex flex-col justify-center h-full gap-4 md:gap-8 z-10 pl-4 md:pl-0">
                    <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-500 mb-4 opacity-70">
                        Nawigacja
                    </span>

                    {MENU_ITEMS.map((item, i) => (
                        <div key={item.title} className="overflow-hidden">
                            <div className="mega-menu-link-wrapper">
                                <Link
                                    href={item.href}
                                    className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none hover:text-neutral-400 transition-colors inline-block"
                                    onClick={() => setIsOpen(false)}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                >
                                    {item.title}
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Social links small */}
                    <div className="mt-12 md:mt-24 flex gap-8 text-xs uppercase tracking-widest text-neutral-400 font-medium">
                        <a href="#" className="hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all">Facebook</a>
                    </div>
                </div>

                {/* Right Side: Image Reveal Preview */}
                <div className="mega-menu-preview hidden md:flex w-1/2 h-full items-center justify-end relative pointer-events-none">
                    <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[2rem] overflow-hidden">
                        {/* Lo-fi grain overlay */}
                        <div className="absolute inset-0 lofi-grain opacity-40 mix-blend-screen z-10"></div>

                        {/* Selected Image */}
                        {MENU_ITEMS.map((item, i) => (
                            <img
                                key={item.title}
                                src={item.image}
                                alt={item.title}
                                className={`absolute inset-0 w-full h-full object-cover grayscale contrast-125 transition-opacity duration-700 ease-in-out ${i === hoveredIndex ? "opacity-100" : "opacity-0"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
