import { FC } from "react";
import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import clsx from "clsx";
import { LuChevronRight } from "react-icons/lu";

/**
 * Props for `PurchaseButton`.
 */
export type PurchaseButtonProps =
  SliceComponentProps<Content.PurchaseButtonSlice>;

/**
 * Component for "PurchaseButton" Slices.
 */
const PurchaseButton: FC<PurchaseButtonProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <FadeIn
        className="relative mx-auto max-w-7xl px-4 text-center"
        targetChildren
      >
        <p className="mb-6 text-xl font-medium text-gray-700 uppercase md:text-2xl">
          {slice.primary.eyebrow}
        </p>

        <h2 className="font-bold-slanted mb-8 scroll-pt-6 text-5xl text-gray-900 uppercase md:text-7xl lg:text-8xl">
          <PrismicText field={slice.primary.heading} />
        </h2>

        <button
          className={clsx(
            "group motion-safe: motion-safe: relative w-full overflow-hidden rounded-full border-8 border-gray-900 bg-linear-to-r/oklch from-sky-300 to-sky-600 px-6 py-6 transition-all duration-300 ease-out focus:ring-[24px] focus:ring-sky-500/50 focus:outline-none md:border-[12px] md:px-20 md:py-16",
            "hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/40",
            "active:scale-95",
            "cursor-pointer",
          )}
        >
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent ease-out group-hover:translate-x-full motion-safe:transition-transform motion-safe:duration-1000" />

          <div className="relattive z-10 flex items-center justify-center gap-6 md:gap-8">
            <span className="font-black-slanted motion-safe:transistion-transform text-4xl tracking-wide text-gray-900 uppercase group-hover:-translate-y-1 motion-safe:duration-300 md:text-7xl lg:text-9xl">
              {slice.primary.buttontext}
            </span>
            <div className="motion-safe:transistion-all hidden group-hover:translate-x-2 group-hover:scale-125 motion-safe:duration-300 md:block">
              {" "}
              <LuChevronRight className="size-12 text-gray-900 md:size-16" />{" "}
            </div>
          </div>
        </button>

        <div className="mt-12 space-y-3 text-gray-600 md:text-lg">
          <PrismicRichText field={slice.primary.body} />
        </div>
      </FadeIn>
    </Bounded>
  );
};

export default PurchaseButton;
