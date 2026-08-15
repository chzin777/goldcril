"use client";
import { CSSProperties, forwardRef, RefObject, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import "./VariableProximity.css";

type Props={label:string;fromFontVariationSettings?:string;toFontVariationSettings?:string;containerRef:RefObject<HTMLDivElement|null>;radius?:number;falloff?:"linear"|"exponential"|"gaussian";className?:string;style?:CSSProperties};
const parse=(value:string)=>new Map(value.split(",").map(item=>{const [axis,n]=item.trim().split(" ");return[axis.replace(/["']/g,""),Number(n)]}));
const VariableProximity=forwardRef<HTMLSpanElement,Props>(({label,fromFontVariationSettings="'wght' 500",toFontVariationSettings="'wght' 850",containerRef,radius=130,falloff="gaussian",className="",style},ref)=>{
 const letters=useRef<(HTMLSpanElement|null)[]>([]); const axes=useMemo(()=>{const from=parse(fromFontVariationSettings),to=parse(toFontVariationSettings);return[...from].map(([axis,fromValue])=>({axis,fromValue,toValue:to.get(axis)??fromValue}))},[fromFontVariationSettings,toFontVariationSettings]);
 const move=(event:React.PointerEvent)=>{const box=containerRef.current?.getBoundingClientRect();if(!box)return;letters.current.forEach(el=>{if(!el)return;const r=el.getBoundingClientRect(),dx=event.clientX-(r.left+r.width/2),dy=event.clientY-(r.top+r.height/2),distance=Math.hypot(dx,dy),norm=Math.max(0,1-distance/radius),amount=falloff==="exponential"?norm**2:falloff==="gaussian"?Math.exp(-((distance/(radius/2))**2)/2):norm,direction=Math.max(-1,Math.min(1,dx/radius));el.style.fontVariationSettings=axes.map(a=>`'${a.axis}' ${a.fromValue+(a.toValue-a.fromValue)*amount}`).join(",");el.style.transform=`translate3d(${direction*amount*-5}px,${-amount*8}px,0) rotate(${direction*amount*-7}deg) skewX(${direction*amount*-8}deg) scale(${1+amount*.08},${1+amount*.16})`;el.style.filter=`blur(${Math.max(0,(1-amount)*.15)}px)`})};
 const leave=()=>letters.current.forEach(el=>{if(el){el.style.fontVariationSettings=fromFontVariationSettings;el.style.transform="none"}});let index=0;
 return <span ref={ref} className={`variable-proximity ${className}`} style={style} onPointerMove={move} onPointerLeave={leave} aria-label={label}>{label.split(" ").map((word,wi)=><span className="vp-word" key={wi}>{[...word].map(letter=>{const i=index++;return <motion.span aria-hidden="true" className="vp-letter" ref={el=>{letters.current[i]=el}} key={i}>{letter}</motion.span>})}{wi<label.split(" ").length-1&&<>&nbsp;</>}</span>)}</span>
});VariableProximity.displayName="VariableProximity";export default VariableProximity;
