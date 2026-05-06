import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap, Eye } from 'lucide-react';
import { AccessibleButton } from '../App';
import heroImg from '../assets/HeroImage.png';

export default function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          padding: '100px 24px 60px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'var(--bg-secondary)',
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        aria-labelledby="hero-heading"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}
        >
          {/* Left Side (60%) */}
          <div style={{ flex: '1 1 55%', minWidth: '320px', position: 'relative', zIndex: 10 }}>

            <motion.h1 variants={itemVariants} id="hero-heading" style={{
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: '800',
              marginBottom: '24px',
              color: 'var(--text-primary)',
              lineHeight: '1.1',
              letterSpacing: '-0.03em'
            }}>
              Find <span className="text-gradient">Work</span> That <br /> <span className="text-gradient">Works For You</span>
            </motion.h1>

            <motion.p variants={itemVariants} style={{
              fontSize: '1.25rem',
              color: '#000000',
              marginBottom: '40px',
              maxWidth: '600px',
              lineHeight: '1.6'
            }}>
              Connecting highly talented professionals with disabilities to employers who value true inclusion. 500+ accessible roles. Zero barriers.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <Link to="/jobs" style={{ textDecoration: 'none' }}>
                <AccessibleButton
                  style={{ minHeight: '56px', borderRadius: '14px', fontSize: '1.125rem', padding: '0 32px' }}
                  aria-label="Browse all accessible job listings"
                >
                  Browse Jobs
                </AccessibleButton>
              </Link>
              <Link to="/employer" style={{ textDecoration: 'none' }}>
                <AccessibleButton
                  variant="outline"
                  style={{ minHeight: '56px', borderRadius: '14px', fontSize: '1.125rem', padding: '0 32px', background: 'var(--card-bg)' }}
                  aria-label="View employer dashboard and post jobs"
                >
                  I'm an Employer
                </AccessibleButton>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured About Section */}
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
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <ShieldCheck size={24} color="var(--accent-purple)" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Verified Inclusive Employers</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Employers are vetted for real accessibility practices so you can apply with confidence.
              </p>
            </div>

            <div style={{ padding: '28px', background: 'white', borderRadius: '22px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(13, 148, 136, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Eye size={24} color="var(--accent-teal)" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Screen Reader Native</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Every component is tested against JAWS, NVDA, and VoiceOver to ensure a smooth experience.
              </p>
            </div>

            <div style={{ padding: '28px', background: 'white', borderRadius: '22px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255, 223, 93, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
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