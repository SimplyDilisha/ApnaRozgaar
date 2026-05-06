import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Edit3, LogOut, Star, Shield, Settings, ChevronRight, BookOpen, Clock, CheckCircle, Loader2, Crown } from 'lucide-react';
import { AccessibleButton } from '../App';
import { useAuth } from '../context/AuthContext';
import { getCandidateProfile } from '../firebase/candidates';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, userProfile, userType, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    getCandidateProfile(user.uid).then(r => {
      setProfile(r.success ? r.data : userProfile);
      setLoading(false);
    });
  }, [user, authLoading, userProfile]);

  // Not logged in
  if (!authLoading && !isAuthenticated) return (
    <div style={{ maxWidth:'560px', margin:'100px auto', padding:'0 24px', textAlign:'center' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <div style={{ width:'96px', height:'96px', borderRadius:'50%', margin:'0 auto 28px', background:'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(20,184,166,0.15))', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <User size={42} color="var(--accent-purple)" />
        </div>
        <h1 style={{ fontSize:'1.8rem', marginBottom:'12px' }}>Sign in to view your profile</h1>
        <p style={{ color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'28px' }}>Build your profile, save jobs, and get matched with accessible employers.</p>
        <AccessibleButton onClick={() => navigate('/auth')} style={{ fontSize:'1rem', padding:'0 36px', minHeight:'52px' }}>Sign In / Create Account</AccessibleButton>
      </motion.div>
    </div>
  );

  if (loading || authLoading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh', flexDirection:'column', gap:'12px', color:'var(--text-muted)' }}>
      <Loader2 size={36} style={{ animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <p>Loading your profile…</p>
    </div>
  );

  const name = profile?.name || userProfile?.name || user?.displayName || 'User';
  const email = profile?.email || user?.email || '';
  const phone = profile?.phone || '';
  const city = profile?.city || '';
  const state = profile?.state || '';
  const skills = profile?.skills || [];
  const disabilities = Array.isArray(profile?.disabilityType) ? profile.disabilityType : profile?.disabilityType ? [profile.disabilityType] : [];
  const accommodations = profile?.accommodations || [];
  const workMode = profile?.workPreference || '';
  const expLevel = profile?.experienceLevel || '';
  const industries = profile?.industries || [];
  const hasProfile = !!(skills.length || city || disabilities.length);
  const joined = profile?.createdAt || userProfile?.createdAt;

  const card = { padding:'24px', borderRadius:'18px', background:'var(--bg-secondary)', border:'1px solid var(--border)' };
  const sectionTitle = { fontSize:'1rem', fontWeight:'700', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' };

  return (
    <div style={{ maxWidth:'960px', margin:'0 auto', padding:'36px 24px 80px' }}>

      {/* ── Hero Card ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ ...card, marginBottom:'28px', position:'relative', overflow:'hidden' }}>
        {/* Gradient banner */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'110px', background:'linear-gradient(135deg,rgba(139,92,246,0.14),rgba(20,184,166,0.1))', borderRadius:'18px 18px 0 0' }} />

        <div style={{ position:'relative', display:'flex', gap:'24px', alignItems:'flex-end', flexWrap:'wrap' }}>
          {/* Avatar */}
          <div style={{ width:'90px', height:'90px', borderRadius:'50%', background:'var(--primary-gradient)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', fontWeight:'800', flexShrink:0, border:'4px solid var(--bg-primary)', boxShadow:'0 6px 24px rgba(139,92,246,0.25)' }}>
            {name.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex:1, minWidth:'180px' }}>
            <h1 style={{ fontSize:'1.8rem', marginBottom:'6px' }}>{name}</h1>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'14px', color:'var(--text-muted)', fontSize:'0.88rem', marginBottom:'14px' }}>
              {email && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Mail size={13}/>{email}</span>}
              {phone && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Phone size={13}/>{phone}</span>}
              {(city||state) && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin size={13}/>{[city,state].filter(Boolean).join(', ')}</span>}
            </div>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {profile?.isPremium && (
                <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(255,215,0,0.15)', color:'#FFD700', display:'flex', alignItems:'center', gap:'4px' }}>
                  <Crown size={12}/> Premium Member
                </span>
              )}
              <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(5,150,105,0.1)', color:'var(--success)', display:'flex', alignItems:'center', gap:'4px' }}>
                <CheckCircle size={12}/> Email Verified
              </span>
              {userType && <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(139,92,246,0.1)', color:'var(--accent-purple)', textTransform:'capitalize' }}>{userType}</span>}
              {workMode && <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(20,184,166,0.1)', color:'var(--accent-teal)', textTransform:'capitalize' }}>{workMode}</span>}
            </div>
          </div>

          <div style={{ display:'flex', gap:'8px' }}>
            <AccessibleButton variant="outline" onClick={() => navigate('/profile/create')} style={{ fontSize:'0.85rem', padding:'0 14px', minHeight:'38px' }}>
              <Edit3 size={14}/> {hasProfile ? 'Edit' : 'Complete Profile'}
            </AccessibleButton>
            <AccessibleButton variant="ghost" onClick={async () => { await logout(); navigate('/'); }} style={{ fontSize:'0.85rem', padding:'0 14px', minHeight:'38px', color:'#ef4444' }}>
              <LogOut size={14}/> Sign Out
            </AccessibleButton>
          </div>
        </div>
      </motion.div>

      {/* Complete profile prompt */}
      {!hasProfile && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }} style={{ ...card, marginBottom:'28px', textAlign:'center', border:'2px dashed var(--accent-purple)', background:'rgba(139,92,246,0.04)' }}>
          <h2 style={{ color:'var(--accent-purple)', marginBottom:'8px' }}>Complete Your Profile</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:'20px', maxWidth:'480px', margin:'0 auto 20px' }}>Add your skills and preferences so employers can match you with accessible jobs.</p>
          <AccessibleButton onClick={() => navigate('/profile/create')}>Build My Profile <ChevronRight size={16}/></AccessibleButton>
        </motion.div>
      )}

      {/* Info grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px' }}>

        {/* Skills */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }} style={card}>
          <p style={sectionTitle}><Star size={18} color="var(--accent-purple)"/> Skills</p>
          {skills.length > 0 ? (
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {skills.map(s => <span key={s} style={{ padding:'5px 14px', borderRadius:'20px', fontSize:'0.83rem', fontWeight:'700', background:'var(--primary-gradient)', color:'white' }}>{s}</span>)}
            </div>
          ) : <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>No skills added yet.</p>}
        </motion.div>

        {/* Work Preferences */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }} style={card}>
          <p style={sectionTitle}><Briefcase size={18} color="var(--accent-teal)"/> Work Preferences</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', fontSize:'0.9rem' }}>
            {[['Work Mode', workMode],['Experience', expLevel]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'8px' }}>
                <span style={{ color:'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight:'600', textTransform:'capitalize' }}>{v || '—'}</span>
              </div>
            ))}
            {industries.length > 0 && (
              <div>
                <span style={{ color:'var(--text-muted)', fontSize:'0.85rem', display:'block', marginBottom:'8px' }}>Industries</span>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {industries.map(i => <span key={i} style={{ padding:'3px 12px', borderRadius:'14px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(20,184,166,0.1)', color:'var(--accent-teal)' }}>{i}</span>)}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Accessibility */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={card}>
          <p style={sectionTitle}><Shield size={18} color="var(--success)"/> Accessibility Needs</p>
          {disabilities.length > 0 ? (
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'14px' }}>
              {disabilities.map(d => <span key={d} style={{ padding:'5px 12px', borderRadius:'14px', fontSize:'0.82rem', fontWeight:'600', background:'rgba(5,150,105,0.1)', color:'var(--success)' }}>{d}</span>)}
            </div>
          ) : <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'10px' }}>Not specified.</p>}
          {accommodations.length > 0 && (
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
              {accommodations.map(a => <span key={a} style={{ padding:'3px 10px', borderRadius:'12px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(139,92,246,0.08)', color:'var(--accent-purple)' }}>{a}</span>)}
            </div>
          )}
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }} style={card}>
          <p style={sectionTitle}><Settings size={18} color="var(--text-muted)"/> Account</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', fontSize:'0.9rem' }}>
            {[
              ['Email', email],
              ['Verified', '✓ Yes'],
              ['Account Type', userType || 'Candidate'],
              ['Joined', joined ? new Date(joined).toLocaleDateString('en-IN',{month:'short',year:'numeric'}) : '—']
            ].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'8px' }}>
                <span style={{ color:'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight:'600', color: l==='Verified'?'var(--success)':'var(--text-primary)', textTransform: l==='Account Type'?'capitalize':'none', maxWidth:'60%', textAlign:'right', wordBreak:'break-all' }}>{v}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px', marginTop:'28px' }}>
        {[
          { to:'/jobs', icon:<Briefcase size={26} color="var(--accent-purple)"/>, title:'Browse Jobs', sub:'Find accessible opportunities' },
          { to:'/resume-builder', icon:<BookOpen size={26} color="var(--accent-teal)"/>, title:'AI Resume', sub:'Build your resume with AI' },
          { to:'/interview-prep', icon:<Clock size={26} color="var(--success)"/>, title:'Interview Prep', sub:'Practice with AI' }
        ].map(item => (
          <Link key={item.to} to={item.to} style={{ textDecoration:'none' }}>
            <motion.div whileHover={{ y:-4, boxShadow:'0 12px 36px rgba(0,0,0,0.1)' }} transition={{ type:'spring', stiffness:300 }}
              style={{ ...card, textAlign:'center', cursor:'pointer' }}>
              <div style={{ marginBottom:'10px' }}>{item.icon}</div>
              <p style={{ fontWeight:'700', fontSize:'0.95rem', marginBottom:'4px' }}>{item.title}</p>
              <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', margin:0 }}>{item.sub}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
