import React from "react";
import Image from "next/image";
import { LiquidGlass } from "@/components/ui/liquid-glass";

const NucleosHero = () => {
  return (
    <section className="hero ">
      {/* Ambient cinematic glow */}
      <div className="ambient-glow " aria-hidden="true" />

      {/* Vignette */}

      {/* HERO CONTENT */}
      <div className="hero-content">
        <h1>
          Lorem Ipsum is simply
          <br />
          dummy text of the printing
        </h1>

        <p className="subtitle">
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown
        </p>

        <div className="cta-row">
          <div className="btn-primary">Start your free trial</div>

          <a href="#" className="btn-text">
            View role based demos
          </a>
        </div>
      </div>

      {/* VISUAL */}
      <div className="visual-stage ">
        <div className="stack scale-[1.11]  ">
          {/* MAIN PANEL */}
          <div className="panel dashboard-main">
            <Image
              src="/nucleo-hero.svg"
              alt="Dashboard principal"
              fill
              priority
              sizes="920px"
              style={{
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />

            {/* EFFECTS */}
            <div className="panel-highlight" />
            <div className="panel-shadow" />
            <div className="panel-glow" />
            <div className="panel-noise" />
            <div className="panel-edge-light" />

            {/* Dissolve overlay extra para suavizar a borda inferior e lateral */}
            <div className="panel-dissolve main" />
          </div>

          {/* SECONDARY PANEL */}
          <div className="panel dashboard-secondary">
            <Image
              src="/nucleo-hero-secondary.svg"
              alt="Dashboard secundário"
              fill
              priority
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* EFFECTS */}
            <div className="panel-highlight secondary" />
            <div className="panel-shadow secondary" />
            <div className="panel-glow secondary" />
            <div className="panel-noise" />
            <div className="panel-edge-light secondary" />

            {/* Dissolve overlay extra para suavizar a borda inferior e lateral */}
            <div className="panel-dissolve secondary-panel" />
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .hero {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          padding: 80px 64px;

          background:
            radial-gradient(
              ellipse at top right,
              rgba(255, 255, 255, 0.05),
              transparent 40%
            ),
            radial-gradient(
              ellipse 140% 100% at 70% 50%,
              #1a1a1a 0%,
              #0c0c0c 45%,
              #050505 100%
            );

          color: white;

          font-family:
            "Geist",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;

          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* -------------------------------- */
        /* AMBIENT */
        /* -------------------------------- */

        .ambient-glow {
          position: absolute;
          width: 1600px;
          height: 1200px;
          left: -400px;
          top: -300px;

          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.05) 28%,
            transparent 68%
          );

          filter: blur(80px);

          pointer-events: none;
          z-index: 1;

          animation: ambientPulse 8s ease-in-out infinite;
        }

        .hero-vignette {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(0, 0, 0, 0.35) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0) 70%,
              rgba(0, 0, 0, 0.25) 100%
            );

          pointer-events: none;
          z-index: 2;
        }

        /* -------------------------------- */
        /* CONTENT */
        /* -------------------------------- */

        .hero-content {
          position: relative;
          z-index: 20;
          left: 10%;
          top: -40px;
          max-width: 700px;
        }

        .hero h1 {
          font-size: 48px;
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -0.045em;
          margin-bottom: 20px;
          max-width: 700px;
        }

        .subtitle {
          font-size: 15px;
          line-height: 1.55;
          color: #9f9fa9;
          max-width: 400px;
          margin-bottom: 28px;
        }

        .cta-row {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          height: 40px;
          padding: 0 18px;

          background: #ffffff;
          color: #0a0a0a;

          border-radius: 8px;

          font-size: 14px;
          font-weight: 600;

          text-decoration: none;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            opacity 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          background: #ececec;
        }

        .btn-text {
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;

          opacity: 0.92;

          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .btn-text:hover {
          opacity: 0.65;
          transform: translateX(2px);
        }

        /* -------------------------------- */
        /* 3D STAGE */
        /* -------------------------------- */

        .visual-stage {
          position: absolute;

          top: 50%;
          left: 50%;
          scale: 1;
          width: 1400px;
          height: 900px;

          transform: translate(-30%, -45%);

          perspective: 1500px;
          perspective-origin: 50% 50%;

          pointer-events: none;
          z-index: 5;
        }

        .stack {
          position: absolute;
          inset: 0;
          top: -90px;
          left: 50px;

          opacity: 1.95;

          transform: rotate(-40deg);

          transform-style: preserve-3d;

          animation: stackIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;

          animation-delay: 0.1s;
        }

        /* ATMOSPHERIC LIGHT */
        .stack::before {
          content: "";

          position: absolute;

          width: 1100px;
          height: 900px;

          left: 8%;
          top: 4%;

          background: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            rgba(18, 18, 18, 0.45) 0%,
            rgba(14, 14, 14, 0.28) 30%,
            rgba(10, 10, 10, 0.12) 55%,
            rgba(6, 6, 6, 0.04) 75%,
            rgba(3, 3, 3, 0.01) 90%,
            transparent 100%
          );

          filter: blur(100px);

          mix-blend-mode: screen;

          opacity: 0.7;

          z-index: 20;

          pointer-events: none;
        }

        /* EDGE FALLOFF */
        .stack::after {
          content: "";

          position: absolute;
          inset: -15%;

          background: radial-gradient(
            ellipse at center,
            transparent 42%,
            rgba(0, 0, 0, 0.42) 100%
          );

          filter: blur(90px);

          z-index: 19;
          pointer-events: none;
        }

        /* -------------------------------- */
        /* PANELS */
        /* -------------------------------- */

        .panel {
          position: absolute;

          overflow: hidden;
          isolation: isolate;

          border-radius: 10px;

          transform-style: preserve-3d;

          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);

          box-shadow:
            0 140px 160px -60px rgba(0, 0, 0, 0.85),
            0 60px 80px -40px rgba(0, 0, 0, 0.7),
            0 0 120px rgba(255, 255, 255, 0.03);

          transition:
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.6s ease;
        }

        .panel :global(img) {
          width: 100%;
          height: 100%;

          object-fit: cover;
          display: block;

          opacity: 1;

          filter: saturate(1.05) contrast(1.04) brightness(1);
        }

        /* -------------------------------- */
        /* DISSOLVE OVERLAYS */
        /* -------------------------------- */

        .panel-dissolve {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }

        /* 
           Dissolve Principal: borda inferior e lateral direita
           Transição mais longa e suave para naturalidade
        */
        .panel-dissolve.main {
          background:
            linear-gradient(
              to right,
              transparent 75%,
              rgba(0, 0, 0, 0.18) 88%,
              rgba(0, 0, 0, 0.45) 95%,
              rgba(0, 0, 0, 0.8) 99%,
              #000000 100%
            ),
            linear-gradient(
              to bottom,
              transparent 80%,
              rgba(0, 0, 0, 0.15) 90%,
              rgba(0, 0, 0, 0.4) 96%,
              rgba(0, 0, 0, 0.75) 99.5%,
              #000000 100%
            );
        }

        /* 
           Dissolve Secundário: borda inferior e lateral direita
           Mais intenso e com fade mais rápido para sumir completamente
        */
        .panel-dissolve.secondary-panel {
          background:
            linear-gradient(
              to right,
              transparent 68%,
              rgba(0, 0, 0, 0.25) 82%,
              rgba(0, 0, 0, 0.55) 92%,
              rgba(0, 0, 0, 0.85) 98%,
              #000000 100%
            ),
            linear-gradient(
              to bottom,
              transparent 72%,
              rgba(0, 0, 0, 0.2) 85%,
              rgba(0, 0, 0, 0.5) 94%,
              rgba(0, 0, 0, 0.82) 98.5%,
              #000000 100%
            );
        }

        /* -------------------------------- */
        /* MAIN PANEL */
        /* -------------------------------- */

        .dashboard-main {
          width: 920px;
          height: 600px;
          opacity: 1;
          top: 80px;
          left: 60px;

          z-index: 9;

          transform: rotateX(25.5deg) rotateY(35.5deg) translateZ(5px)
            translateX(60px) translateY(-30px);

          /*
             Máscara principal: mantém o conteúdo intacto no centro
             e suaviza apenas as extremidades para evitar cortes secos.
          */
          -webkit-mask-image:
            linear-gradient(
              to right,

              black 0%,

              black 72%,

              rgba(0, 0, 0, 0.995) 80%,

              rgba(0, 0, 0, 0.985) 85%,

              rgba(0, 0, 0, 0.96) 89%,

              rgba(0, 0, 0, 0.9) 92%,

              rgba(0, 0, 0, 0.78) 95%,

              rgba(0, 0, 0, 0.58) 97%,

              rgba(0, 0, 0, 0.34) 98.5%,

              rgba(0, 0, 0, 0.14) 99.3%,

              rgba(0, 0, 0, 0.04) 99.8%,

              transparent 100%
            ),
            linear-gradient(
              to bottom,

              black 0%,

              black 78%,

              rgba(0, 0, 0, 0.995) 86%,

              rgba(0, 0, 0, 0.985) 90%,

              rgba(0, 0, 0, 0.95) 93%,

              rgba(0, 0, 0, 0.82) 96%,

              rgba(0, 0, 0, 0.58) 98%,

              rgba(0, 0, 0, 0.28) 99.2%,

              rgba(0, 0, 0, 0.08) 99.8%,

              transparent 100%
            );

          -webkit-mask-composite: source-in;

          mask-image:
            linear-gradient(
              to right,

              black 0%,

              black 72%,

              rgba(0, 0, 0, 0.995) 80%,

              rgba(0, 0, 0, 0.985) 85%,

              rgba(0, 0, 0, 0.96) 89%,

              rgba(0, 0, 0, 0.9) 92%,

              rgba(0, 0, 0, 0.78) 95%,

              rgba(0, 0, 0, 0.58) 97%,

              rgba(0, 0, 0, 0.34) 98.5%,

              rgba(0, 0, 0, 0.14) 99.3%,

              rgba(0, 0, 0, 0.04) 99.8%,

              transparent 100%
            ),
            linear-gradient(
              to bottom,

              black 0%,

              black 78%,

              rgba(0, 0, 0, 0.995) 86%,

              rgba(0, 0, 0, 0.985) 90%,

              rgba(0, 0, 0, 0.95) 93%,

              rgba(0, 0, 0, 0.82) 96%,

              rgba(0, 0, 0, 0.58) 98%,

              rgba(0, 0, 0, 0.28) 99.2%,

              rgba(0, 0, 0, 0.08) 99.8%,

              transparent 100%
            );

          mask-composite: intersect;
        }

        /* -------------------------------- */
        /* SECONDARY PANEL */
        /* -------------------------------- */

        .dashboard-secondary {
          width: 920px;
          height: 600px;

          left: -60px;
          top: 130px;

          z-index: 1;

          opacity: 0.8;

          transform: rotateX(25.5deg) rotateY(35.5deg) translateZ(5px)
            translateX(60px) translateY(-30px);

          /*
             Máscara secundária: mais agressiva nas bordas
             para dar profundidade e desaparecer por completo.
          */
          -webkit-mask-image:
            linear-gradient(
              to right,
              black 0%,
              black 64%,
              rgba(0, 0, 0, 0.995) 74%,
              rgba(0, 0, 0, 0.985) 80%,
              rgba(0, 0, 0, 0.95) 86%,
              rgba(0, 0, 0, 0.84) 91%,
              rgba(0, 0, 0, 0.66) 95%,
              rgba(0, 0, 0, 0.42) 97.5%,
              rgba(0, 0, 0, 0.18) 99%,
              rgba(0, 0, 0, 0.05) 99.7%,
              transparent 100%
            ),
            linear-gradient(
              to bottom,
              black 0%,
              black 70%,
              rgba(0, 0, 0, 0.995) 80%,
              rgba(0, 0, 0, 0.985) 86%,
              rgba(0, 0, 0, 0.94) 91%,
              rgba(0, 0, 0, 0.8) 95%,
              rgba(0, 0, 0, 0.54) 97.8%,
              rgba(0, 0, 0, 0.24) 99.1%,
              rgba(0, 0, 0, 0.06) 99.8%,
              transparent 100%
            );

          -webkit-mask-composite: source-in;

          mask-image:
            linear-gradient(
              to right,
              black 0%,
              black 64%,
              rgba(0, 0, 0, 0.995) 74%,
              rgba(0, 0, 0, 0.985) 80%,
              rgba(0, 0, 0, 0.95) 86%,
              rgba(0, 0, 0, 0.84) 91%,
              rgba(0, 0, 0, 0.66) 95%,
              rgba(0, 0, 0, 0.42) 97.5%,
              rgba(0, 0, 0, 0.18) 99%,
              rgba(0, 0, 0, 0.05) 99.7%,
              transparent 100%
            ),
            linear-gradient(
              to bottom,
              black 0%,
              black 70%,
              rgba(0, 0, 0, 0.995) 80%,
              rgba(0, 0, 0, 0.985) 86%,
              rgba(0, 0, 0, 0.94) 91%,
              rgba(0, 0, 0, 0.8) 95%,
              rgba(0, 0, 0, 0.54) 97.8%,
              rgba(0, 0, 0, 0.24) 99.1%,
              rgba(0, 0, 0, 0.06) 99.8%,
              transparent 100%
            );

          mask-composite: intersect;
        }

        /* -------------------------------- */
        /* PANEL EFFECTS */
        /* -------------------------------- */

        .panel-highlight {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 22% 14%,
              rgba(255, 255, 255, 0.24),
              transparent 28%
            ),
            linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 42%);

          mix-blend-mode: screen;

          z-index: 4;
          pointer-events: none;
        }

        .panel-highlight.secondary {
          opacity: 0.55;
        }

        .panel-shadow {
          position: absolute;
          inset: 0;

          background: linear-gradient(
            to bottom right,
            transparent 42%,
            rgba(0, 0, 0, 0.52) 100%
          );

          z-index: 3;
          pointer-events: none;
        }

        .panel-shadow.secondary {
          opacity: 0.8;
        }

        .panel-glow {
          position: absolute;

          width: 65%;
          height: 65%;

          right: -15%;
          bottom: -18%;

          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.08) 28%,
            transparent 70%
          );

          filter: blur(90px);

          mix-blend-mode: screen;

          opacity: 0.22;

          z-index: 2;
          pointer-events: none;
        }

        .panel-glow.secondary {
          opacity: 0.14;
          filter: blur(100px);
        }

        .panel-edge-light {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.14) 0%,
              transparent 12%
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 18%
            );

          opacity: 0.8;

          mix-blend-mode: screen;

          z-index: 6;

          pointer-events: none;
        }

        .panel-edge-light.secondary {
          opacity: 0.45;
        }

        .panel-noise {
          position: absolute;
          inset: 0;

          z-index: 5;

          opacity: 0.025;

          mix-blend-mode: soft-light;

          pointer-events: none;

          background-image: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.04) 0px,
            transparent 1px,
            transparent 2px
          );
        }

        /* -------------------------------- */
        /* ANIMATIONS */
        /* -------------------------------- */

        @keyframes stackIn {
          from {
            opacity: 0;
            transform: rotate(-40deg) translateY(40px);
          }

          to {
            opacity: 1;
            transform: rotate(-40deg) translateY(0);
          }
        }

        @keyframes ambientPulse {
          0%,
          100% {
            opacity: 0.75;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-content > * {
          animation: fadeUp 0.8s ease-out backwards;
        }

        .hero h1 {
          animation-delay: 0.05s;
        }

        .subtitle {
          animation-delay: 0.15s;
        }

        .cta-row {
          animation-delay: 0.25s;
        }

        /* -------------------------------- */
        /* RESPONSIVE */
        /* -------------------------------- */

        @media (max-width: 1024px) {
          .visual-stage,
          .ambient-glow,
          .hero-vignette {
            display: none;
          }

          .hero {
            padding: 56px 24px;
          }

          .hero-content {
            left: 0;
          }

          .hero h1 {
            font-size: 46px;
            line-height: 1.02;
          }

          .subtitle {
            font-size: 16px;
          }
        }

        @media (max-width: 640px) {
          .hero {
            min-height: auto;

            padding-top: 120px;
            padding-bottom: 80px;
          }

          .hero h1 {
            font-size: 38px;
          }

          .cta-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }
        }
      `}</style>
      <div
        className="absolute bottom-[-40px] left-0 w-full h-[30%] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, #000000 0%, transparent 100%)",
        }}
      />
    </section>
  );
};

export default NucleosHero;
