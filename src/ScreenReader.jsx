import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, Settings } from 'lucide-react';

/**
 * ScreenReader Component
 * Text-to-Speech feature that reads content on the screen aloud
 * Uses Web Speech API (SpeechSynthesis)
 */
export default function ScreenReader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  const utteranceRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        const voicesArray = Array.from(v);
        setVoices(voicesArray);
        
        // Prioritize Microsoft Ravi, then any English (India) voice, then any English voice
        const raviVoice = voicesArray.find(voice => voice.name.includes('Ravi'));
        const indianVoice = voicesArray.find(voice => voice.lang === 'en-IN' || voice.lang === 'en_IN');
        const englishVoice = voicesArray.find(voice => voice.lang.startsWith('en'));
        
        const bestVoice = raviVoice || indianVoice || englishVoice || voicesArray[0];
        setSelectedVoice(bestVoice);
        return true;
      }
      return false;
    };

    // Polling fallback as getVoices() can be empty initially
    if (!loadVoices()) {
      const interval = setInterval(() => {
        if (loadVoices()) clearInterval(interval);
      }, 100);
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Listen for text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection().toString().trim();
      if (selection) {
        setSelectedText(selection);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  const readPage = () => {
    const mainContent = document.querySelector('main') || document.body;
    const text = mainContent.innerText;
    speak(text);
  };

  const readSelection = () => {
    if (selectedText) {
      speak(selectedText);
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
        setCurrentWord(word);
      }
    };

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentWord('');
    };

    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentWord('');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentWord('');
  };

  return (
    <>
      {/* Floating Toggle Button with Label */}
      <div
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9998,
        }}
      >
        {/* Text Label */}
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.8 }}
          animate={{ 
            opacity: (isHovered || isReading) ? 1 : 0, 
            x: (isHovered || isReading) ? 0 : 20,
            scale: (isHovered || isReading) ? 1 : 0.8
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            background: 'var(--card-bg)',
            padding: '8px 14px',
            borderRadius: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            pointerEvents: (isHovered || isReading) ? 'auto' : 'none',
          }}
        >
          🔊 {isReading ? 'Reading...' : 'Read Aloud'}
        </motion.div>
        
        {/* Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="screen-reader-toggle"
          aria-label={isOpen ? 'Close screen reader' : 'Open screen reader'}
          aria-expanded={isOpen}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isReading ? 'var(--success)' : 'var(--accent-purple)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px var(--accent-purple-glow)',
            transition: 'all 0.3s ease',
          }}
        >
          {isReading ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.button>
      </div>

      {/* Screen Reader Panel */}
      {isOpen && (
        <div
          className="screen-reader-panel"
          role="dialog"
          aria-label="Screen Reader Controls"
          style={{
            position: 'fixed',
            bottom: '170px',
            right: '24px',
            width: '320px',
            background: 'var(--card-bg)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-color)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px',
            background: 'var(--accent-purple)',
            color: 'white',
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
              🔊 Screen Reader
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              Text-to-Speech Assistant
            </p>
          </div>

          {/* Current Word Display */}
          {isReading && currentWord && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(124, 58, 237, 0.1)',
              borderBottom: '1px solid var(--border-color)',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Now reading:</span>
              <p style={{ 
                margin: '4px 0 0', 
                fontSize: '1.2rem', 
                fontWeight: 600,
                color: 'var(--accent-purple)',
              }}>
                {currentWord}
              </p>
            </div>
          )}

          {/* Main Controls */}
          <div style={{ padding: '16px' }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={readPage}
                disabled={isReading}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent-purple)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: isReading ? 'not-allowed' : 'pointer',
                  opacity: isReading ? 0.6 : 1,
                }}
              >
                📄 Read Page
              </button>
              <button
                onClick={readSelection}
                disabled={!selectedText || isReading}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--accent-purple)',
                  background: 'transparent',
                  color: 'var(--accent-purple)',
                  fontWeight: 600,
                  cursor: (!selectedText || isReading) ? 'not-allowed' : 'pointer',
                  opacity: (!selectedText || isReading) ? 0.6 : 1,
                }}
              >
                ✂️ Read Selection
              </button>
            </div>

            {/* Selected Text Preview */}
            {selectedText && (
              <div style={{
                padding: '10px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                maxHeight: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                <strong>Selected:</strong> {selectedText.substring(0, 100)}
                {selectedText.length > 100 && '...'}
              </div>
            )}

            {/* Playback Controls */}
            {isReading && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}>
                <button
                  onClick={togglePause}
                  aria-label={isPaused ? 'Resume' : 'Pause'}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '2px solid var(--accent-purple)',
                    background: 'transparent',
                    color: 'var(--accent-purple)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
                <button
                  onClick={stop}
                  aria-label="Stop"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '2px solid var(--danger)',
                    background: 'var(--danger)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ⏹
                </button>
              </div>
            )}

            {/* Settings Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Settings size={16} />
              {showSettings ? 'Hide Settings' : 'Voice Settings'}
            </button>

            {/* Settings Panel */}
            {showSettings && (
              <div style={{ marginTop: '16px' }}>
                {/* Voice Selection */}
                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                    Voice
                  </span>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const voice = voices.find(v => v.name === e.target.value);
                      setSelectedVoice(voice);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </label>

                {/* Speed Control */}
                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    Speed <span>{rate}x</span>
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>

                {/* Pitch Control */}
                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    Pitch <span>{pitch}</span>
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>

                {/* Volume Control */}
                <label style={{ display: 'block' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    Volume <span>{Math.round(volume * 100)}%</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Help */}
          <div style={{
            padding: '12px 16px',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}>
            💡 <strong>Tip:</strong> Select any text and click "Read Selection"
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Hook for programmatic text-to-speech
 */
export function useTextToSpeech() {
  const speak = (text, options = {}) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => window.speechSynthesis.cancel();
  const pause = () => window.speechSynthesis.pause();
  const resume = () => window.speechSynthesis.resume();

  return { speak, stop, pause, resume };
}
