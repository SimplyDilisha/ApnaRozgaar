import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, LogOut, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingHero from './pages/LandingHero';
import ProfileBuilder from './pages/ProfileBuilder';
import JobListings from './pages/JobListings';
import JobDetail from './pages/JobDetail';
import EmployerDashboard from './pages/EmployerDashboard';
import ChatbotPage from './pages/ChatbotPage';
import AuthPage from './pages/AuthPage';
import ScreenReader from './ScreenReader';
import MotorAccessibilityToolbar from './MotorAccessibilityToolbar';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import VoiceControl from './VoiceControl';
import InterviewPrepPage from './pages/InterviewPrepPage';
import AboutUs from './pages/AboutUs';
import ResumeBuilder from './pages/ResumeBuilder';
import LibraryPage from './pages/LibraryPage';
import UserProfile from './pages/UserProfile';
import PricingPage from './pages/PricingPage';
import { useAuth } from './context/AuthContext';
import faviconImg from './public/favicon.png';
import './App.css';

/**
 * Visual Alert System for Deaf/HoH Users
 * Provides visual feedback for events that would normally only have audio alerts
 */
export const announceToScreenReader = (message) => {
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) {
    announcer.textContent = '';
    // Small delay to ensure the change is detected
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
};

export const triggerVisualAlert = (element) => {
  if (element) {
    element.classList.add('visual-alert');
    setTimeout(() => {
      element.classList.remove('visual-alert');
    }, 3000);
  }
};

