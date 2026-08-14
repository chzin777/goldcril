"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  PaintRoller,
  SprayCan,
  Layers,
  Droplets,
  Brush,
  Palette,
  Phone,
  Camera,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---- business data ---- */
const WA_MSG =
  "Olá, eu gostaria de fazer um orçamento";

function waLink(phone: string) {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    WA_MSG
  )}`;
}

const SELLERS = [
  {
    name: "Beatriz",
    role: "Vendedora",
    phone: "5562985465857",
    display: "(62) 98546-5857",
    accent: "var(--coral)",
  },
  {
    name: "Leonardo",
    role: "Vendedor",
    phone: "5562984715859",
    display: "(62) 98471-5859",
    accent: "var(--blue)",
  },
];

const INSTAGRAM = "https://www.instagram.com/goldcril_tintas/";
const ADDRESS =
  "Abaixo do Supermercado Barão Residencial - Parque Maracanã, Goianira - GO, 75370-073, Brazil";
const MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ADDRESS);

const CATEGORIES = [
  {
    name: "Tinta Acrílica",
    desc: "Fosco, acetinado e semibrilho para paredes internas e externas.",
    color: "var(--blue)",
    Icon: PaintRoller,
  },
  {
    name: "Esmalte & Verniz",
    desc: "Acabamento premium para madeira e metal, alta durabilidade.",
    color: "var(--coral)",
    Icon: SprayCan,
  },
  {
    name: "Texturas & Efeitos",
    desc: "Grafiato, cimento queimado e efeitos decorativos exclusivos.",
    color: "var(--teal)",
    Icon: Layers,
  },
  {
    name: "Impermeabilizantes",
    desc: "Proteção contra umidade para lajes, telhados e alvenaria.",
    color: "var(--plum)",
    Icon: Droplets,
  },
  {
    name: "Acessórios",
    desc: "Rolos, pincéis, fitas, lixas e tudo para a obra ficar perfeita.",
    color: "var(--gold-deep)",
    Icon: Brush,
  },
  {
    name: "Cores Personalizadas",
    desc: "Máquina de tingimento: milhares de cores na hora que você quiser.",
    color: "var(--gold)",
    Icon: Palette,
  },
];

const BENEFITS = [
  { n: "01", t: "Atendimento especializado", d: "Ajudamos você a escolher o produto e a cor certa para cada ambiente." },
  { n: "02", t: "Marcas de confiança", d: "Trabalhamos com linhas reconhecidas e produtos de alto rendimento." },
  { n: "03", t: "Cor na hora", d: "Sistema de tingimento para acertar o tom exato que você imaginou." },
  { n: "04", t: "Preço justo", d: "Condições especiais para pintores, obras e clientes fiéis." },
];

/* ---- paint splats ----
   Each card gets its own splat: an irregular blob with a few long "spike" drips
   plus scattered satellite droplets. Shapes are generated from a deterministic
   pseudo-noise (pure Math.sin, so server and client render identically — no
   hydration mismatch), then run through the #gc-ink filter for wet ragged edges. */
function splatNoise(seed: number, i: number) {
  const s = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return s - Math.floor(s); // 0..1, deterministic
}

function buildSplat(seed: number) {
  const n = 16;
  const cx = 100;
  const cy = 100;
  const inView = (x: number, y: number) => x > 4 && x < 196 && y > 4 && y < 196;
  type Dot = { cx: number; cy: number; r: number };
  const dots: Dot[] = [];

  // --- irregular central mass: small lobes with a few big pushes ---
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = splatNoise(seed, i);
    const bump = t > 0.72 ? 30 : t < 0.25 ? -10 : 8;
    const r = 30 + bump + splatNoise(seed, i + 40) * 10;
    const a = (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  const mid = (i: number): [number, number] => {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  };
  let d = `M${mid(n - 1)[0].toFixed(1)} ${mid(n - 1)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [qx, qy] = pts[i];
    const [ex, ey] = mid(i);
    d += `Q${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  }
  d += "Z";

  // --- flung droplet trails: each streak is a line of shrinking dots ---
  const streaks = 5 + Math.floor(splatNoise(seed, 99) * 2); // 5-6
  for (let s = 0; s < streaks; s++) {
    const a = (s / streaks) * Math.PI * 2 + (splatNoise(seed, s + 3) - 0.5) * 1.1;
    const cnt = 2 + Math.floor(splatNoise(seed, s + 11) * 3); // 2-4 droplets
    let dist = 40 + splatNoise(seed, s + 17) * 12;
    let rr = 5.5 + splatNoise(seed, s + 23) * 5;
    for (let k = 0; k < cnt; k++) {
      const px = cx + Math.cos(a) * dist;
      const py = cy + Math.sin(a) * dist;
      if (inView(px, py)) {
        dots.push({ cx: +px.toFixed(1), cy: +py.toFixed(1), r: +Math.max(1, rr).toFixed(1) });
      }
      dist += 9 + splatNoise(seed, s * 7 + k) * 13;
      rr *= 0.6;
    }
  }

  // --- scattered fine specks ---
  for (let j = 0; j < 5; j++) {
    const a = splatNoise(seed, j + 70) * Math.PI * 2;
    const dist = 46 + splatNoise(seed, j + 80) * 42;
    const px = cx + Math.cos(a) * dist;
    const py = cy + Math.sin(a) * dist;
    if (inView(px, py)) {
      dots.push({ cx: +px.toFixed(1), cy: +py.toFixed(1), r: +(1.2 + splatNoise(seed, j + 90) * 2.6).toFixed(1) });
    }
  }

  return { d, dots };
}

// one distinct splat per product card
const SPLATS = Array.from({ length: 6 }, (_, k) => buildSplat(k * 3 + 1));

function InkSplat({
  color,
  index,
  className,
}: {
  color: string;
  index: number;
  className?: string;
}) {
  const s = SPLATS[index % SPLATS.length];
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      style={{ filter: "url(#gc-ink)" }}
    >
      <g fill={color}>
        <path d={s.d} />
        {s.dots.map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} />
        ))}
      </g>
    </svg>
  );
}

export default function GoldcrilLanding() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* smooth scrolling (Lenis) drives ScrollTrigger from the GSAP ticker,
         so the video scrub and slides feel fluid instead of stepped */
      let lenis: Lenis | undefined;
      let lenisTicker: ((time: number) => void) | undefined;
      if (!reduce) {
        lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85 });
        lenis.on("scroll", ScrollTrigger.update);
        lenisTicker = (time: number) => lenis!.raf(time * 1000);
        gsap.ticker.add(lenisTicker);
        gsap.ticker.lagSmoothing(0);
      }
      const cleanup = () => {
        if (lenisTicker) gsap.ticker.remove(lenisTicker);
        lenis?.destroy();
      };

      /* ===== INK VIDEO — auto-plays a short intro, then the SCROLL drives it:
         while you scroll down through the pinned hero, the video keeps advancing
         and never pauses. Spread over HERO_SCROLL so it stays calm, not fast. ===== */
      // scroll distance the pinned hero occupies — bigger = slower video + slower
      // panel slide (spread over more scroll). Tune this to control the pace.
      const HERO_SCROLL = "+=180%";
      const video = root.current?.querySelector<HTMLVideoElement>("[data-hero-video]");
      const INTRO_END = 5; // seconds the video auto-plays before handing to scroll
      const VIDEO_END = 16; // furthest second the scroll advances the video to
      let introDone = false;

      if (video) {
        const startIntro = () => {
          video.pause();
          gsap.to(video, {
            currentTime: INTRO_END,
            duration: INTRO_END + 0.6,
            ease: "power2.out",
            onComplete: () => {
              introDone = true;
            },
          });
        };
        if (video.readyState >= 1) startIntro();
        else video.addEventListener("loadedmetadata", startIntro, { once: true });

        // scrub against the WHOLE document scroll — the video keeps advancing as
        // long as you scroll down and never pauses when the hero pin releases
        ScrollTrigger.create({
          start: 0,
          end: "max",
          scrub: 0.6,
          onUpdate: (self) => {
            if (!introDone) return;
            const cap = Number.isFinite(video.duration)
              ? Math.min(VIDEO_END, video.duration - 0.05)
              : VIDEO_END;
            video.currentTime = INTRO_END + self.progress * Math.max(0, cap - INTRO_END);
          },
        });
      }

      /* ===== HERO STAGE — horizontal pinned transition (hero → "Por que comprar") ===== */
      gsap.set("[data-panel-second]", { xPercent: -100 });

      const stageTl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-stage]",
          start: "top top",
          end: HERO_SCROLL,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });
      stageTl
        // panels finish in the first ~55% of the pin — content leaves earlier
        // and snappier, then the timeline holds while the video keeps scrubbing
        .to("[data-panel-hero]", { xPercent: 100, yPercent: 100, ease: "power2.in", duration: 0.35 }, 0)
        // 3D turn on the hero content as it flies off toward the bottom-right
        .to(
          "[data-hero]",
          {
            rotationY: 55,
            rotationX: 14,
            z: -320,
            scale: 0.82,
            opacity: 0.35,
            transformPerspective: 1000,
            transformOrigin: "center center",
            ease: "power2.in",
            duration: 0.35,
          },
          0
        )
        .to("[data-panel-second]", { xPercent: 0, ease: "power1.in", duration: 0.55 }, 0)
        .to({}, { duration: 0.45 });

      if (reduce) return cleanup;

      /* scroll progress bar */
      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { scrub: 0.3, start: 0, end: "max" },
      });

      /* hero intro — entry (fromTo so the CSS opacity:0 is the START, not the end) */
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
        .fromTo(
          "[data-hero] > *",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12 }
        )
        .fromTo(
          "[data-blob]",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.15, duration: 1.1, ease: "back.out(1.6)" },
          "-=0.7"
        );

      /* floating blobs — continuous ambient motion */
      gsap.utils.toArray<HTMLElement>("[data-blob]").forEach((b, i) => {
        gsap.to(b, {
          y: i % 2 ? 26 : -26,
          x: i % 2 ? -18 : 18,
          duration: 4 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      /* generic reveal — ENTRY on enter, EXIT (reverse) on leave, both directions */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      /* staggered groups — cards animate in/out together */
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.fromTo(
          group.children,
          { y: 70, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: group,
              start: "top 85%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      /* wet-ink breathing — animates the #gc-ink filter so the card splats
         wobble subtly at their ragged edges */
      gsap.to("#gc-ink feDisplacementMap", {
        attr: { scale: 7 },
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* section titles — sliding underline that grows then retracts on exit */
      gsap.utils.toArray<HTMLElement>("[data-underline]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      return cleanup;
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative">
      {/* scroll progress */}
      <div
        data-progress
        className="fixed left-0 top-0 z-50 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-gold-deep via-gold to-coral"
      />

      {/* ink filter used by the section dividers */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="gc-ink" x="-10%" y="-500%" width="120%" height="1100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.06" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40">
        <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full border border-line/70 bg-surface/80 px-4 py-2.5 backdrop-blur-md sm:px-6">
          <a href="#top" className="flex items-center" aria-label="Goldcril Tintas">
            <Image
              src="/images/logonobg.png"
              alt="Goldcril Tintas"
              width={640}
              height={640}
              priority
              className="h-11 w-auto origin-left scale-[1.95]"
            />
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
            <a href="#produtos" className="transition-colors hover:text-foreground">Produtos</a>
            <a href="#diferenciais" className="transition-colors hover:text-foreground">Diferenciais</a>
            <a href="#vendedores" className="transition-colors hover:text-foreground">Vendedores</a>
            <a href="#local" className="transition-colors hover:text-foreground">Onde estamos</a>
          </div>
          <a
            href="#vendedores"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-bold text-surface transition-transform hover:scale-105"
          >
            Orçamento
          </a>
        </nav>
      </header>

      {/* HERO + SECOND SECTION — horizontal pinned stage.
          Video plays an intro, then scroll scrubs it frame-by-frame while
          the hero slides right and section two slides in from the left. */}
      <section id="top" data-stage className="relative h-dvh overflow-hidden">
        {/* INK VIDEO — background for the HERO ONLY; scrubs while the stage is
            pinned, then the sections below scroll over a plain background */}
        <div className="absolute inset-0 z-0 isolate">
          <video
            data-hero-video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(1.25)" }}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/videos/ink-scroll-scrub.mp4" type="video/mp4" />
          </video>
          {/* blue tint — recolors the ink toward blue (hue only, keeps luminance) */}
          <div className="pointer-events-none absolute inset-0 bg-blue opacity-30 mix-blend-color" />
          {/* light wash keeps the theme bright and everything readable over the ink */}
          <div className="pointer-events-none absolute inset-0 bg-background/70" />
        </div>

        {/* PANEL 1 — HERO CONTENT (slides right) */}
        <div
          data-panel-hero
          className="absolute inset-0 z-20 flex items-center justify-center px-5"
        >
          <div data-hero className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="text-[2.75rem] font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
              Cores que <span className="gc-gradient-text">transformam</span>
              <br className="hidden sm:block" /> o seu espaço!
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg font-semibold text-foreground [text-shadow:0_1px_10px_rgba(241,248,249,0.9)] sm:text-xl">
              Tintas, texturas e acabamentos com atendimento que entende de obra —
              a gente acerta a cor, você aproveita o resultado.
            </p>
            <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              <a
                href="#vendedores"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-white shadow-lg shadow-gold/30 transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                Pedir orçamento
              </a>
              <a
                href="#produtos"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface/80 px-7 py-3.5 font-bold text-foreground backdrop-blur-sm transition-colors hover:border-gold sm:w-auto"
              >
                Ver produtos
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-foreground/80">
              {SELLERS.map((s) => (
                <a
                  key={s.phone}
                  href={waLink(s.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 px-3 py-1.5 backdrop-blur-sm transition-colors hover:text-gold-deep"
                >
                  <Phone className="h-4 w-4 text-teal" />
                  {s.name} · {s.display}
                </a>
              ))}
            </div>
            <p className="pointer-events-none mt-10 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted">
              Role para explorar
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </p>
          </div>
        </div>

        {/* PANEL 2 — SECOND SECTION (slides in from the left) */}
        <div
          data-panel-second
          id="diferenciais"
          className="absolute inset-0 z-30 flex items-center px-5"
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-muted">
                <Palette className="h-4 w-4 text-gold-deep" /> Diferenciais
              </span>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Por que comprar na <span className="gc-gradient-text">Goldcril</span>
              </h2>
              <span className="mt-5 block h-1 w-28 rounded bg-gold" />
              <p className="mt-6 max-w-md text-lg text-foreground/80">
                Mais que vender tinta: a gente orienta cada etapa da sua obra pra
                você comprar certo, gastar bem e ter um acabamento que dura.
              </p>
              <a
                href="#vendedores"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-white shadow-lg shadow-gold/30 transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" /> Falar com um vendedor
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div
                  key={b.n}
                  className="rounded-2xl border border-line bg-surface/95 p-6 backdrop-blur-sm transition-transform hover:-translate-y-1"
                >
                  <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gold-soft text-lg font-extrabold text-gold-deep">
                    {b.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{b.t}</h3>
                  <p className="mt-2 text-sm text-muted">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="produtos" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 data-reveal className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              O que você encontra
            </h2>
            <span data-underline className="mt-4 block h-1 w-28 rounded bg-coral" />
            <p data-reveal className="mt-4 text-lg text-muted">
              Linha completa para pintura residencial, comercial e obras.
            </p>
          </div>
          <div data-stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <div
                key={c.name}
                className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-transform hover:-translate-y-1.5"
              >
                <InkSplat
                  color={c.color}
                  index={i}
                  className="pointer-events-none absolute -right-9 -top-9 h-32 w-32 origin-center opacity-15 transition-all duration-500 ease-out group-hover:scale-[1.4] group-hover:rotate-[20deg] group-hover:opacity-25"
                />
                <span
                  className="inline-grid h-14 w-14 place-items-center rounded-2xl"
                  style={{ background: `color-mix(in srgb, ${c.color} 14%, white)` }}
                >
                  <c.Icon className="h-7 w-7" style={{ color: c.color }} strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-xl font-bold">{c.name}</h3>
                <p className="mt-2 text-sm text-muted">{c.desc}</p>
                <span
                  className="mt-5 block h-1.5 w-12 rounded-full"
                  style={{ background: c.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="px-5 py-12">
        <div
          data-reveal
          className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold via-gold-deep to-coral px-8 py-14 text-center text-surface"
        >
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sua obra pede a cor certa?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-surface/90">
            Fale com a gente agora e receba orientação de quem entende do assunto.
          </p>
          <a
            href="#vendedores"
            className="mt-7 inline-block rounded-full bg-foreground px-8 py-3.5 font-bold text-surface transition-transform hover:scale-105"
          >
            Falar com um vendedor
          </a>
        </div>
      </section>

      {/* VENDEDORES */}
      <section id="vendedores" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 data-reveal className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Fale com um vendedor
            </h2>
            <span data-underline className="mt-4 block h-1 w-28 rounded bg-gold" />
            <p data-reveal className="mt-4 text-lg text-muted">
              Escolha quem vai te atender e chame direto no WhatsApp.
            </p>
          </div>
          <div data-stagger className="mt-12 grid gap-6 sm:grid-cols-2">
            {SELLERS.map((s) => (
              <a
                key={s.phone}
                href={waLink(s.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 rounded-3xl border border-line bg-surface p-7 transition-transform hover:-translate-y-1.5"
              >
                <span
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-2xl font-extrabold text-surface"
                  style={{ background: s.accent }}
                >
                  {s.name[0]}
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-bold uppercase tracking-wide text-muted">
                    {s.role}
                  </span>
                  <span className="block text-xl font-bold">{s.name}</span>
                  <span className="mt-1 block text-sm font-semibold text-muted">
                    {s.display}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-sm font-bold text-surface transition-transform group-hover:scale-105">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION + CONTACT */}
      <section id="local" className="px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 data-reveal className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Onde estamos
            </h2>
            <span data-underline className="mt-4 block h-1 w-28 rounded bg-teal" />

            <div data-stagger className="mt-8 space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <p className="flex items-center gap-1.5 text-sm font-bold text-gold-deep">
                  <MapPin className="h-4 w-4" /> Endereço
                </p>
                <p className="mt-1 text-lg font-semibold">{ADDRESS}</p>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue underline-offset-2 hover:underline"
                >
                  Abrir no Google Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-5">
                <p className="flex items-center gap-1.5 text-sm font-bold text-gold-deep">
                  <Phone className="h-4 w-4" /> Telefone / WhatsApp
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {SELLERS.map((s) => (
                    <a
                      key={s.phone}
                      href={waLink(s.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-lg font-semibold hover:text-gold"
                    >
                      <span>{s.name}</span>
                      <span className="text-muted">{s.display}</span>
                    </a>
                  ))}
                </div>
              </div>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface p-5 text-center font-bold transition-colors hover:border-coral"
              >
                <Camera className="h-5 w-5 text-coral" /> Siga no Instagram @goldcril_tintas
              </a>
            </div>
          </div>

          {/* map embed */}
          <div data-reveal className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-sm">
            <iframe
              title="Localização Goldcril Tintas"
              className="h-full min-h-[380px] w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1912.032892990442!2d-49.393978561239294!3d-16.573195996045442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935e634b35a397b5%3A0x83261ee2a4896001!2sGoldcril%20Tintas!5e0!3m2!1spt-BR!2sbr!4v1784320882876!5m2!1spt-BR!2sbr"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line bg-surface/60 px-5 pb-8 pt-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* brand — logo scaled up via transform so it grows without adding
                any real height/width to the footer layout */}
            <div>
              <Image
                src="/images/logonobg.png"
                alt="Goldcril Tintas"
                width={640}
                height={640}
                className="h-14 w-auto origin-top-left scale-[1.9]"
              />
              <p className="mt-9 max-w-xs text-sm text-muted">
                Tintas, texturas e acabamentos com atendimento que entende de
                obra. A gente acerta a cor, você aproveita o resultado.
              </p>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-coral"
              >
                <Camera className="h-4 w-4 text-coral" /> @goldcril_tintas
              </a>
            </div>

            {/* nav */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide">Navegação</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li><a href="#produtos" className="transition-colors hover:text-gold">Produtos</a></li>
                <li><a href="#diferenciais" className="transition-colors hover:text-gold">Diferenciais</a></li>
                <li><a href="#vendedores" className="transition-colors hover:text-gold">Vendedores</a></li>
                <li><a href="#local" className="transition-colors hover:text-gold">Onde estamos</a></li>
              </ul>
            </div>

            {/* contact */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide">Fale com a gente</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {SELLERS.map((s) => (
                  <li key={s.phone}>
                    <a
                      href={waLink(s.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                    >
                      <MessageCircle className="h-4 w-4 text-teal" />
                      {s.name} · {s.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* address */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide">Onde estamos</h4>
              <p className="mt-4 flex items-start gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                {ADDRESS}
              </p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue underline-offset-2 hover:underline"
              >
                Abrir no Google Maps <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
            <p>© {2026} Goldcril Tintas · Todos os direitos reservados.</p>
            <p>Goianira - GO · Brasil</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
