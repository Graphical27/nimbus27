"use client";

import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { contain } from "three/src/extras/TextureUtils.js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FadeInProps = {
  children: React.ReactNode;
  vars?: gsap.TweenVars;
  className?: string;
  start?: string;
  targetchildren?: boolean;
};

export function FadeIn({
  children,
  className,
  vars = {},
  start = "top 50%",
  targetchildren = false,
}: FadeInProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const target = targetchildren
      ? containerRef.current?.children
      : containerRef.current;
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-prefrence", () => {
      gsap.set(target, { opacity: 0, y: 60 });

      gsap.to(target, {
        duration: 0.8,
        opacity: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.2,
        ...vars,
        scrollTrigger: {
          trigger: containerRef.current,
          start,
        },
      });
    });
  });

  return (
    <div ref={containerRef} className={clsx(className)}>
      {children}
    </div>
  );
}
