"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Brush, Camera, Check, Droplets, Layers3, MapPin, MessageCircle, PaintRoller, Palette, Phone, ShieldCheck, Sparkles, SprayCan } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import VariableProximity from "./VariableProximity";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import GlowHorizonFM from "@/components/ui/glow-horizon";
import OryxPhone from "./OryxPhone";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WA_MSG = "Olá! Gostaria de fazer um orçamento com a Goldcril Tintas.";
const INSTAGRAM = "https://www.instagram.com/goldcril_tintas/";
const ADDRESS = "Abaixo do Supermercado Barão Residencial — Parque Maracanã, Goianira — GO";
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ADDRESS);
const waLink = (phone: string) => `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(WA_MSG)}`;

const SELLERS = [
  { name: "Beatriz", phone: "5562985465857", display: "(62) 98546-5857", color: "#f4bd48" },
  { name: "Leonardo", phone: "5562984715859", display: "(62) 98471-5859", color: "#55c6bf" },
];

const PRODUCTS = [
  { number: "01", name: "Tintas acrílicas", text: "Cobertura, rendimento e acabamento impecável para áreas internas e externas.", color: "#38b9d1", Icon: PaintRoller },
  { number: "02", name: "Esmaltes & vernizes", text: "Proteção duradoura e beleza para madeira, metal e outras superfícies.", color: "#f2b846", Icon: SprayCan },
  { number: "03", name: "Texturas & efeitos", text: "Personalidade para paredes com grafiato, cimento queimado e efeitos exclusivos.", color: "#eb7359", Icon: Layers3 },
  { number: "04", name: "Impermeabilizantes", text: "Barreira eficiente contra infiltrações, umidade e ação do tempo.", color: "#456de6", Icon: Droplets },
  { number: "05", name: "Acessórios", text: "Rolos, pincéis, fitas e tudo o que deixa a execução mais precisa.", color: "#58b97c", Icon: Brush },
  { number: "06", name: "Sua cor, na hora", text: "Milhares de possibilidades no sistema tintométrico, preparadas para você.", color: "#a66ee7", Icon: Palette },
];

const BENEFITS = [
  ["01", "Escolha sem dúvida", "Atendimento técnico para combinar produto, superfície e acabamento."],
  ["02", "Cor do seu jeito", "Ajustamos o tom na hora para transformar referência em realidade."],
  ["03", "Obra que rende", "Produtos selecionados para cobrir mais, durar mais e evitar retrabalho."],
  ["04", "Perto de você", "Atendimento direto, humano e rápido em Goianira e região."],
];

