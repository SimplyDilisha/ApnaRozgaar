import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Eye } from 'lucide-react';
import { AccessibleButton } from '../App';
import heroImg from '../assets/premium_hero_bg.png';
import interview from '../assets/interview.jpg';
import interview1 from '../assets/laughing.jpg';
import interview2 from '../assets/work.jpg';

// ── Replace these with your actual images/GIFs from src/assets ──
// e.g. import slide1 from '../assets/hero1.jpg';
// For now using colored placeholders — swap src values with your real files
const SLIDES = [
  {
    src: interview,
    alt: 'interview'
  },
  {
    src: interview1,
    alt: 'happy person'
  },
  {
    src: interview2,
    alt: 'working employee'
  },
];

function Dots({ total, current, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          style={{
            width: i === current ? '12px' : '5px',
            height: '5px',
            borderRadius: '999px',
            background: i === current ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ))}
    </div>
  );
}

export default function LandingHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        className="hero-section"
        aria-labelledby="hero-heading"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '120px 24px 60px',
          /* Original image background restored */
          backgroundColor: 'var(--bg-secondary)',
          backgroundImage: `linear-gradient(to right, rgba(252,251,255,0.97) 0%, rgba(252,251,255,0.85) 45%, rgba(252,251,255,0.3) 100%), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundAttachment: 'fixed',
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            flexWrap: 'wrap',
          }}
        >
          {/* ── LEFT: Text ── */}
          <div style={{ flex: '1 1 45%', minWidth: '300px', position: 'relative', zIndex: 10 }}>

            {/* Badge */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '999px',
                padding: '6px 16px',
                marginBottom: '24px',
                color: '#7c3aed',
                fontSize: '0.82rem',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} />
              India's Largest Livelihood Platform
            </motion.div>

            <motion.h1
              variants={itemVariants}
              id="hero-heading"
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
                fontWeight: '800',
                marginBottom: '24px',
                color: 'var(--text-primary)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
              }}
            >
              Find <span className="text-gradient" >Work</span> That
              <br />
              <span className="text-gradient">Works For You</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: '1.15rem',
                color: '#374151',
                marginBottom: '40px',
                maxWidth: '500px',
                lineHeight: '1.7',
              }}
            >
              Connecting highly talented professionals with disabilities to employers who value true inclusion.{' '}
              <strong style={{ color: '#111827' }}>500+ accessible roles.</strong> Zero barriers.
            </motion.p>

            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
              <Link to="/jobs" style={{ textDecoration: 'none' }}>
                <AccessibleButton
                  style={{
                    minHeight: '54px',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    padding: '0 32px',
                  }}
                  aria-label="Browse all accessible job listings"
                >
                  Browse Jobs
                </AccessibleButton>
              </Link>
              <Link to="/employer" style={{ textDecoration: 'none' }}>
                <AccessibleButton
                  variant="outline"
                  style={{
                    minHeight: '54px',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    padding: '0 32px',
                    background: 'white',
                  }}
                  aria-label="View employer dashboard and post jobs"
                >
                  I'm an Employer
                </AccessibleButton>
              </Link>
            </motion.div>


          </div>

          {/* ── RIGHT: Image Carousel ── */}
          <motion.div
            variants={itemVariants}
            style={{
              flex: '1 1 40%',
              minWidth: '280px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Card */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(124,58,237,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                aspectRatio: '4/3',
                background: '#ede9fe',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={SLIDES[current].src}
                  alt={SLIDES[current].alt}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </AnimatePresence>

              {/* Bottom label overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '32px 20px 16px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
                  color: 'white',
                }}
              >
                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600' }}>
                  {SLIDES[current].alt}
                </p>
              </div>
            </div>

            {/* Dots */}
            <Dots total={SLIDES.length} current={current} onSelect={setCurrent} />

          </motion.div>
        </motion.div>
      </section>

      {/* ── About Section (unchanged) ── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem' }}>
              Our Commitment
            </p>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', margin: '20px 0 0', lineHeight: '1.1' }}>
              Empowering careers through true accessibility
            </h2>
            <p style={{ maxWidth: '700px', margin: '24px auto 0', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              ApnaRozgaar bridges talent and inclusive employers, creating accessible job experiences from application to interview. We believe opportunity should be built for every ability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '28px', background: 'white', borderRadius: '22px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <ShieldCheck size={24} color="var(--accent-purple)" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Verified Inclusive Employers</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Employers are vetted for real accessibility practices so you can apply with confidence.
              </p>
            </div>

            <div style={{ padding: '28px', background: 'white', borderRadius: '22px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Eye size={24} color="var(--accent-teal)" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Screen Reader Native</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Every component is tested against JAWS, NVDA, and VoiceOver to ensure a smooth experience.
              </p>
            </div>

            <div style={{ padding: '28px', background: 'white', borderRadius: '22px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,223,93,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Zap size={24} color="#F59E0B" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Built for Speed</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Fast, responsive job search and application tools that work across assistive technologies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 