// Base accessible button component used throughout
export const AccessibleButton = ({ children, onClick, className = '', variant = 'primary', style, ...props }) => {
  const baseStyle = {
    minHeight: '44px',
    borderRadius: '16px',
    fontWeight: '600',
    padding: '0 24px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.95rem',
    position: 'relative',
    overflow: 'hidden',
  };

  const variants = {
    primary: {
      background: 'var(--primary-gradient)',
      color: 'white',
      border: 'none',
      boxShadow: '0 8px 20px -6px var(--accent-purple-glow)'
    },
    outline: {
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(8px)',
      border: '1.5px solid rgba(37, 99, 235, 0.2)',
      color: 'var(--text-primary)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)'
    },
    premium: {
      background: 'var(--premium-gradient)',
      color: 'white',
      border: 'none',
      boxShadow: '0 8px 20px -6px rgba(245, 158, 11, 0.4)',
      fontWeight: '700'
    }
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
      className={`accessible-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const { user, userProfile, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus trapping and Escape key handling for mobile menu
  useEffect(() => {
    if (mobileMenuOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (!mobileMenuOpen) return;

      // Close on Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      // Trap focus inside menu
      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Return focus to menu button when closed
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: scrolled ? '12px 24px' : '24px',
      pointerEvents: 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <header className={scrolled ? 'header-glass' : ''} style={{
        pointerEvents: 'auto',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: '24px',
        boxShadow: scrolled ? '0 10px 40px -10px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.03)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            padding: '4px',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            display: 'flex'
          }}>
            <img src={faviconImg} alt="ApnaRozgaar logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          </div>
          <span style={{ 
            fontWeight: '800', 
            fontSize: '1.4rem', 
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Outfit', sans-serif", 
            letterSpacing: '-0.02em' 
          }}>
            ApnaRozgaar
          </span>
        </Link>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', flex: '1 1 auto' }}>
          <AccessibleButton variant="premium" className="desktop-only" onClick={() => navigate('/pricing')} aria-label="Premium Membership" style={{ gap: '6px', marginRight: '8px' }}>
            <Crown size={16} /> Premium
          </AccessibleButton>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} className="desktop-only" />

          <AccessibleButton variant="ghost" className="desktop-only nav-link-hover" onClick={() => navigate('/interview-prep')} aria-label="Practice Interviews">Interview Prep</AccessibleButton>
          <AccessibleButton variant="ghost" className="desktop-only nav-link-hover" onClick={() => navigate('/resume-builder')} aria-label="AI Resume Builder">AI Resume</AccessibleButton>
          <AccessibleButton variant="ghost" className="desktop-only nav-link-hover" onClick={() => navigate('/library')} aria-label="AI Library">Library</AccessibleButton>

          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} className="desktop-only" />

          {isAuthenticated ? (
            <>
              <span className="desktop-only" style={{
                color: 'var(--text-primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '0 12px'
              }}
                onClick={() => navigate('/profile')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate('/profile')}
              >
                Hi, {userProfile?.name || user?.displayName || 'User'}
              </span>
              <AccessibleButton
                variant="outline"
                className="desktop-only"
                onClick={async () => { await logout(); navigate('/'); }}
                aria-label="Sign out of your account"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LogOut size={16} />
                Sign Out
              </AccessibleButton>
            </>
          ) : (
            <AccessibleButton
              variant="outline"
              className="desktop-only"
              onClick={() => navigate('/auth')}
              aria-label="Sign in to your account"
            >
              Sign In
            </AccessibleButton>
          )}

          <AccessibleButton className="desktop-only" onClick={() => navigate('/employer')} aria-label="Post a new job listing" style={{ marginLeft: '8px' }}>Post a Job</AccessibleButton>
          
          <button
            ref={menuButtonRef}
            className="mobile-only"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {mobileMenuOpen ? <X size={28} color="var(--text-primary)" aria-hidden="true" /> : <Menu size={28} color="var(--text-primary)" aria-hidden="true" />}
          </button>
        </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass"
            style={{
              position: 'fixed',
              top: 'var(--header-height)',
              left: 0,
              right: 0,
              bottom: 0,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              zIndex: 100,
              overflowY: 'auto'
            }}
          >
            <button
              ref={firstFocusableRef}
              onClick={closeMobileMenu}
              style={{
                alignSelf: 'flex-end',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              aria-label="Close navigation menu"
            >
              <X size={20} aria-hidden="true" />
              <span>Close</span>
            </button>

            <Link
              onClick={closeMobileMenu}
              to="/employer"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              For Employers
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/profile"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              My Profile
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/jobs"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Browse Jobs
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/chat"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Chat with Asha
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/pricing"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center',
                color: '#FFD700'
              }}
            >
              Premium Membership
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/interview-prep"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                borderLeft: '4px solid var(--accent-purple)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Interview Prep
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/resume-builder"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              AI Resume Built
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/library"
              style={{
                fontSize: '1.2rem',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              AI Books Library
            </Link>

            <hr style={{ borderTop: '1px solid var(--border)', opacity: 0.5, margin: '8px 0' }} aria-hidden="true" />

            {isAuthenticated ? (
              <>
                <div style={{
                  padding: '16px 20px',
                  fontSize: '1.1rem',
                  color: 'var(--text-primary)',
                  fontWeight: '500'
                }}>
                  Hi, {userProfile?.name || user?.displayName || 'User'}
                </div>
                <AccessibleButton
                  variant="ghost"
                  onClick={async () => { await logout(); closeMobileMenu(); navigate('/'); }}
                  style={{
                    justifyContent: 'flex-start',
                    padding: '16px 20px',
                    fontSize: '1.2rem',
                    minHeight: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  aria-label="Sign out of your account"
                >
                  <LogOut size={20} />
                  Sign Out
                </AccessibleButton>
              </>
            ) : (
              <AccessibleButton
                variant="ghost"
                onClick={() => { closeMobileMenu(); navigate('/auth'); }}
                style={{
                  justifyContent: 'flex-start',
                  padding: '16px 20px',
                  fontSize: '1.2rem',
                  minHeight: '56px'
                }}
                aria-label="Sign in to your account"
              >
                Sign In
              </AccessibleButton>
            )}
            <AccessibleButton
              onClick={() => { closeMobileMenu(); navigate('/employer'); }}
              style={{
                width: '100%',
                minHeight: '56px',
                fontSize: '1.1rem'
              }}
              aria-label="Post a new job listing"
            >
              Post a Job
            </AccessibleButton>
          </motion.nav>
        )}
      </AnimatePresence>
      </header>
    </div>
  );
};

const Footer = () => (
  <footer style={{
    marginTop: 'auto',
    position: 'relative',
    overflow: 'hidden',
    background: '#0A0416',
    color: 'white',
    padding: '80px 24px 32px',
    fontFamily: "'Inter', sans-serif"
  }} role="contentinfo">
    <div style={{
      position: 'absolute', top: '-150px', left: '-10%', width: '500px', height: '500px',
      background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
      borderRadius: '50%', pointerEvents: 'none'
    }} aria-hidden="true" />
    <div style={{
      position: 'absolute', bottom: '-200px', right: '-10%', width: '600px', height: '600px',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
      borderRadius: '50%', pointerEvents: 'none'
    }} aria-hidden="true" />

    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '48px', 
        marginBottom: '64px' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'white', padding: '4px', borderRadius: '50%', display: 'inline-flex' }}>
              <img src={faviconImg} alt="Apna Rozgaar logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
            <strong style={{ fontSize: '1.8rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Apna Rozgaar</strong>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
            Empowering careers through accessibility. We match exceptional talent with truly inclusive employers.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', borderRadius: '24px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(16,185,129,0.3)' }}>✓ WCAG 2.1 AA</span>
            <span style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '24px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)' }}>🤟 Deaf/HoH Friendly</span>
          </div>
        </div>

        <div>
          <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '20px', fontFamily: "'Outfit', sans-serif" }}>Platform</h3>
          <nav aria-label="Platform links" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/accessibility" className="footer-link">Accessibility Statement</Link>
          </nav>
        </div>

        <div>
          <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '20px', fontFamily: "'Outfit', sans-serif" }}>Contact Us</h3>
          <nav aria-label="Contact Options" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a href="mailto:support@apnarozgaar.in" className="footer-link">
              <span role="img" aria-label="Email" style={{ marginRight: '8px' }}>✉️</span> support@apnarozgaar.in
            </a>
            <a href="#" className="footer-link">
              <span role="img" aria-label="Text/SMS" style={{ marginRight: '8px' }}>💬</span> SMS: +91 98765 43210
            </a>
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '8px' }}>
              <span style={{ display: 'block', color: '#F87171', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>📵 No phone-only support</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Inquiries via email/chat only</span>
            </div>
          </nav>
        </div>

        <div>
          <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '20px', fontFamily: "'Outfit', sans-serif" }}>Connect</h3>
          <nav aria-label="Social media links" style={{ display: 'flex', gap: '16px' }}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </nav>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} Apna Rozgaar. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/privacy" className="footer-bottom-link">Privacy</a>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <a href="/terms" className="footer-bottom-link">Terms</a>
          </div>
        </div>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ opacity: 0.7 }}>⌨️</span> Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>?</kbd> for shortcuts
        </p>
      </div>
    </div>
  </footer>
);

// Animated Router Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <LandingHero />
          </motion.div>
        } />
        <Route path="/profile/create" element={
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <ProfileBuilder />
          </motion.div>
        } />
        <Route path="/jobs" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <JobListings />
          </motion.div>
        } />
        <Route path="/jobs/:id" element={
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <JobDetail />
          </motion.div>
        } />
        <Route path="/employer" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <EmployerDashboard />
          </motion.div>
        } />
        <Route path="/chat" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <ChatbotPage />
          </motion.div>
        } />
        <Route path="/auth" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <AuthPage />
          </motion.div>
        } />
        <Route path="/interview-prep" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <InterviewPrepPage />
          </motion.div>
        } />
        <Route path="/resume-builder" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <ResumeBuilder />
          </motion.div>
        } />
        <Route path="/library" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <LibraryPage />
          </motion.div>
        } />
        <Route path="/about" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <AboutUs />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <UserProfile />
          </motion.div>
        } />
        <Route path="/pricing" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <PricingPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isResumeBuilderPage = location.pathname === '/resume-builder';
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* 1. Skip to main content link must be first in body/app */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main id="main-content" tabIndex="-1" style={{ flex: 1, paddingTop: isHomePage ? '0' : '100px' }} role="main">
          <AnimatedRoutes />
        </main>

        {!(isChatPage || isResumeBuilderPage) && <Footer />}
      </div>

      {/* Screen Reader - Text-to-Speech Feature */}
      <ScreenReader />

      {/* Chatbot quick launch button above voice control */}
      {!isChatPage && (
        <button
          type="button"
          onClick={() => navigate('/chat')}
          aria-label="Open full chatbot page"
          title="Open Chatbot"
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '250px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--accent-purple)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            zIndex: 9998,
          }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Voice Control - Hands-free Navigation */}
      <VoiceControl />

      {/* Motor Accessibility Toolbar - Section 7 */}
      <MotorAccessibilityToolbar />

      {/* Keyboard Shortcuts Help - Section 1.6 */}
      <KeyboardShortcutsHelp />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
