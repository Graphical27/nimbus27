"use client";
import { FC, useRef } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import "@/app/globals.css";
import { Bounded } from "@/components/Bounded";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  // 1. Create a ref for scoping
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Safe check if element exists
        const headingElement =
          container.current?.querySelector(".hero-heading");
        if (!headingElement) return;

        const split = new SplitText(headingElement, {
          type: "lines,chars", // Added chars here specifically
          linesClass: "line++",
        });

        // 2. Adjust timeline
        const tl = gsap.timeline({
          // The delay matches the Scene.tsx animation duration approx
          delay: 4.2,
        });

        tl.from(split.chars, {
          opacity: 0,
          y: -120,
          ease: "back.out(1.7)", // slightly smoother back ease
          duration: 1, // Increased slightly for visibility
          stagger: 0.05,
        }).to(".hero-body", {
          opacity: 1,
          y: 0, // Ensure it moves to natural position
          duration: 1,
          ease: "power2.out",
        });

        gsap.fromTo(
          ".hero-scene",
          {
            background:
              "linear-gradient(to bottom, #000000, #0f172a, #062f4a, #7fa0b9)",
          },
          {
            background:
              "linear-gradient(to bottom, #ffffff, #ffffff, #ffffff, #ffffff)",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "50% bottom",
              scrub: 1,
            },
          },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-heading", { opacity: 1 });
        gsap.set(".hero-body", { opacity: 1 });
      });
    },
    { scope: container }, // Scope selectors to this component
  );

  return (
    <section
      ref={container}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero relative h-dvh text-white text-shadow-black/30 text-shadow-lg motion-safe:h-[300vh]"
    >
      <div className="hero-scene pointer-events-none sticky top-0 z-0 h-dvh w-full">
        <Canvas shadows="soft" dpr={[1, 2]}>
          <Scene />
        </Canvas>
      </div>

      <div className="here-content absolute inset-x-0 top-0 z-10 grid h-dvh grid-cols-1">
        {/* FIX 1: Removed 'opacity-0' from this Bounded. 
           GSAP .from() will handle the initial hidden state of the characters.
           */}
        <Bounded
          fullWidth
          className="absolute inset-x-0 top-18 md:top-24 md:left-[8vw]"
        >
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading1: ({ children }) => (
                <h1 className="hero-heading font-black-slanted text-6xl leading-[0.8] uppercase sm:text-7xl lg:text-8xl">
                  {children}
                </h1>
              ),
            }}
          />
        </Bounded>

        {/* FIX 2: Added 'opacity-0' here.
           Ideally, we also translate it down slightly (translate-y-4) so GSAP can animate it up.
        */}
        <Bounded
          fullWidth
          className="hero-body absolute inset-x-0 bottom-9 translate-y-4 opacity-0 md:right-[8vw] md:left-auto"
          innerClassName="flex flex-col gap-3 "
        >
          <div className="max-w-md">
            <PrismicRichText
              field={slice.primary.body}
              components={{
                heading2: ({ children }) => (
                  <h2 className="font-bold-slanted mb-1 text-4xl uppercase lg:mb-2 lg:text-6xl">
                    {children}
                  </h2>
                ),
              }}
            />
          </div>
          <button className="font-bold-slanted group flex w-fit cursor-pointer items-center gap-1 rounded bg-[#01A7E1] px-3 py-1 text-2xl uppercase transition disabled:grayscale">
            {slice.primary.buy_button_text_here}
            <span className="transition group-hover:translate-x-1">{">"}</span>
          </button>
        </Bounded>
      </div>
    </section>
  );
};

export default Hero;
