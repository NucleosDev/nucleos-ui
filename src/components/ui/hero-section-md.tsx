import React from "react";
import Image from "next/image";

const NucleosHero = () => {
  return (
    <section className="hero">
      {/* Ambient cinematic glow */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* Vignette */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* HERO CONTENT */}
      <div className="hero-content">
        <h1>
          Agents that do the work
          <br />
          Approvals that keep you safe.
        </h1>

        <p className="subtitle">
          Deploy AI agents that plan, act through your tools, and report
          outcomes—without changing how your teams work.
        </p>

        <div className="cta-row">
          <a href="#" className="btn-primary">
            Start your free trial
          </a>

          <a href="#" className="btn-text">
            View role based demos
          </a>
        </div>
      </div>

      {/* 3D VISUAL */}
      <div className="visual-stage">
        <div className="stack">
          {/* MAIN PANEL */}
          <div className="panel dashboard-main">
            <Image
              src="/nucleo-hero.svg"
              alt="Dashboard principal"
              fill
              priority
              sizes="960px"
              style={{
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />

            <div className="panel-highlight" />
            <div className="panel-shadow" />
            <div className="panel-noise" />
          </div>

          {/* SECONDARY PANEL */}
          <div className="panel dashboard-secondary">
            <Image
              src="/nucleo-hero-1.svg"
              alt="Dashboard secundário"
              fill
              priority
              sizes="760px"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            <div className="panel-highlight secondary" />
            <div className="panel-shadow secondary" />
            <div className="panel-noise" />
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

          padding: 80px 64px;

          font-family:
            "Geist",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;

          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ------------------------------- */
        /* AMBIENT */
        /* ------------------------------- */

        .ambient-glow {
          position: absolute;

          width: 1600px;
          height: 1200px;

          right: -400px;
          top: -100px;

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

        /* ------------------------------- */
        /* CONTENT */
        /* ------------------------------- */

        .hero-content {
          position: relative;
          z-index: 20;

          max-width: 760px;

          left: 3%;
        }

        .hero h1 {
          font-size: 72px;
          line-height: 0.98;
          font-weight: 800;
          letter-spacing: -0.055em;

          margin-bottom: 28px;

          max-width: 780px;
        }

        .subtitle {
          font-size: 18px;
          line-height: 1.6;

          color: #9f9fa9;

          max-width: 520px;

          margin-bottom: 40px;
        }

        .cta-row {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          height: 48px;

          padding: 0 22px;

          background: #ffffff;
          color: #0a0a0a;

          border-radius: 10px;

          font-size: 15px;
          font-weight: 600;

          text-decoration: none;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            opacity 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          background: #ececec;
        }

        .btn-text {
          color: #ffffff;

          text-decoration: none;

          font-size: 15px;
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

        /* ------------------------------- */
        /* 3D STAGE */
        /* ------------------------------- */

        .visual-stage {
          position: absolute;

          top: 50%;
          left: 50%;

          width: 1500px;
          height: 1000px;

          transform: translate(-20%, -44%);

          perspective: 2200px;
          perspective-origin: 50% 50%;

          transform-style: preserve-3d;

          z-index: 5;

          pointer-events: none;
        }

        .stack {
          position: absolute;
          inset: 0;

          transform-style: preserve-3d;

          transform: rotateX(22deg) rotateY(-30deg) rotateZ(-18deg) scale(1.15);

          opacity: 0;
          animation: stackEntrance 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.3s;
        }

        /* ------------------------------- */
        /* PANELS */
        /* ------------------------------- */

        .panel {
          position: absolute;

          overflow: hidden;
          isolation: isolate;

          transform-style: preserve-3d;

          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);

          box-shadow:
            0 140px 160px -60px rgba(0, 0, 0, 0.85),
            0 60px 80px -40px rgba(0, 0, 0, 0.7),
            0 0 120px rgba(255, 255, 255, 0.03);
        }

        .panel :global(img) {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          /* Remove scale artificial que distorce */
          transform: scale(1);
        }

        /* ------------------------------- */
        /* MAIN */
        /* ------------------------------- */

        .dashboard-main {
          width: 960px;
          height: 660px;

          left: 300px;
          top: 100px;

          z-index: 5;

          transform: translateZ(120px) scale(1);

          border-radius: 14px;

          /* Máscara mais natural - apenas nas bordas extremas */
          -webkit-mask-image:
            linear-gradient(
              to right,
              black 0%,
              black 85%,
              rgba(0, 0, 0, 0.8) 92%,
              rgba(0, 0, 0, 0.4) 97%,
              transparent 100%
            ),
            linear-gradient(
              to bottom,
              black 0%,
              black 88%,
              rgba(0, 0, 0, 0.6) 95%,
              rgba(0, 0, 0, 0.2) 99%,
              transparent 100%
            );

          -webkit-mask-composite: source-in;

          mask-image:
            linear-gradient(
              to right,
              black 0%,
              black 85%,
              rgba(0, 0, 0, 0.8) 92%,
              rgba(0, 0, 0, 0.4) 97%,
              transparent 100%
            ),
            linear-gradient(
              to bottom,
              black 0%,
              black 88%,
              rgba(0, 0, 0, 0.6) 95%,
              rgba(0, 0, 0, 0.2) 99%,
              transparent 100%
            );

          mask-composite: intersect;
        }

        /* ------------------------------- */
        /* SECONDARY */
        /* ------------------------------- */

        .dashboard-secondary {
          width: 760px;
          height: 600px;

          left: 160px;
          top: 200px;

          z-index: 3;

          transform: translateZ(-120px) scale(0.94);

          border-radius: 14px;

          opacity: 0.6;

          /* Máscara mais suave no secundário */
          -webkit-mask-image:
            linear-gradient(
              to right,
              black 0%,
              black 80%,
              rgba(0, 0, 0, 0.7) 90%,
              rgba(0, 0, 0, 0.3) 96%,
              transparent 100%
            ),
            linear-gradient(
              to bottom,
              black 0%,
              black 85%,
              rgba(0, 0, 0, 0.5) 93%,
              rgba(0, 0, 0, 0.15) 98%,
              transparent 100%
            );

          -webkit-mask-composite: source-in;

          mask-image:
            linear-gradient(
              to right,
              black 0%,
              black 80%,
              rgba(0, 0, 0, 0.7) 90%,
              rgba(0, 0, 0, 0.3) 96%,
              transparent 100%
            ),
            linear-gradient(
              to bottom,
              black 0%,
              black 85%,
              rgba(0, 0, 0, 0.5) 93%,
              rgba(0, 0, 0, 0.15) 98%,
              transparent 100%
            );

          mask-composite: intersect;
        }

        /* ------------------------------- */
        /* PANEL FX */
        /* ------------------------------- */

        .panel-highlight {
          position: absolute;

          inset: 0;

          background:
            radial-gradient(
              circle at 25% 15%,
              rgba(255, 255, 255, 0.22),
              transparent 28%
            ),
            linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 40%);

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
            transparent 40%,
            rgba(0, 0, 0, 0.5) 100%
          );

          z-index: 3;

          pointer-events: none;
        }

        .panel-shadow.secondary {
          opacity: 0.8;
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

        /* ------------------------------- */
        /* ANIMATIONS */
        /* ------------------------------- */

        @keyframes stackEntrance {
          from {
            opacity: 0;
            transform: rotateX(22deg) rotateY(-30deg) rotateZ(-18deg)
              scale(1.15) translateY(30px);
            filter: blur(4px);
          }

          to {
            opacity: 1;
            transform: rotateX(22deg) rotateY(-30deg) rotateZ(-18deg)
              scale(1.15) translateY(0);
            filter: blur(0);
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

        /* ------------------------------- */
        /* RESPONSIVE */
        /* ------------------------------- */

        @media (max-width: 1280px) {
          .hero h1 {
            font-size: 60px;
          }
        }

        @media (max-width: 767px) {
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
      `}</style>
    </section>
  );
};

export default NucleosHero;
