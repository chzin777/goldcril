"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidbuttonVariants=cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold outline-none transition-[transform,filter] duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"text-primary hover:scale-105",dark:"text-white hover:brightness-110"},size:{default:"h-12 px-7",lg:"h-14 px-8",icon:"size-12"}},defaultVariants:{variant:"dark",size:"lg"}});
type Props=React.ComponentProps<"button">&VariantProps<typeof liquidbuttonVariants>&{asChild?:boolean};
const LiquidButton=React.forwardRef<HTMLButtonElement,Props>(({className,variant,size,asChild=false,children,...props},ref)=>{const Comp=asChild?Slot:"button";return <Comp ref={ref} className={cn("liquid-button relative isolate overflow-hidden",liquidbuttonVariants({variant,size,className}))} {...props}><span className="liquid-button__surface"/><span className="liquid-button__content">{children}</span><GlassFilter/></Comp>});
LiquidButton.displayName="LiquidButton";
function GlassFilter(){return <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true"><defs><filter id="container-glass" x="-10%" y="-25%" width="120%" height="150%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".035 .06" numOctaves="1" seed="2" result="noise"/><feGaussianBlur in="noise" stdDeviation="1.2" result="softNoise"/><feDisplacementMap in="SourceGraphic" in2="softNoise" scale="18" xChannelSelector="R" yChannelSelector="B"/></filter></defs></svg>}
export {LiquidButton,liquidbuttonVariants};
