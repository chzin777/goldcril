# Goldcril Tintas — Landing page

Site da **Goldcril Tintas** (Goianira — GO): tintas, texturas e acabamentos, com orientação especializada e orçamento rápido pelo WhatsApp.

**Produção:** https://goldcril.vercel.app

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + componentes shadcn/ui (`components/ui`)
- GSAP, Framer Motion e Lenis para animações
- `mathjs` (cálculos da calculadora de tinta/área)

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

Sem variáveis de ambiente — site estático.

## Estrutura

```
app/
  page.tsx                     renderiza a landing
  components/GoldcrilLanding.tsx  conteúdo e seções da página
  components/                  efeitos (GlassSurface, GradualBlur, OryxPhone, VariableProximity)
components/ui/                 botões e efeitos visuais reutilizáveis
lib/utils.ts                   helper `cn` (clsx + tailwind-merge)
```

Textos, contatos e seções ficam em `app/components/GoldcrilLanding.tsx`.

## Deploy

Vercel — cada push na branch padrão publica automaticamente.
