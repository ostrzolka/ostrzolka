"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function CustomCursor({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isTouch = window.matchMedia("(pointer: coarse)").matches;

        if (prefersReduced || isTouch) {
            document.body.classList.remove("cursor-on");
            return;
        }

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener("resize", setSize);

        const state = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            tx: window.innerWidth / 2,
            ty: window.innerHeight / 2,
        };

        const handlePointerMove = (e: PointerEvent) => {
            state.tx = e.clientX;
            state.ty = e.clientY;
        };
        window.addEventListener("pointermove", handlePointerMove);

        let animationFrameId: number;

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const tick = () => {
            state.x = lerp(state.x, state.tx, 0.2);
            state.y = lerp(state.y, state.ty, 0.2);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(state.x, state.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            // Outer ring
            ctx.beginPath();
            ctx.arc(state.x, state.y, 24, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.stroke();

            animationFrameId = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            window.removeEventListener("resize", setSize);
            window.removeEventListener("pointermove", handlePointerMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={cn("fixed inset-0 pointer-events-none z-[9999] mix-blend-difference", className)}
        />
    );
}
