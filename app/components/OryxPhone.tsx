"use client";
import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./OryxPhone.css";
import "./OryxPhoneOverrides.css";
gsap.registerPlugin(ScrollTrigger);

export default function OryxPhone(){
  const stage=useRef<HTMLDivElement>(null),body=useRef<HTMLDivElement>(null),card=useRef<HTMLDivElement>(null);
  useEffect(()=>{const ctx=gsap.context(()=>{
    if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    gsap.fromTo(body.current,{y:22},{y:-22,ease:"none",scrollTrigger:{trigger:stage.current,start:"top bottom",end:"bottom top",scrub:1}});
    if(!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
    const rx=gsap.quickTo(stage.current,"--rx",{duration:.9,ease:"power3"}) as unknown as (value:string)=>void;
    const ry=gsap.quickTo(stage.current,"--ry",{duration:.9,ease:"power3"}) as unknown as (value:string)=>void;
    const move=(e:PointerEvent)=>{if(!stage.current)return;const r=stage.current.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ry(`${x*18}deg`);rx(`${y*-12}deg`);if(card.current)gsap.to(card.current,{x:x*30,y:y*22,rotationY:x*-12,rotationX:y*9,duration:.7,ease:"power3.out",overwrite:"auto"})};
    const leave=()=>{rx("0deg");ry("0deg");if(card.current)gsap.to(card.current,{x:0,y:0,rotationY:-7,rotationX:0,duration:.9,ease:"power3.out"})};stage.current?.addEventListener("pointermove",move);stage.current?.addEventListener("pointerleave",leave);
    return()=>{stage.current?.removeEventListener("pointermove",move);stage.current?.removeEventListener("pointerleave",leave)};
  },stage);return()=>ctx.revert()},[]);
  return <div className="oryx-phone" ref={stage}><div className="oryx-phone__body" ref={body}><i className="oryx-phone__side oryx-phone__side--left"/><i className="oryx-phone__side oryx-phone__side--right"/><i className="oryx-phone__side oryx-phone__side--top"/><i className="oryx-phone__side oryx-phone__side--bottom"/><div className="oryx-phone__back"/><div className="oryx-phone__front">{/* eslint-disable-next-line @next/next/no-img-element */}<img className="oryx-phone__image" src="/images/generated/goldcril-interior-4k.png" alt="Ambiente decorado com as cores Goldcril"/><div className="oryx-phone__island"/><span className="oryx-phone__reflection"/></div></div><div ref={card} className="oryx-phone__color-card"><Sparkles size={16}/><span><b>+ de 1.000 cores</b><small>preparadas na hora</small></span></div><div className="oryx-phone__shadow"/></div>;
}
