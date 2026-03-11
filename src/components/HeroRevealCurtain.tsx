"use client";

import { useEffect, useState } from "react";

export default function HeroRevealCurtain() {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("hero-transition") === "1") {
            sessionStorage.removeItem("hero-transition");
            setActive(true);
        }
    }, []);

    if (!active) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] animate-curtain-down pointer-events-none"
            style={{ background: "#1a1a1a" }}
        />
    );
}
