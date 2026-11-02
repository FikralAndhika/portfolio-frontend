import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, X, Eye, Github, ExternalLink, Mail, Linkedin,
  AlertCircle, Edit2, Trash2, Menu, ChevronLeft, ChevronRight,
  Shield, Cpu, Zap, Lock, User, Code2, VolumeX, Volume2
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend1-sooty.vercel.app';

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal(options = {}) {
  const ref = useRef(null);
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
        } else {
          // reset saat keluar viewport — animasi ulang saat scroll balik
          el.classList.remove('is-visible');
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/* ─────────────────────────────────────────
   REVEAL WRAPPER COMPONENT
───────────────────────────────────────── */
const Reveal = ({ children, direction = 'up', delay = 0, className = '', stagger = false, as: Tag = 'div', ...props }) => {
  const ref = useReveal();
  const delayClass = delay ? `reveal-delay-${delay}` : '';
  const dirClass   = stagger ? 'stagger-children' : `reveal reveal-${direction}`;
  return (
    <Tag ref={ref} className={`${dirClass} ${delayClass} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const SectionHeader = ({ label, title }) => {
  const lineRef = useReveal({ threshold: 0.5 });
  return (
    <div className="mb-12">
      <Reveal direction="left">
        <p className="section-label mb-2">{'// '}{label}</p>
      </Reveal>
      <Reveal direction="up" delay={1}>
        <h3 className="section-title text-3xl md:text-4xl font-orbitron font-bold">{title}</h3>
      </Reveal>
      <div ref={lineRef} className="cyber-divider mt-4 max-w-xs" />
    </div>
  );
};

const HudCorners = () => (
  <>
    <div className="hud-corner-tl" />
    <div className="hud-corner-br" />
  </>
);

/* ─────────────────────────────────────────
   SKILL BAR WITH REVEAL ANIMATION
───────────────────────────────────────── */
const SkillBar = ({ level }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('animate'), 100);
        } else {
          // reset saat keluar — animasi ulang saat scroll balik
          el.classList.remove('animate');
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="skill-bar-fill"
      style={{ '--skill-level': `${level}%` }}
    />
  );
};
/* ─────────────────────────────────────────
   IMAGE CAROUSEL
───────────────────────────────────────── */
const ImageCarousel = ({ images, projectTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const prev = () => setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));

  const onTouchStart = e => setTouchStart(e.touches[0].clientX);
  const onTouchMove  = e => setTouchEnd(e.touches[0].clientX);
  const onTouchEnd   = () => {
    if (!touchStart || !touchEnd) return;
    const d = touchStart - touchEnd;
    if (d > 50) next();
    if (d < -50) prev();
    setTouchStart(0); setTouchEnd(0);
  };

  if (!images || images.length === 0)
    return (
      <div className="w-full h-48 md:h-64 bg-cyber-navy flex items-center justify-center">
        <p className="font-mono-cyber text-sm" style={{ color: 'rgba(0,212,255,0.4)' }}>
          [ NO IMAGE DATA ]
        </p>
      </div>
    );

  if (images.length === 1)
    return (
      <img
        src={images[0]} alt={projectTitle}
        className="w-full h-56 md:h-96 object-contain bg-cyber-dark"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'; }}
      />
    );

  return (
    <div className="relative">
      <div
        className="relative h-56 md:h-96 overflow-hidden group"
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
        <img
          src={images[currentIndex]} alt={`${projectTitle} ${currentIndex + 1}`}
          className="w-full h-full object-contain bg-cyber-dark transition-all duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent" />

        <button onClick={prev} aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity btn-cyber-primary px-3 py-2 text-xs">
          <ChevronLeft size={18} />
        </button>
        <button onClick={next} aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity btn-cyber-primary px-3 py-2 text-xs">
          <ChevronRight size={18} />
        </button>

        <div className="absolute bottom-3 right-3 font-mono-cyber text-xs px-2 py-1"
          style={{ background: 'rgba(2,4,8,0.7)', color: 'var(--cyber-cyan)', border: '1px solid rgba(0,212,255,0.2)' }}>
          {currentIndex + 1}/{images.length}
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIndex(idx)} aria-label={`Image ${idx + 1}`}
              className={`h-1 rounded-none transition-all ${idx === currentIndex ? 'w-6 bg-cyber-cyan' : 'w-2 bg-white opacity-30'}`}
              style={idx === currentIndex ? { boxShadow: '0 0 6px var(--cyber-cyan)' } : {}} />
          ))}
        </div>
      </div>

      <div className="flex gap-2 p-3 overflow-x-auto bg-cyber-dark" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        {images.map((img, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)} aria-label={`Thumbnail ${idx + 1}`}
            className={`flex-shrink-0 w-16 h-16 overflow-hidden transition-all`}
            style={{
              border: idx === currentIndex ? '1px solid var(--cyber-cyan)' : '1px solid rgba(0,212,255,0.1)',
              boxShadow: idx === currentIndex ? '0 0 8px var(--glow-cyan)' : 'none',
              opacity: idx === currentIndex ? 1 : 0.5
            }}>
            <img src={img} alt="" className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'; }} />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  /* ── state ── */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword]               = useState('');
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(true);
  const [activeSection, setActiveSection]     = useState('home');
  const [saveStatus, setSaveStatus]           = useState('');
  const [showMobileMenu, setShowMobileMenu]   = useState(false);
  const [projectCategory, setProjectCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject]   = useState(null);
  const [editingExp, setEditingExp]           = useState(null);
  const [editingCert, setEditingCert]         = useState(null);
  const [editingSkillCategory, setEditingSkillCategory] = useState('');
  const [showLogin, setShowLogin]             = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showAboutForm, setShowAboutForm]     = useState(false);
  const [showSkillForm, setShowSkillForm]     = useState(false);
  const [showExpForm, setShowExpForm]         = useState(false);
  const [showCertForm, setShowCertForm]       = useState(false);
  const [isMuted, setIsMuted]                 = useState(false);
  const [showEnterSite, setShowEnterSite]     = useState(true);
  const audioRef                              = useRef(null);

  const correctPassword = 'admin123';

  const [projects, setProjects]           = useState([]);
  const [skills, setSkills]               = useState({});
  const [experiences, setExperiences]     = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [aboutData, setAboutData]         = useState({
    profileImage: '',
    bio1: 'Tuliskan bio kamu di sini.',
    bio2: '',
    stats: [
      { label: 'Years Experience', value: '2+' },
      { label: 'Projects Completed', value: '10+' },
      { label: 'Happy Clients', value: '15+' },
      { label: 'Technologies', value: '10+' },
    ],
  });

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', images: [], tags: '', github: '', demo: '', category: 'it',
  });
  const [expForm, setExpForm]   = useState({ year: '', position: '', company: '', description: '', achievements: '' });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', year: '', icon: '🎓' });
  const [skillForm, setSkillForm] = useState({ name: '', level: 50 });

  /* ── data loading ── */
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [projRes, aboutRes, skillsRes, expRes, certRes] = await Promise.all([
        axios.get(`${API_URL}/api/projects`),
        axios.get(`${API_URL}/api/about`),
        axios.get(`${API_URL}/api/skills`),
        axios.get(`${API_URL}/api/experiences`),
        axios.get(`${API_URL}/api/certifications`),
      ]);

      const normalizedProjects = Array.isArray(projRes.data)
        ? projRes.data.map(p => ({
            ...p,
            images: Array.isArray(p.images) ? p.images : p.images ? [p.images] : [],
            tags: Array.isArray(p.tags) ? p.tags : [],
          }))
        : [];
      setProjects(normalizedProjects);

      if (aboutRes.data) {
        setAboutData(prev => ({
          profileImage: aboutRes.data.profile_image || aboutRes.data.profileImage || prev.profileImage,
          bio1: aboutRes.data.bio1 || prev.bio1,
          bio2: aboutRes.data.bio2 || prev.bio2,
          stats: aboutRes.data.stats || prev.stats,
        }));
      }
      setSkills(skillsRes.data || {});
      setExperiences(Array.isArray(expRes.data) ? expRes.data : []);
      setCertifications(Array.isArray(certRes.data) ? certRes.data : []);
    } catch (err) {
      console.error('Error loading data:', err);
      setSaveStatus('[ ERROR ] Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadAllData(); }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    audio.loop   = true;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'certifications', 'projects'];
      const pos = window.scrollY + 150;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= pos) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnterSite = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
    }
    setShowEnterSite(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
  };

  const flash = (msg) => { setSaveStatus(msg); setTimeout(() => setSaveStatus(''), 3000); };

  /* ── auth ── */
  const handleLogin = () => {
    setError('');
    if (!password.trim()) { setError('Password required.'); return; }
    if (password === correctPassword) {
      setIsAuthenticated(true); setShowLogin(false); setPassword('');
    } else {
      setError('Access denied. Invalid credentials.'); setPassword('');
    }
  };

  /* ── image upload ── */
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) { alert('Max 5MB!'); return; }
    if (!file.type.startsWith('image/')) { alert('Images only!'); return; }
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.onerror  = () => alert('Upload failed!');
    reader.readAsDataURL(file);
  };

  /* ── about ── */
  const handleSaveAbout = async () => {
    try {
      await axios.put(`${API_URL}/api/about`, {
        profileImage: aboutData.profileImage,
        bio1: aboutData.bio1, bio2: aboutData.bio2, stats: aboutData.stats,
      });
      flash('[ OK ] Profile updated');
      setShowAboutForm(false);
      await loadAllData();
    } catch (err) {
      console.error(err); alert('Save failed!');
    }
  };

  /* ── projects ── */
  const handleAddProject = async () => {
    setError('');
    if (!projectForm.title.trim())       { setError('Title required.'); return; }
    if (!projectForm.description.trim()) { setError('Description required.'); return; }
    if (!projectForm.images.length)      { setError('At least 1 image required.'); return; }
    try {
      const data = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        images: projectForm.images,
        tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        github: projectForm.github.trim(),
        demo: projectForm.demo.trim(),
        category: projectForm.category,
      };
      if (editingProject) {
        await axios.put(`${API_URL}/api/projects?id=${editingProject.id}`, data);
        flash('[ OK ] Project updated'); setEditingProject(null);
      } else {
        await axios.post(`${API_URL}/api/projects`, data);
        flash('[ OK ] Project added');
      }
      await loadAllData();
      setProjectForm({ title: '', description: '', images: [], tags: '', github: '', demo: '', category: 'it' });
      setShowProjectForm(false);
    } catch (err) {
      console.error(err); setError(err.response?.data?.error || 'Save failed!');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title, description: project.description,
      images: Array.isArray(project.images) ? [...project.images] : project.images ? [project.images] : [],
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
      github: project.github || '', demo: project.demo || '',
      category: project.category || 'it',
    });
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API_URL}/api/projects?id=${id}`);
      flash('[ OK ] Project deleted'); await loadAllData();
    } catch (err) { console.error(err); alert('Delete failed!'); }
  };

  /* ── experience ── */
  const handleAddExperience = async () => {
    setError('');
    if (!expForm.position.trim() || !expForm.company.trim()) { setError('Position and Company required.'); return; }
    try {
      const data = {
        year: expForm.year.trim(), position: expForm.position.trim(),
        company: expForm.company.trim(), description: expForm.description.trim(),
        achievements: expForm.achievements.split('\n').map(a => a.trim()).filter(Boolean),
      };
      if (editingExp) {
        await axios.put(`${API_URL}/api/experiences?id=${editingExp.id}`, data);
        flash('[ OK ] Experience updated'); setEditingExp(null);
      } else {
        await axios.post(`${API_URL}/api/experiences`, data);
        flash('[ OK ] Experience added');
      }
      await loadAllData();
      setExpForm({ year: '', position: '', company: '', description: '', achievements: '' });
      setShowExpForm(false);
    } catch (err) { console.error(err); setError('Save failed!'); }
  };

  const handleEditExperience = (exp) => {
    setEditingExp(exp);
    setExpForm({ year: exp.year, position: exp.position, company: exp.company,
      description: exp.description, achievements: exp.achievements.join('\n') });
    setShowExpForm(true);
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await axios.delete(`${API_URL}/api/experiences?id=${id}`);
      flash('[ OK ] Experience deleted'); await loadAllData();
    } catch (err) { console.error(err); }
  };

  /* ── certifications ── */
  const handleAddCertification = async () => {
    setError('');
    if (!certForm.title.trim() || !certForm.issuer.trim()) { setError('Title and Issuer required.'); return; }
    try {
      if (editingCert) {
        await axios.put(`${API_URL}/api/certifications?id=${editingCert.id}`, certForm);
        flash('[ OK ] Certification updated'); setEditingCert(null);
      } else {
        await axios.post(`${API_URL}/api/certifications`, certForm);
        flash('[ OK ] Certification added');
      }
      await loadAllData();
      setCertForm({ title: '', issuer: '', year: '', icon: '🎓' });
      setShowCertForm(false);
    } catch (err) { console.error(err); setError('Save failed!'); }
  };

  const handleEditCertification = (cert) => {
    setEditingCert(cert);
    setCertForm({ title: cert.title, issuer: cert.issuer, year: cert.year, icon: cert.icon });
    setShowCertForm(true);
  };

  const handleDeleteCertification = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await axios.delete(`${API_URL}/api/certifications?id=${id}`);
      flash('[ OK ] Certification deleted'); await loadAllData();
    } catch (err) { console.error(err); }
  };

  /* ── skills ── */
  const handleAddSkill = async () => {
    setError('');
    if (!skillForm.name.trim()) { setError('Skill name required.'); return; }
    try {
      await axios.post(`${API_URL}/api/skills`, {
        category: editingSkillCategory, name: skillForm.name, level: skillForm.level,
      });
      flash('[ OK ] Skill added'); await loadAllData();
      setSkillForm({ name: '', level: 50 }); setShowSkillForm(false);
    } catch (err) { console.error(err); setError('Save failed!'); }
  };

  const handleDeleteSkill = async (category, index) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const skill = skills[category][index];
      await axios.delete(`${API_URL}/api/skills?id=${skill.id}`);
      flash('[ OK ] Skill deleted'); await loadAllData();
    } catch (err) { console.error(err); }
  };

  const filteredProjects = projects.filter(p => projectCategory === 'all' || p.category === projectCategory);
  const NAV_SECTIONS = ['home', 'about', 'skills', 'experience', 'certifications', 'projects'];

  /* ─────────────────────────────────────────
     LOADING SCREEN
  ───────────────────────────────────────── */
  if (loading || showEnterSite) return (
    <div className="min-h-screen bg-cyber-black bg-cyber-grid flex items-center justify-center"
      style={{ backgroundSize: '40px 40px' }}>

      <audio ref={audioRef} src="/music/moodgame.mp3" loop preload="auto" />

      <div className="text-center px-8">
        {/* spinner — fade out saat ready */}
        <div style={{ transition: 'opacity 0.6s ease, transform 0.6s ease', opacity: loading ? 1 : 0, transform: loading ? 'translateY(0)' : 'translateY(-16px)', pointerEvents: 'none', position: loading ? 'relative' : 'absolute' }}>
          <div className="relative mx-auto mb-8" style={{ width: 80, height: 80 }}>
            <div className="loading-ring absolute inset-0 rounded-full" style={{ width: 80, height: 80 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu size={28} style={{ color: 'var(--cyber-cyan)' }} />
            </div>
          </div>
          <p className="font-mono-cyber text-sm mb-1" style={{ color: 'var(--cyber-cyan)' }}>
            INITIALIZING SYSTEM
          </p>
          <p className="font-mono-cyber text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>
            Loading portfolio data...
          </p>
        </div>

        {/* enter site — fade in saat ready */}
        <div style={{ transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s', opacity: loading ? 0 : 1, transform: loading ? 'translateY(16px)' : 'translateY(0)', pointerEvents: loading ? 'none' : 'auto', position: loading ? 'absolute' : 'relative' }}>
          <div className="relative mx-auto mb-8" style={{ width: 80, height: 80 }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu size={28} style={{ color: 'var(--cyber-neon)' }} />
            </div>
          </div>
          <p className="font-mono-cyber text-sm mb-1" style={{ color: 'var(--cyber-neon)' }}>
            SYSTEM READY
          </p>
          <p className="font-mono-cyber text-xs mb-8" style={{ color: 'rgba(0,212,255,0.4)' }}>
            Portfolio data loaded.
          </p>
          <button onClick={handleEnterSite}
            className="btn-cyber-primary mx-auto text-sm px-10 py-4">
            ENTER SITE
          </button>
        </div>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     MAIN RENDER
  ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-cyber-black scanlines" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 60%)' }}>

      {/* Audio player */}
      <audio ref={audioRef} src="/music/moodgame.mp3" loop preload="auto" />

      {/* Grid background */}
      <div className="fixed inset-0 bg-cyber-grid pointer-events-none" style={{ backgroundSize: '40px 40px', zIndex: 0 }} />

      {/* Save status toast */}
      {saveStatus && (
        <div className="fixed top-4 right-4 z-50 font-mono-cyber text-xs px-4 py-2 animate-fade-in-up"
          style={{ background: 'rgba(2,4,8,0.9)', border: '1px solid var(--cyber-neon)', color: 'var(--cyber-neon)', boxShadow: '0 0 20px var(--glow-neon)' }}>
          {saveStatus}
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40" style={{ background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        {/* top accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--cyber-cyan), var(--cyber-neon), transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo / Name */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 border border-cyber-cyan opacity-60 rotate-45" style={{ borderColor: 'var(--cyber-cyan)' }} />
                <div className="absolute inset-1 border border-cyber-cyan opacity-30 rotate-45" style={{ borderColor: 'var(--cyber-cyan)' }} />
                <Code2 size={14} className="absolute inset-0 m-auto" style={{ color: 'var(--cyber-cyan)' }} />
              </div>
              <div
                onDoubleClick={() => !isAuthenticated && setShowLogin(true)}
                title="Double click for admin"
                className="cursor-pointer select-none"
              >
                <h1 className="font-orbitron font-bold text-white leading-none" style={{ fontSize: '0.95rem', letterSpacing: '1px' }}>
                  FIKRAL ANDHIKA
                </h1>
                <p className="font-mono-cyber text-xs mt-0.5" style={{ color: 'var(--cyber-cyan)', opacity: 0.7 }}>
                  WEB_DEV :: DATA_ANALYST
                </p>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_SECTIONS.map(s => (
                <button key={s} onClick={() => scrollTo(s)}
                  className={`nav-link ${activeSection === s ? 'active' : ''}`}>
                  {s}
                </button>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <a href="mailto:email@example.com" aria-label="Email"
                className="hidden md:flex w-8 h-8 items-center justify-center transition-all"
                style={{ border: '1px solid rgba(0,212,255,0.2)', color: 'rgba(200,214,229,0.6)' }}
                onMouseOver={e => { e.currentTarget.style.color = 'var(--cyber-cyan)'; e.currentTarget.style.boxShadow = '0 0 10px var(--glow-cyan)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'rgba(200,214,229,0.6)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Mail size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="hidden md:flex w-8 h-8 items-center justify-center transition-all"
                style={{ border: '1px solid rgba(0,212,255,0.2)', color: 'rgba(200,214,229,0.6)' }}
                onMouseOver={e => { e.currentTarget.style.color = 'var(--cyber-cyan)'; e.currentTarget.style.boxShadow = '0 0 10px var(--glow-cyan)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'rgba(200,214,229,0.6)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Github size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="hidden md:flex w-8 h-8 items-center justify-center transition-all"
                style={{ border: '1px solid rgba(0,212,255,0.2)', color: 'rgba(200,214,229,0.6)' }}
                onMouseOver={e => { e.currentTarget.style.color = 'var(--cyber-cyan)'; e.currentTarget.style.boxShadow = '0 0 10px var(--glow-cyan)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'rgba(200,214,229,0.6)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Linkedin size={16} />
              </a>
              {isAuthenticated && (
                <button onClick={() => setIsAuthenticated(false)}
                  className="hidden md:flex items-center gap-1 font-mono-cyber text-xs px-3 py-1.5 transition-all"
                  style={{ border: '1px solid var(--cyber-magenta)', color: 'var(--cyber-magenta)' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,0,110,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <Lock size={12} /> LOGOUT
                </button>
              )}
              {/* Music toggle */}
              <button onClick={toggleMute} title={isMuted ? 'Play music' : 'Mute music'}
                className="w-8 h-8 flex items-center justify-center transition-all"
                style={{ border: `1px solid ${isMuted ? 'rgba(0,212,255,0.2)' : 'var(--cyber-neon)'}`, color: isMuted ? 'rgba(200,214,229,0.4)' : 'var(--cyber-neon)', boxShadow: isMuted ? 'none' : '0 0 8px var(--glow-neon)' }}>
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button onClick={() => setShowMobileMenu(true)} className="md:hidden" style={{ color: 'var(--cyber-cyan)' }}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden mobile-menu-overlay">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              <span className="font-orbitron font-bold" style={{ color: 'var(--cyber-cyan)' }}>NAVIGATION</span>
              <button onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--cyber-cyan)' }}><X size={24} /></button>
            </div>
            <nav className="flex-1 flex flex-col p-8 gap-2">
              {NAV_SECTIONS.map(s => (
                <button key={s} onClick={() => { scrollTo(s); setShowMobileMenu(false); }}
                  className={`text-left py-4 font-rajdhani font-semibold text-xl uppercase tracking-widest transition-all ${activeSection === s ? 'text-neon-cyan' : ''}`}
                  style={{ color: activeSection === s ? 'var(--cyber-cyan)' : 'rgba(200,214,229,0.5)', borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                  <span className="font-mono-cyber text-xs mr-3" style={{ color: 'var(--cyber-cyan)', opacity: 0.5 }}>{'>'}</span>
                  {s}
                </button>
              ))}
            </nav>
            <div className="p-6 flex gap-4 items-center" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
              <a href="mailto:email@example.com" style={{ color: 'rgba(200,214,229,0.5)' }}><Mail size={22} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(200,214,229,0.5)' }}><Github size={22} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(200,214,229,0.5)' }}><Linkedin size={22} /></a>
              {isAuthenticated && (
                <button onClick={() => { setIsAuthenticated(false); setShowMobileMenu(false); }}
                  className="ml-auto flex items-center gap-1 font-mono-cyber text-xs px-3 py-1.5"
                  style={{ border: '1px solid var(--cyber-magenta)', color: 'var(--cyber-magenta)' }}>
                  <Lock size={12} /> LOGOUT
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <main className="relative z-10">

        {/* ── HERO ── */}
        <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center relative px-6 overflow-hidden">
          {/* decorative orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* status badge */}
            <Reveal direction="down">
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 font-mono-cyber text-xs"
                style={{ border: '1px solid rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.04)', color: 'var(--cyber-neon)' }}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                SYSTEM ONLINE — AVAILABLE FOR HIRE
              </div>
            </Reveal>

            {/* main title */}
            <Reveal direction="up" delay={1}>
              <h2 className="font-orbitron font-black text-white mb-2 leading-none"
                style={{ fontSize: 'clamp(1.8rem, 7vw, 5.5rem)', letterSpacing: '-1px' }}>
                FIKRAL ANDHIKA
              </h2>
            </Reveal>
            <Reveal direction="up" delay={2}>
              <h2 className="font-orbitron font-black mb-6 leading-none"
                style={{ fontSize: 'clamp(1.8rem, 7vw, 5.5rem)', letterSpacing: '-1px', background: 'linear-gradient(135deg, var(--cyber-cyan), var(--cyber-neon))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                RAMADHANI
              </h2>
            </Reveal>

            <Reveal direction="fade" delay={3}>
              <p className="font-mono-cyber mb-10 mx-auto max-w-lg leading-relaxed"
                style={{ color: 'rgba(200,214,229,0.5)', fontSize: '0.85rem' }}>
                {'>'} Web Developer &amp; Data Analyst<br />
                {'>'} Automotive Enthusiast
              </p>
            </Reveal>

            {/* divider with diamond */}
            <Reveal direction="fade" delay={3}>
              <div className="cyber-divider mb-10 mx-auto max-w-xs" />
            </Reveal>

            {/* CTA buttons */}
            <Reveal direction="up" delay={4}>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="btn-cyber-primary" onClick={() => scrollTo('projects')}>
                  VIEW PROJECTS
                </button>
                <button className="btn-cyber-secondary" onClick={() => scrollTo('about')}>
                  ABOUT ME
                </button>
              </div>
            </Reveal>

            {/* scroll indicator */}
            <Reveal direction="fade" delay={5}>
              <div className="mt-10 flex flex-col items-center gap-2">
                <p className="font-mono-cyber text-xs" style={{ color: 'rgba(0,212,255,0.3)' }}>SCROLL</p>
                <div className="scroll-indicator" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-start justify-between">
            <SectionHeader label="01 / PROFILE" title="About Me" />
            {isAuthenticated && (
              <button className="btn-cyber-primary text-xs flex items-center gap-2 px-4 py-2 mt-2"
                onClick={() => setShowAboutForm(true)}>
                <Edit2 size={14} /> EDIT
              </button>
            )}
          </div>

          {/* ── ABOUT HERO LAYOUT ── */}
          <div className="relative overflow-hidden" style={{
            background: 'transparent',
            border: '1px solid rgba(0,212,255,0.08)',
          }}>

            {/* subtle grid */}
            <div className="absolute inset-0 bg-cyber-grid pointer-events-none" style={{ backgroundSize: '40px 40px', opacity: 0.3 }} />

            {/* HUD corners */}
            <div className="absolute top-4 left-4 pointer-events-none" style={{ width: 24, height: 24, borderTop: '1px solid rgba(0,212,255,0.4)', borderLeft: '1px solid rgba(0,212,255,0.4)' }} />
            <div className="absolute top-4 right-4 pointer-events-none" style={{ width: 24, height: 24, borderTop: '1px solid rgba(0,212,255,0.4)', borderRight: '1px solid rgba(0,212,255,0.4)' }} />
            <div className="absolute bottom-4 left-4 pointer-events-none" style={{ width: 24, height: 24, borderBottom: '1px solid rgba(0,212,255,0.4)', borderLeft: '1px solid rgba(0,212,255,0.4)' }} />
            <div className="absolute bottom-4 right-4 pointer-events-none" style={{ width: 24, height: 24, borderBottom: '1px solid rgba(0,212,255,0.4)', borderRight: '1px solid rgba(0,212,255,0.4)' }} />

            <div className="relative grid grid-cols-1 sm:grid-cols-3 items-center" style={{ minHeight: 'auto' }}>

              {/* ── LEFT: name + button only ── */}
              <Reveal direction="left" className="p-6 sm:p-10 text-center sm:text-left self-center order-2 sm:order-none">
                <p className="font-mono-cyber text-sm mb-2" style={{ color: 'var(--cyber-cyan)' }}>
                  Hi, I'm
                </p>
                <h2 className="font-orbitron font-black text-white mb-8 leading-tight"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                  Fikral Andhika<br />
                  <span style={{ background: 'linear-gradient(135deg, var(--cyber-cyan), var(--cyber-neon))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Ramadhani
                  </span>
                </h2>
                <div className="flex justify-center sm:justify-start">
                  <button className="btn-cyber-primary text-xs flex items-center gap-2"
                    onClick={() => scrollTo('projects')}>
                    <Code2 size={14} /> VIEW PROJECTS
                  </button>
                </div>
              </Reveal>

              {/* ── CENTER: photo ── */}
              <Reveal direction="up" className="relative flex justify-center items-end order-first sm:order-none">
                {/* ground glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ width: '90%', height: 80, background: 'radial-gradient(ellipse, rgba(0,212,255,0.25) 0%, transparent 70%)', filter: 'blur(12px)' }} />

                {aboutData.profileImage ? (
                  <div className="relative group flex justify-center w-full">
                    <img
                      src={aboutData.profileImage}
                      alt="Fikral Andhika"
                      style={{
                        height: 'clamp(260px, 48vw, 520px)',
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center bottom',
                        display: 'block',
                        filter: 'drop-shadow(0 0 40px rgba(0,212,255,0.2)) drop-shadow(0 -10px 60px rgba(0,212,255,0.06))',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                    {isAuthenticated && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        style={{ background: 'rgba(2,4,8,0.6)', backdropFilter: 'blur(4px)' }}>
                        <button className="btn-cyber-primary text-xs" onClick={() => setShowAboutForm(true)}>
                          CHANGE PHOTO
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <User size={80} style={{ color: 'rgba(0,212,255,0.15)' }} />
                    {isAuthenticated && (
                      <button className="btn-cyber-primary text-xs mt-6" onClick={() => setShowAboutForm(true)}>
                        UPLOAD PHOTO
                      </button>
                    )}
                  </div>
                )}
              </Reveal>

              {/* ── RIGHT: bio only ── */}
              <Reveal direction="right" className="p-6 sm:p-10 text-center sm:text-left self-center order-3 sm:order-none">
                <p className="section-label mb-3">BIO.TXT</p>
                <div className="w-8 h-px mb-4" style={{ background: 'var(--cyber-cyan)' }} />
                <p className="text-gray-400 text-sm leading-relaxed mb-4" style={{ maxWidth: 280 }}>
                  {aboutData.bio1}
                </p>
                {aboutData.bio2 && (
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ maxWidth: 280 }}>
                    {aboutData.bio2}
                  </p>
                )}
              </Reveal>
            </div>

            {/* ── BOTTOM: 4 stats berjajar ── */}
            <Reveal stagger className="grid grid-cols-2 md:grid-cols-4"
              style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
              {aboutData.stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-5 px-4"
                  style={{
                    borderRight: '1px solid rgba(0,212,255,0.08)',
                    borderBottom: i < 2 ? '1px solid rgba(0,212,255,0.08)' : 'none',
                  }}>
                  <span className="font-orbitron font-bold text-2xl md:text-3xl mb-1"
                    style={{ color: i % 2 === 0 ? 'var(--cyber-cyan)' : 'var(--cyber-neon)' }}>
                    {stat.value}
                  </span>
                  <span className="font-mono-cyber text-xs text-center" style={{ color: 'rgba(200,214,229,0.35)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="max-w-7xl mx-auto px-6 py-24">
          <SectionHeader label="02 / CAPABILITIES" title="My Skills" />

          <Reveal stagger className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(skills).map((category, catIdx) => (
              <div key={category} className="cyber-panel relative p-6">
                <HudCorners />
                {/* category header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6" style={{ background: catIdx % 3 === 0 ? 'var(--cyber-cyan)' : catIdx % 3 === 1 ? 'var(--cyber-neon)' : 'var(--cyber-magenta)' }} />
                    <h4 className="font-rajdhani font-bold uppercase tracking-widest text-white">{category}</h4>
                  </div>
                  {isAuthenticated && (
                    <button onClick={() => { setEditingSkillCategory(category); setShowSkillForm(true); }}
                      className="w-7 h-7 flex items-center justify-center transition-all"
                      style={{ border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyber-cyan)' }}>
                      <Plus size={14} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {skills[category].map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono-cyber text-xs" style={{ color: 'rgba(200,214,229,0.7)' }}>
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-cyber text-xs" style={{ color: 'var(--cyber-cyan)' }}>
                            {skill.level}%
                          </span>
                          {isAuthenticated && (
                            <button onClick={() => handleDeleteSkill(category, idx)}
                              className="w-4 h-4 flex items-center justify-center"
                              style={{ color: 'var(--cyber-magenta)' }}>
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="skill-bar-track">
                        <SkillBar level={skill.level} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-start justify-between">
            <SectionHeader label="03 / HISTORY" title="Experience" />
            {isAuthenticated && (
              <button className="btn-cyber-primary text-xs flex items-center gap-2 px-4 py-2 mt-2"
                onClick={() => setShowExpForm(true)}>
                <Plus size={14} /> ADD
              </button>
            )}
          </div>

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <Reveal key={exp.id} direction="up" delay={Math.min(i + 1, 3)}>
                <div className="cyber-panel relative p-6 md:p-8 group">
                <HudCorners />
                {/* index badge */}
                <div className="absolute top-6 left-6 font-mono-cyber text-xs"
                  style={{ color: 'rgba(0,212,255,0.3)' }}>
                  [{String(i + 1).padStart(2, '0')}]
                </div>

                {isAuthenticated && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditExperience(exp)}
                      className="w-7 h-7 flex items-center justify-center"
                      style={{ border: '1px solid rgba(0,212,255,0.3)', color: 'var(--cyber-cyan)' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDeleteExperience(exp.id)}
                      className="w-7 h-7 flex items-center justify-center"
                      style={{ border: '1px solid rgba(255,0,110,0.3)', color: 'var(--cyber-magenta)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}

                <div className="pl-12">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                    <div>
                      <h4 className="font-rajdhani font-bold text-xl text-white">{exp.position}</h4>
                      <p className="font-mono-cyber text-xs mt-1" style={{ color: 'var(--cyber-cyan)' }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="font-mono-cyber text-xs px-3 py-1 flex-shrink-0"
                      style={{ border: '1px solid rgba(0,212,255,0.15)', color: 'rgba(0,212,255,0.6)', background: 'rgba(0,212,255,0.03)' }}>
                      {exp.year}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed"
                      style={{ wordBreak: 'break-word' }}>
                      {exp.description}
                    </p>
                  )}

                  {exp.achievements?.length > 0 && (
                    <div>
                      <p className="font-mono-cyber text-xs mb-3" style={{ color: 'rgba(0,212,255,0.5)' }}>
                        {'// KEY_ACHIEVEMENTS'}
                      </p>
                      <ul className="space-y-2">
                        {exp.achievements.map((ach, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="flex-shrink-0 mt-1" style={{ color: 'var(--cyber-neon)' }}>▸</span>
                            <span className="text-gray-400 text-sm leading-relaxed"
                              style={{ wordBreak: 'break-word' }}>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section id="certifications" className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-start justify-between">
            <SectionHeader label="04 / CREDENTIALS" title="Certifications" />
            {isAuthenticated && (
              <button className="btn-cyber-primary text-xs flex items-center gap-2 px-4 py-2 mt-2"
                onClick={() => setShowCertForm(true)}>
                <Plus size={14} /> ADD
              </button>
            )}
          </div>

          <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map(cert => (
              <div key={cert.id} className="cert-card p-6 group relative">
                {isAuthenticated && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditCertification(cert)}
                      className="w-7 h-7 flex items-center justify-center"
                      style={{ border: '1px solid rgba(0,212,255,0.3)', color: 'var(--cyber-cyan)' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDeleteCertification(cert.id)}
                      className="w-7 h-7 flex items-center justify-center"
                      style={{ border: '1px solid rgba(255,0,110,0.3)', color: 'var(--cyber-magenta)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
                    {cert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-rajdhani font-bold text-white text-sm mb-1 leading-tight">{cert.title}</h4>
                    <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(200,214,229,0.4)' }}>{cert.issuer}</p>
                    <span className="font-mono-cyber text-xs" style={{ color: 'var(--cyber-cyan)' }}>{cert.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-start justify-between">
            <SectionHeader label="05 / PORTFOLIO" title="My Projects" />
            {isAuthenticated && (
              <button className="btn-cyber-primary text-xs flex items-center gap-2 px-4 py-2 mt-2"
                onClick={() => setShowProjectForm(true)}>
                <Plus size={14} /> ADD PROJECT
              </button>
            )}
          </div>

          {/* filter tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {['all', 'it', 'automotive'].map(cat => (
              <button key={cat} onClick={() => setProjectCategory(cat)}
                className="font-mono-cyber text-xs px-5 py-2 transition-all"
                style={{
                  border: `1px solid ${projectCategory === cat ? 'var(--cyber-cyan)' : 'rgba(0,212,255,0.15)'}`,
                  color: projectCategory === cat ? 'var(--cyber-cyan)' : 'rgba(200,214,229,0.4)',
                  background: projectCategory === cat ? 'rgba(0,212,255,0.08)' : 'transparent',
                  boxShadow: projectCategory === cat ? '0 0 10px rgba(0,212,255,0.1)' : 'none',
                }}>
                {cat === 'all' ? 'ALL' : cat === 'it' ? 'IT & DEV' : 'AUTOMOTIVE'}
              </button>
            ))}
          </div>

          <Reveal stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card cyber-panel group relative">
                {/* image */}
                <div className="relative overflow-hidden" style={{ height: 180 }}>
                  <img
                    src={Array.isArray(project.images) && project.images.length > 0
                      ? project.images[0]
                      : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: 'brightness(0.85)' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'; }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,4,8,0.9) 0%, transparent 60%)' }} />

                  {/* category badge */}
                  <div className="absolute top-3 left-3 font-mono-cyber text-xs px-2 py-0.5"
                    style={{ background: 'rgba(2,4,8,0.8)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyber-cyan)' }}>
                    {project.category === 'it' ? 'IT_DEV' : 'AUTO'}
                  </div>

                  {isAuthenticated && (
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditProject(project)}
                        className="w-7 h-7 flex items-center justify-center"
                        style={{ background: 'rgba(2,4,8,0.9)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--cyber-cyan)' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDeleteProject(project.id)}
                        className="w-7 h-7 flex items-center justify-center"
                        style={{ background: 'rgba(2,4,8,0.9)', border: '1px solid rgba(255,0,110,0.3)', color: 'var(--cyber-magenta)' }}>
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* content */}
                <div className="p-5">
                  <h4 className="font-rajdhani font-bold text-white text-lg mb-2">{project.title}</h4>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>

                  {/* tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(project.tags || []).map((tag, i) => (
                      <span key={i} className="cyber-tag">{tag}</span>
                    ))}
                  </div>

                  {/* actions */}
                  <div className="flex gap-2 pt-4" style={{ borderTop: '1px solid rgba(0,212,255,0.06)' }}>
                    <button onClick={() => setSelectedProject(project)}
                      className="flex-1 flex items-center justify-center gap-2 font-mono-cyber text-xs py-2 transition-all"
                      style={{ border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyber-cyan)' }}
                      onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
                      <Eye size={14} /> VIEW
                    </button>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="w-9 flex items-center justify-center transition-all"
                        style={{ border: '1px solid rgba(0,212,255,0.15)', color: 'rgba(200,214,229,0.5)' }}
                        onMouseOver={e => { e.currentTarget.style.color = 'var(--cyber-cyan)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; }}
                        onMouseOut={e => { e.currentTarget.style.color = 'rgba(200,214,229,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; }}>
                        <Github size={16} />
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="w-9 flex items-center justify-center transition-all"
                        style={{ border: '1px solid rgba(0,212,255,0.15)', color: 'rgba(200,214,229,0.5)' }}
                        onMouseOver={e => { e.currentTarget.style.color = 'var(--cyber-neon)'; e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)'; }}
                        onMouseOut={e => { e.currentTarget.style.color = 'rgba(200,214,229,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; }}>
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </section>
      </main>

      {/* ─────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────── */}
      <footer className="relative z-10 mt-12" style={{ borderTop: '1px solid rgba(0,212,255,0.06)', background: 'rgba(2,4,8,0.8)' }}>
        <div className="h-px w-full mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--cyber-cyan), var(--cyber-neon), transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono-cyber text-xs" style={{ color: 'rgba(200,214,229,0.3)' }}>
            © 2025 FIKRAL ANDHIKA RAMADHANI — BUILT WITH REACT
          </p>
          <div className="flex items-center gap-2 font-mono-cyber text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--cyber-neon)' }} />
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════
          MODALS
      ═══════════════════════════════════════ */}

      {/* ── LOGIN MODAL ── */}
      {showLogin && (
        <div className="fixed inset-0 z-50 cyber-modal-overlay flex items-center justify-center p-6">
          <div className="relative w-full max-w-md cyber-panel p-8">
            <HudCorners />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Shield size={20} style={{ color: 'var(--cyber-cyan)' }} />
                <span className="font-orbitron font-bold text-white text-sm">ADMIN ACCESS</span>
              </div>
              <button onClick={() => { setShowLogin(false); setError(''); setPassword(''); }}
                style={{ color: 'rgba(200,214,229,0.4)' }}><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 font-mono-cyber text-xs p-3"
                style={{ border: '1px solid rgba(255,0,110,0.3)', background: 'rgba(255,0,110,0.05)', color: 'var(--cyber-magenta)' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="mb-2">
              <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>
                {'>'} ENTER_PASSWORD:
              </p>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleLogin()}
                className="cyber-input" placeholder="••••••••" autoFocus
              />
            </div>

            <button className="btn-cyber-primary w-full mt-6 flex items-center justify-center gap-2"
              onClick={handleLogin}>
              <Lock size={14} /> AUTHENTICATE
            </button>
            <p className="font-mono-cyber text-xs mt-4 text-center"
              style={{ color: 'rgba(200,214,229,0.2)' }}>
              default: admin123
            </p>
          </div>
        </div>
      )}

      {/* ── ABOUT EDIT MODAL ── */}
      {showAboutForm && (
        <div className="fixed inset-0 z-50 cyber-modal-overlay flex items-center justify-center p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl cyber-panel p-8 my-8 max-h-[90vh] overflow-y-auto">
            <HudCorners />
            <div className="flex items-center justify-between mb-6">
              <span className="font-orbitron font-bold text-white text-sm">EDIT PROFILE</span>
              <button onClick={() => setShowAboutForm(false)} style={{ color: 'rgba(200,214,229,0.4)' }}>
                <X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>PROFILE_PHOTO</p>
                <div className="flex items-center gap-4">
                  {aboutData.profileImage && (
                    <img src={aboutData.profileImage} alt="Preview"
                      className="w-16 h-16 object-cover" style={{ border: '1px solid rgba(0,212,255,0.2)' }} />
                  )}
                  <label className="btn-cyber-primary text-xs cursor-pointer flex items-center gap-2 px-4 py-2">
                    <Plus size={14} /> {aboutData.profileImage ? 'CHANGE' : 'UPLOAD'}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => handleImageUpload(e, img => setAboutData({ ...aboutData, profileImage: img }))} />
                  </label>
                </div>
              </div>

              <div>
                <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>BIO_01</p>
                <textarea value={aboutData.bio1}
                  onChange={e => setAboutData({ ...aboutData, bio1: e.target.value })}
                  className="cyber-input" style={{ height: 80 }} />
              </div>
              <div>
                <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>BIO_02</p>
                <textarea value={aboutData.bio2}
                  onChange={e => setAboutData({ ...aboutData, bio2: e.target.value })}
                  className="cyber-input" style={{ height: 80 }} />
              </div>

              <div style={{ borderTop: '1px solid rgba(0,212,255,0.08)', paddingTop: 16 }}>
                <p className="font-mono-cyber text-xs mb-3" style={{ color: 'rgba(0,212,255,0.5)' }}>STATISTICS</p>
                <div className="grid grid-cols-2 gap-3">
                  {aboutData.stats.map((stat, idx) => (
                    <div key={idx} className="cyber-panel p-3">
                      <input type="text" value={stat.value}
                        onChange={e => {
                          const s = [...aboutData.stats]; s[idx].value = e.target.value;
                          setAboutData({ ...aboutData, stats: s });
                        }}
                        className="cyber-input mb-2" style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                        placeholder="Value" />
                      <input type="text" value={stat.label}
                        onChange={e => {
                          const s = [...aboutData.stats]; s[idx].label = e.target.value;
                          setAboutData({ ...aboutData, stats: s });
                        }}
                        className="cyber-input" style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                        placeholder="Label" />
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-cyber-secondary w-full flex items-center justify-center gap-2 mt-2"
                onClick={handleSaveAbout}>
                <Zap size={14} /> SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SKILL FORM MODAL ── */}
      {showSkillForm && (
        <div className="fixed inset-0 z-50 cyber-modal-overlay flex items-center justify-center p-6">
          <div className="relative w-full max-w-md cyber-panel p-8">
            <HudCorners />
            <div className="flex items-center justify-between mb-6">
              <span className="font-orbitron font-bold text-white text-sm">ADD SKILL</span>
              <button onClick={() => { setShowSkillForm(false); setSkillForm({ name: '', level: 50 }); setError(''); }}
                style={{ color: 'rgba(200,214,229,0.4)' }}><X size={20} /></button>
            </div>
            {error && (
              <div className="mb-4 font-mono-cyber text-xs p-3"
                style={{ border: '1px solid rgba(255,0,110,0.3)', color: 'var(--cyber-magenta)' }}>
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>SKILL_NAME *</p>
                <input type="text" value={skillForm.name}
                  onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="cyber-input" placeholder="e.g. React.js" />
              </div>
              <div>
                <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>
                  PROFICIENCY: <span style={{ color: 'var(--cyber-cyan)' }}>{skillForm.level}%</span>
                </p>
                <input type="range" min="0" max="100" value={skillForm.level}
                  onChange={e => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400" />
              </div>
              <button className="btn-cyber-secondary w-full flex items-center justify-center gap-2"
                onClick={handleAddSkill}>
                <Plus size={14} /> ADD SKILL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPERIENCE FORM MODAL ── */}
      {showExpForm && (
        <div className="fixed inset-0 z-50 cyber-modal-overlay flex items-center justify-center p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl cyber-panel p-8 my-8">
            <HudCorners />
            <div className="flex items-center justify-between mb-6">
              <span className="font-orbitron font-bold text-white text-sm">
                {editingExp ? 'EDIT EXPERIENCE' : 'ADD EXPERIENCE'}
              </span>
              <button onClick={() => { setShowExpForm(false); setExpForm({ year: '', position: '', company: '', description: '', achievements: '' }); setEditingExp(null); setError(''); }}
                style={{ color: 'rgba(200,214,229,0.4)' }}><X size={20} /></button>
            </div>
            {error && (
              <div className="mb-4 font-mono-cyber text-xs p-3"
                style={{ border: '1px solid rgba(255,0,110,0.3)', color: 'var(--cyber-magenta)' }}>
                {error}
              </div>
            )}
            <div className="space-y-3">
              {[
                { key: 'year', label: 'YEAR', placeholder: '2023 - Present' },
                { key: 'position', label: 'POSITION *', placeholder: 'e.g. Web Developer' },
                { key: 'company', label: 'COMPANY *', placeholder: 'e.g. PT. Example' },
              ].map(f => (
                <div key={f.key}>
                  <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>{f.label}</p>
                  <input type="text" value={expForm[f.key]}
                    onChange={e => setExpForm({ ...expForm, [f.key]: e.target.value })}
                    className="cyber-input" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>DESCRIPTION</p>
                <textarea value={expForm.description}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className="cyber-input" style={{ height: 80 }} placeholder="Role description..." />
              </div>
              <div>
                <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>
                  ACHIEVEMENTS <span style={{ color: 'rgba(200,214,229,0.3)' }}>(one per line)</span>
                </p>
                <textarea value={expForm.achievements}
                  onChange={e => setExpForm({ ...expForm, achievements: e.target.value })}
                  className="cyber-input" style={{ height: 100 }} placeholder="• Achievement 1&#10;• Achievement 2" />
              </div>
              <button className="btn-cyber-secondary w-full flex items-center justify-center gap-2 mt-2"
                onClick={handleAddExperience}>
                <Zap size={14} /> {editingExp ? 'UPDATE' : 'ADD'} EXPERIENCE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATION FORM MODAL ── */}
      {showCertForm && (
        <div className="fixed inset-0 z-50 cyber-modal-overlay flex items-center justify-center p-6">
          <div className="relative w-full max-w-md cyber-panel p-8">
            <HudCorners />
            <div className="flex items-center justify-between mb-6">
              <span className="font-orbitron font-bold text-white text-sm">
                {editingCert ? 'EDIT CERT' : 'ADD CERT'}
              </span>
              <button onClick={() => { setShowCertForm(false); setCertForm({ title: '', issuer: '', year: '', icon: '🎓' }); setEditingCert(null); setError(''); }}
                style={{ color: 'rgba(200,214,229,0.4)' }}><X size={20} /></button>
            </div>
            {error && (
              <div className="mb-4 font-mono-cyber text-xs p-3"
                style={{ border: '1px solid rgba(255,0,110,0.3)', color: 'var(--cyber-magenta)' }}>
                {error}
              </div>
            )}
            <div className="space-y-3">
              {[
                { key: 'title', label: 'TITLE *', placeholder: 'Certification name' },
                { key: 'issuer', label: 'ISSUER *', placeholder: 'e.g. Google, AWS' },
                { key: 'year', label: 'YEAR', placeholder: '2024' },
                { key: 'icon', label: 'ICON (emoji)', placeholder: '🎓' },
              ].map(f => (
                <div key={f.key}>
                  <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>{f.label}</p>
                  <input type="text" value={certForm[f.key]}
                    onChange={e => setCertForm({ ...certForm, [f.key]: e.target.value })}
                    className="cyber-input" placeholder={f.placeholder} />
                </div>
              ))}
              <button className="btn-cyber-secondary w-full flex items-center justify-center gap-2 mt-2"
                onClick={handleAddCertification}>
                <Zap size={14} /> {editingCert ? 'UPDATE' : 'ADD'} CERTIFICATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT FORM MODAL ── */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 cyber-modal-overlay flex items-center justify-center p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl cyber-panel p-8 my-8">
            <HudCorners />
            <div className="flex items-center justify-between mb-6">
              <span className="font-orbitron font-bold text-white text-sm">
                {editingProject ? 'EDIT PROJECT' : 'ADD PROJECT'}
              </span>
              <button onClick={() => { setShowProjectForm(false); setError(''); setEditingProject(null); setProjectForm({ title: '', description: '', images: [], tags: '', github: '', demo: '', category: 'it' }); }}
                style={{ color: 'rgba(200,214,229,0.4)' }}><X size={20} /></button>
            </div>
            {error && (
              <div className="mb-4 flex items-center gap-2 font-mono-cyber text-xs p-3"
                style={{ border: '1px solid rgba(255,0,110,0.3)', color: 'var(--cyber-magenta)' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>TITLE *</p>
                <input type="text" value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="cyber-input" placeholder="Project name" />
              </div>
              <div>
                <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>DESCRIPTION *</p>
                <textarea value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="cyber-input" style={{ height: 80 }} placeholder="Project description" />
              </div>
              <div>
                <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>CATEGORY</p>
                <select value={projectForm.category}
                  onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                  className="cyber-input select-cyber">
                  <option value="it">IT &amp; Development</option>
                  <option value="automotive">Automotive</option>
                </select>
              </div>

              <div>
                <p className="font-mono-cyber text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>
                  IMAGES ({projectForm.images.length}) *
                </p>
                {projectForm.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {projectForm.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt=""
                          className="w-16 h-16 object-cover"
                          style={{ border: '1px solid rgba(0,212,255,0.2)' }} />
                        <button onClick={() => setProjectForm({ ...projectForm, images: projectForm.images.filter((_, i) => i !== idx) })}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'var(--cyber-magenta)', color: 'white' }}>
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="btn-cyber-primary text-xs cursor-pointer flex items-center justify-center gap-2 py-2 w-full">
                  <Plus size={14} /> ADD IMAGE
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handleImageUpload(e, img => setProjectForm({ ...projectForm, images: [...projectForm.images, img] }))} />
                </label>
                <input type="text" placeholder="Or paste image URL + press Enter"
                  className="cyber-input mt-2" style={{ fontSize: '0.8rem' }}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setProjectForm({ ...projectForm, images: [...projectForm.images, e.target.value.trim()] });
                      e.target.value = '';
                    }
                  }} />
              </div>

              <div>
                <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>TAGS (comma separated)</p>
                <input type="text" value={projectForm.tags}
                  onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="cyber-input" placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>GITHUB URL</p>
                  <input type="text" value={projectForm.github}
                    onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                    className="cyber-input" placeholder="https://github.com/..." />
                </div>
                <div>
                  <p className="font-mono-cyber text-xs mb-1.5" style={{ color: 'rgba(0,212,255,0.5)' }}>DEMO URL</p>
                  <input type="text" value={projectForm.demo}
                    onChange={e => setProjectForm({ ...projectForm, demo: e.target.value })}
                    className="cyber-input" placeholder="https://..." />
                </div>
              </div>
              <button className="btn-cyber-secondary w-full flex items-center justify-center gap-2 mt-2"
                onClick={handleAddProject}>
                <Zap size={14} /> {editingProject ? 'UPDATE' : 'ADD'} PROJECT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT DETAIL MODAL ── */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 cyber-modal-overlay flex items-center justify-center p-6">
          <div className="relative w-full max-w-4xl cyber-panel overflow-hidden max-h-[90vh] overflow-y-auto">
            <ImageCarousel images={selectedProject.images || []} projectTitle={selectedProject.title} />

            <button onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center z-20"
              style={{ background: 'rgba(2,4,8,0.9)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--cyber-cyan)' }}>
              <X size={18} />
            </button>

            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono-cyber text-xs mb-1" style={{ color: 'rgba(0,212,255,0.4)' }}>
                    {selectedProject.category === 'it' ? '[ IT_DEV ]' : '[ AUTOMOTIVE ]'}
                  </p>
                  <h3 className="font-orbitron font-bold text-2xl text-white">{selectedProject.title}</h3>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{selectedProject.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {(selectedProject.tags || []).map((tag, i) => (
                  <span key={i} className="cyber-tag">{tag}</span>
                ))}
              </div>

              <div className="flex gap-3 pt-6" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer"
                    className="btn-cyber-primary text-xs flex items-center gap-2 px-5 py-2.5">
                    <Github size={16} /> SOURCE CODE
                  </a>
                )}
                {selectedProject.demo && (
                  <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer"
                    className="btn-cyber-secondary text-xs flex items-center gap-2 px-5 py-2.5">
                    <ExternalLink size={16} /> LIVE DEMO
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