export default function GoldcrilLanding() {
  const root = useRef<HTMLDivElement>(null);
  const heroText = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from("[data-nav]", { y: -30, opacity: 0, duration: 0.8 })
      .from("[data-hero-line]", { yPercent: 110, rotate: 2, stagger: 0.1, duration: 1.1 }, "-=.4")
      .from("[data-hero-copy], [data-hero-actions]", { y: 24, opacity: 0, stagger: 0.12, duration: 0.8 }, "-=.65")
      .from("[data-orb]", { scale: 0.6, opacity: 0, duration: 1.4, ease: "expo.out" }, "-=1.1");

    gsap.to("[data-progress]", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
    gsap.to("[data-parallax-image]", { yPercent: 16, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: .7 } });
    gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((layer) => gsap.fromTo(layer, { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: .8 } }));
    gsap.to("[data-orb]", { yPercent: 20, rotate: 18, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.to("[data-hero-content]", { yPercent: 22, opacity: 0.1, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "45% top", end: "bottom top", scrub: true } });
    gsap.timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: 1.1 } })
      .to("[data-liquid-stage]", { scale: .84, rotation: -7, yPercent: 26, ease: "none" }, 0)
      .to(".chip-one", { yPercent: -80, z: 80, rotationY: 10, ease: "none" }, 0)
      .to(".chip-two", { yPercent: -52, z: -35, rotationY: -9, filter: "blur(1.2px)", ease: "none" }, 0)
      .to(".liquid-blob", { scale: 1.15, rotation: 18, stagger: .04, ease: "none" }, 0);

    const hero = root.current?.querySelector<HTMLElement>("[data-hero]");
    const moveX = gsap.quickTo("[data-liquid-stage]", "x", { duration: 1.2, ease: "power3.out" });
    const moveY = gsap.quickTo("[data-liquid-stage]", "y", { duration: 1.2, ease: "power3.out" });
    const particleX = gsap.quickTo("[data-particles]", "x", { duration: 1.8, ease: "power3.out" });
    const particleY = gsap.quickTo("[data-particles]", "y", { duration: 1.8, ease: "power3.out" });
    const handlePointer = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - .5, y = event.clientY / window.innerHeight - .5;
      moveX(x * 34); moveY(y * 24); particleX(x * -22); particleY(y * -16);
      gsap.to(".chip-one", { rotationY: x * 18, rotationX: y * -14, x: x * 18, y: y * 12, duration: .55, ease: "power2.out", overwrite: "auto" });
      gsap.to(".chip-two", { rotationY: x * -14, rotationX: y * 10, x: x * -11, y: y * -8, duration: .7, ease: "power2.out", overwrite: "auto" });
    };
    if (window.matchMedia("(pointer:fine) and (min-width:768px)").matches) hero?.addEventListener("pointermove", handlePointer);

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, { y: 70, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    const productTrack = root.current?.querySelector<HTMLElement>("[data-product-track]");
    const productSection = root.current?.querySelector<HTMLElement>("[data-products]");
    if (productTrack && productSection && window.innerWidth >= 1024) {
      const distance = () => Math.max(0, productTrack.scrollWidth - window.innerWidth + 80);
      gsap.to(productTrack, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: productSection, start: "top top", end: () => `+=${distance() + window.innerHeight * 0.7}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
    }

    gsap.utils.toArray<HTMLElement>("[data-benefit]").forEach((card, i) => {
      gsap.from(card, { x: i % 2 ? 80 : -80, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } });
    });

    return () => { hero?.removeEventListener("pointermove", handlePointer); };
  }, { scope: root });

  return (
    <div ref={root} className="site-shell">
      <div data-progress className="scroll-progress" />
      <header data-nav className="nav-wrap">
        <nav className="nav-inner nav-redesign" aria-label="Navegação principal">
          <a href="#inicio" className="brand nav-brand" aria-label="Goldcril Tintas — início"><Image src="/images/goldcril-liquid-logo.png" alt="Goldcril Tintas" width={1900} height={800} priority /></a>
          <div className="nav-links nav-menu"><a href="#produtos">Produtos</a><a href="#diferenciais">Diferenciais</a><a href="#contato">Contato</a></div>
          <a href={waLink(SELLERS[0].phone)} target="_blank" rel="noreferrer" className="nav-cta nav-budget"><span>Falar com a gente</span><span className="nav-arrow"><ArrowUpRight size={16} /></span></a>
        </nav>
      </header>

      <main>
        <section id="inicio" data-hero className="hero">
          <div className="hero-aurora" />
          <div className="hero-horizon"><GlowHorizonFM variant="bottom" /></div>
          <div data-particles className="hero-particles" aria-hidden="true">{Array.from({length:14},(_,i)=><i key={i} style={{left:`${(i*37)%96}%`,top:`${(i*53)%88}%`,width:`${3+(i%4)*2}px`,height:`${3+(i%4)*2}px`,animationDelay:`-${i*.47}s`,animationDuration:`${4+(i%5)}s`}} />)}</div>
          <div data-orb data-liquid-stage className="liquid-stage" aria-hidden="true">
            <div className="liquid-canvas"><Image data-parallax-image src="/images/generated/goldcril-interior-4k.png" alt="" fill sizes="(max-width: 767px) 72vw, 42vw" priority/><i className="liquid-blob blob-a"/><i className="liquid-blob blob-b"/><i className="liquid-blob blob-c"/></div>
            <div className="liquid-glass-lite"><div className="liquid-shine" /></div>
            <div className="floating-chip chip-glass chip-one"><span className="chip-dot" /> + de 1.000 cores</div>
            <div className="floating-chip chip-glass chip-two"><Sparkles size={16} /> Cor feita na hora</div>
          </div>
          <div ref={heroText} data-hero-content className="hero-content">
            <p data-hero-copy className="eyebrow"><Sparkles size={14} /> Tinta certa. Resultado extraordinário.</p>
            <h1><span className="line-mask"><span data-hero-line><VariableProximity label="Sua casa merece" containerRef={heroText} radius={150} fromFontVariationSettings="'wght' 650" toFontVariationSettings="'wght' 850" /></span></span><span className="line-mask hero-accent"><span data-hero-line><VariableProximity label="mais cor." containerRef={heroText} radius={125} fromFontVariationSettings="'wght' 400" toFontVariationSettings="'wght' 700" /></span></span></h1>
            <p data-hero-copy className="hero-copy">Tintas, texturas e acabamentos com orientação de verdade para você acertar de primeira — na cor, no produto e no resultado.</p>
            <div data-hero-actions className="hero-actions"><LiquidButton className="hero-liquid-cta" onClick={()=>document.querySelector("#contato")?.scrollIntoView({behavior:"smooth"})}><MessageCircle size={19} /> Pedir orçamento</LiquidButton><a className="button button-glass" href="#produtos">Explorar produtos <ArrowDown size={18} /></a></div>
          </div>
          <div className="hero-index"><span>GOLDCRIL®</span><span>GOIANIRA — GO</span><span>SCROLL / 01—05</span></div>
        </section>

        <section className="manifesto">
          <div className="manifesto-grid">
            <p data-reveal className="section-kicker">A cor muda tudo</p>
            <div><h2 data-reveal>Não vendemos só tinta.<br /><em>Ajudamos a transformar espaços.</em></h2><p data-reveal className="manifesto-copy">Da primeira dúvida ao último acabamento, nosso time indica a solução que faz sentido para sua obra, seu bolso e sua ideia.</p></div>
          </div>
          <div className="marquee" aria-hidden="true"><div>CORES QUE TRANSFORMAM · ACABAMENTO QUE DURA · CORES QUE TRANSFORMAM · ACABAMENTO QUE DURA · </div></div>
        </section>

        <section className="parallax-gallery" aria-label="Ambientes transformados pela cor"><div className="parallax-frame frame-wide"><Image data-depth src="/images/generated/goldcril-interior-4k.png" alt="Sala contemporânea com composição artística em tinta verde e dourada" fill sizes="100vw" /></div><div className="parallax-caption"><span>MATÉRIA / COR / ESPAÇO</span><strong>A cor não ocupa.<br/>Ela transforma.</strong></div></section>

        <section id="produtos" data-products className="products-section">
          <div className="products-head"><div><p className="section-kicker">Tudo para a sua obra</p><h2>Uma solução para<br />cada superfície.</h2></div><p>Deslize para descobrir <ArrowUpRight size={17} /></p></div>
          <div data-product-track className="product-track">
            {PRODUCTS.map(({ number, name, text, color, Icon }) => <article className="product-card glass" key={number} style={{ "--card-color": color } as React.CSSProperties}><div className="product-top"><span>{number}</span><span className="product-icon"><Icon size={28} /></span></div><div><h3>{name}</h3><p>{text}</p></div><div className="product-line" /></article>)}
            <article className="product-card product-contact"><Sparkles size={34} /><h3>Não sabe por onde começar?</h3><p>Conte sua ideia. A gente monta o caminho.</p><a href="#contato">Falar com especialista <ArrowUpRight size={18} /></a></article>
          </div>
        </section>

        <section id="diferenciais" className="benefits-section">
          <div className="benefits-sticky"><p className="section-kicker">Por que Goldcril</p><h2>Confiança em<br />cada <em>demão.</em></h2><p>Atendimento próximo, escolhas inteligentes e produtos que entregam o que prometem.</p><div className="benefits-visual"><OryxPhone/><div className="quality-seal"><ShieldCheck /><span>Escolha<br />assistida</span></div></div></div>
          <div className="benefit-list">{BENEFITS.map(([n,t,d]) => <article data-benefit key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><Check /></article>)}</div>
        </section>

        <section id="contato" className="contact-section">
          <div className="contact-glow" />
          <div data-reveal className="contact-copy"><p className="section-kicker">Vamos colorir essa ideia?</p><h2>Seu próximo ambiente<br />começa com um <em>olá.</em></h2><p>Escolha um especialista e fale agora pelo WhatsApp.</p></div>
          <div className="seller-grid">{SELLERS.map((seller) => <a data-reveal href={waLink(seller.phone)} target="_blank" rel="noreferrer" className="seller-card glass" style={{"--seller-color":seller.color} as React.CSSProperties} key={seller.phone}><span className="seller-shine"/><span className="seller-avatar" style={{ background: seller.color }}><span className="seller-initial">{seller.name[0]}</span></span><span className="seller-info"><small>Especialista Goldcril</small><strong>{seller.name}</strong><small>{seller.display}</small></span><span className="seller-arrow"><MessageCircle size={21} /></span></a>)}</div>
          <div className="contact-info"><a href={MAPS_LINK} target="_blank" rel="noreferrer"><MapPin /> <span>{ADDRESS}</span></a><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Camera /> <span>@goldcril_tintas</span></a><a href={waLink(SELLERS[0].phone)} target="_blank" rel="noreferrer"><Phone /> <span>Atendimento por WhatsApp</span></a></div>
        </section>
      </main>

      <footer><div className="footer-brand"><Image src="/images/goldcril-liquid-logo.png" alt="Goldcril Tintas" width={1900} height={800} /><p>Cores que transformam.</p></div><div className="footer-meta"><span>© 2026 GOLDCRIL TINTAS</span><span>GOIANIRA — GO · BRASIL</span><a href="#inicio">VOLTAR AO TOPO ↑</a></div></footer>
    </div>
  );
}
