"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, Globe, Cpu } from "lucide-react";

// Components
function FluidBackground() {
  return (
    <div className="fluid-bg">
      <div className="aurora-blob blob-1" />
      <div className="aurora-blob blob-2" />
      <div className="aurora-blob blob-3" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
      <Link href="/" className="text-2xl font-bold tracking-tighter">
        AI STUDIO<span className="text-purple-500">.</span>PRO
      </Link>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link href="/login" className="hover:opacity-60 transition">LOGIN</Link>
        <Link href="/register" className="hover:opacity-60 transition">GET STARTED</Link>
      </div>
    </nav>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20">
      <motion.div style={{ y: y1 }} className="max-w-[90vw] mx-auto text-center z-10">
        <h1 className="hero-title mb-6">
          <span className="block reveal-text" style={{ animationDelay: '0.1s' }}>REALITY</span>
          <span className="block reveal-text text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ animationDelay: '0.2s' }}>REIMAGINED</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="hero-subtitle max-w-2xl mx-auto mb-12"
        >
          The enterprise-grade generative engine that turns abstract thoughts into
          <span className="text-white font-medium"> concrete masterpieces</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/register" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden magnet-btn">
            <span className="relative z-10 flex items-center gap-2">
              START CREATING <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </span>
          </Link>

          <button className="flex items-center gap-3 text-sm font-medium text-zinc-400 hover:text-white transition">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            WATCH SHOWREEL
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div style={{ y: y2 }} className="absolute inset-0 pointer-events-none z-0">
        {/* Abstract shapes can go here if needed */}
      </motion.div>
    </section>
  );
}

function Marquee() {
  const words = ["GENERATE", "ANIMATE", "VOICEOVER", "DESIGN", "SYNTHESIZE", "SCALE", "ENTERPRISE"];

  return (
    <div className="py-20 border-y border-white/5 bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {[...words, ...words, ...words].map((word, i) => (
            <span key={i} className="text-[10vw] font-black text-transparent stroke-text mx-8 opacity-20 hover:opacity-100 transition duration-500 cursor-default" style={{ WebkitTextStroke: "1px white" }}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel p-10 h-[400px] flex flex-col justify-between group hover:bg-white/5 transition duration-500"
    >
      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition duration-500">
        <span className="font-mono">0{index + 1}</span>
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        <p className="text-zinc-400 leading-relaxed max-w-xs">{desc}</p>
      </div>
    </motion.div>
  );
}

function Features() {
  return (
    <section className="py-32 px-6">
      <div className="container mx-auto">
        <div className="mb-20">
          <h2 className="text-sm font-mono text-purple-400 mb-4">// CAPABILITIES</h2>
          <p className="text-4xl md:text-6xl font-bold max-w-4xl">
            A complete suite of cognitive tools designed for the modern creator.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            index={0}
            title="Visual Synthesis"
            desc="Generate hyper-realistic imagery, banners, and logos with our proprietary diffusion models."
          />
          <FeatureCard
            index={1}
            title="Motion Engine"
            desc="Transform static scripts into fluid, dynamic video content with AI-driven presenters."
          />
          <FeatureCard
            index={2}
            title="Sonic Intelligence"
            desc="Human-parity voice synthesis that captures emotion, nuance, and cadence perfectly."
          />
        </div>
      </div>
    </section>
  );
}

function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Text to Image", "Text to Video", "Voice Cloning"];

  return (
    <section className="py-32 px-6 bg-zinc-900/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-8">The logic behind the magic.</h2>
            <div className="space-y-6">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`text-2xl md:text-4xl font-bold block transition-all duration-300 ${activeTab === i ? "text-white translate-x-4" : "text-zinc-700 hover:text-zinc-500"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-2 aspect-square md:aspect-video rounded-3xl overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              {activeTab === 0 && <Sparkles className="w-24 h-24 text-white/20" />}
              {activeTab === 1 && <Play className="w-24 h-24 text-white/20" />}
              {activeTab === 2 && <Cpu className="w-24 h-24 text-white/20" />}
            </div>

            {/* Fake UI */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-sm text-zinc-300">
                  {activeTab === 0 && "Generating high-fidelity textures..."}
                  {activeTab === 1 && "Rendering physics simulation..."}
                  {activeTab === 2 && "Synthesizing neural waveforms..."}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">AI STUDIO PRO</h2>
          <p className="text-zinc-500 text-sm">Architecting the future of media.</p>
        </div>
        <div className="flex gap-8 text-sm font-medium text-zinc-400">
          <Link href="#" className="hover:text-white transition">MANIFESTO</Link>
          <Link href="#" className="hover:text-white transition">PRICING</Link>
          <Link href="#" className="hover:text-white transition">LOGIN</Link>
        </div>
        <p className="text-zinc-600 text-xs">© 2024 / ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white overflow-hidden">
      <FluidBackground />
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <InteractiveDemo />
      <Footer />
    </main>
  );
}
