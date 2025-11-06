import React, { useState, useEffect } from 'react';
import { Plus, X, Eye, Github, ExternalLink, Briefcase, Mail, Linkedin, AlertCircle, Edit2, Trash2, Menu } from 'lucide-react';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [saveStatus, setSaveStatus] = useState('');
  
  const correctPassword = 'admin123';
  
  const [projects, setProjects] = useState([]);
  const [aboutData, setAboutData] = useState({
    profileImage: "",
    bio1: "Saya adalah seorang Web Developer dengan passion dalam menciptakan aplikasi web yang inovatif dan user-friendly.",
    bio2: "Saya selalu antusias untuk belajar teknologi baru dan mengikuti perkembangan tren di dunia web development.",
    stats: [
      { label: "Years Experience", value: "3+" },
      { label: "Projects Completed", value: "20+" },
      { label: "Happy Clients", value: "15+" },
      { label: "Technologies", value: "10+" }
    ]
  });
  const [skills, setSkills] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [showLogin, setShowLogin] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showAboutForm, setShowAboutForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingExp, setEditingExp] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [editingSkillCategory, setEditingSkillCategory] = useState('');
  const [projectCategory, setProjectCategory] = useState('all');
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', image: '', tags: '', github: '', demo: '', category: 'it'
  });
  const [expForm, setExpForm] = useState({
    year: '', position: '', company: '', description: '', achievements: ''
  });
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', year: '', icon: '🎓'
  });
  const [skillForm, setSkillForm] = useState({
    name: '', level: 50
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const projectsRes = await axios.get(`${API_URL}/projects`);
      setProjects(projectsRes.data);

      const aboutRes = await axios.get(`${API_URL}/about`);
      if (aboutRes.data) {
        setAboutData({
          profileImage: aboutRes.data.profileImage || aboutData.profileImage,
          bio1: aboutRes.data.bio1 || aboutData.bio1,
          bio2: aboutRes.data.bio2 || aboutData.bio2,
          stats: aboutRes.data.stats || aboutData.stats
        });
      }

      const skillsRes = await axios.get(`${API_URL}/skills`);
      setSkills(skillsRes.data);

      const expRes = await axios.get(`${API_URL}/experiences`);
      setExperiences(expRes.data);

      const certRes = await axios.get(`${API_URL}/certifications`);
      setCertifications(certRes.data);

      console.log('✅ Data loaded from backend');
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setSaveStatus('❌ Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'certifications', 'projects'];
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogin = () => {
    setError('');
    if (!password.trim()) {
      setError('Password wajib diisi!');
      return;
    }
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setPassword('');
    } else {
      setError('Password salah!');
      setPassword('');
    }
  };

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      alert('Max 5MB!');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Harus gambar!');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.onerror = () => alert('Gagal upload!');
    reader.readAsDataURL(file);
  };

  const handleSaveAbout = async () => {
    try {
      const dataToSend = {
        profileImage: aboutData.profileImage,
        bio1: aboutData.bio1,
        bio2: aboutData.bio2,
        stats: aboutData.stats
      };
      
      console.log('💾 Saving About data...', {
        hasImage: !!dataToSend.profileImage,
        imageLength: dataToSend.profileImage?.length || 0
      });
      
      const response = await axios.put(`${API_URL}/about`, dataToSend);
      console.log('✅ About saved successfully:', response.data);
      
      setSaveStatus('✓ About & Photo updated successfully!');
      setShowAboutForm(false);
      
      // Reload data to confirm
      await loadAllData();
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('❌ Error saving about:', err.response?.data || err.message);
      alert('Gagal menyimpan data! Check console untuk detail.');
    }
  };

  const handleAddProject = async () => {
    setError('');
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setError('Title dan deskripsi wajib diisi!');
      return;
    }

    try {
      const projectData = {
        title: projectForm.title,
        description: projectForm.description,
        image: projectForm.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
        tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        github: projectForm.github,
        demo: projectForm.demo,
        category: projectForm.category
      };

      if (editingProject) {
        await axios.put(`${API_URL}/projects/${editingProject.id}`, projectData);
        setSaveStatus('✓ Project updated');
        setEditingProject(null);
      } else {
        await axios.post(`${API_URL}/projects`, projectData);
        setSaveStatus('✓ Project added');
      }

      loadAllData();
      setProjectForm({ title: '', description: '', image: '', tags: '', github: '', demo: '', category: 'it' });
      setShowProjectForm(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Gagal menyimpan project!');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', '),
      github: project.github || '',
      demo: project.demo || '',
      category: project.category || 'it'
    });
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Hapus project ini?')) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`);
        setSaveStatus('✓ Project deleted');
        loadAllData();
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Gagal menghapus project!');
      }
    }
  };

  const handleAddExperience = async () => {
    setError('');
    if (!expForm.position.trim() || !expForm.company.trim()) {
      setError('Position dan Company wajib diisi!');
      return;
    }
    
    try {
      const expData = {
        year: expForm.year.trim(),
        position: expForm.position.trim(),
        company: expForm.company.trim(),
        description: expForm.description.trim(),
        achievements: expForm.achievements.split('\n').map(a => a.trim()).filter(Boolean)
      };

      if (editingExp) {
        await axios.put(`${API_URL}/experiences/${editingExp.id}`, expData);
        setSaveStatus('✓ Experience updated');
        setEditingExp(null);
      } else {
        await axios.post(`${API_URL}/experiences`, expData);
        setSaveStatus('✓ Experience added');
      }

      loadAllData();
      setExpForm({ year: '', position: '', company: '', description: '', achievements: '' });
      setShowExpForm(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error('Error saving experience:', err);
      setError('Gagal menyimpan experience!');
    }
  };

  const handleEditExperience = (exp) => {
    setEditingExp(exp);
    setExpForm({
      year: exp.year,
      position: exp.position,
      company: exp.company,
      description: exp.description,
      achievements: exp.achievements.join('\n')
    });
    setShowExpForm(true);
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm('Hapus experience ini?')) {
      try {
        await axios.delete(`${API_URL}/experiences/${id}`);
        setSaveStatus('✓ Experience deleted');
        loadAllData();
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        console.error('Error deleting experience:', err);
        alert('Gagal menghapus experience!');
      }
    }
  };

  const handleAddCertification = async () => {
    setError('');
    if (!certForm.title.trim() || !certForm.issuer.trim()) {
      setError('Title dan Issuer wajib diisi!');
      return;
    }
    
    try {
      if (editingCert) {
        await axios.put(`${API_URL}/certifications/${editingCert.id}`, certForm);
        setSaveStatus('✓ Certification updated');
        setEditingCert(null);
      } else {
        await axios.post(`${API_URL}/certifications`, certForm);
        setSaveStatus('✓ Certification added');
      }

      loadAllData();
      setCertForm({ title: '', issuer: '', year: '', icon: '🎓' });
      setShowCertForm(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error('Error saving certification:', err);
      setError('Gagal menyimpan certification!');
    }
  };

  const handleEditCertification = (cert) => {
    setEditingCert(cert);
    setCertForm({
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      icon: cert.icon
    });
    setShowCertForm(true);
  };

  const handleDeleteCertification = async (id) => {
    if (window.confirm('Hapus certification ini?')) {
      try {
        await axios.delete(`${API_URL}/certifications/${id}`);
        setSaveStatus('✓ Certification deleted');
        loadAllData();
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        console.error('Error deleting certification:', err);
        alert('Gagal menghapus certification!');
      }
    }
  };

  const handleAddSkill = async () => {
    setError('');
    if (!skillForm.name.trim()) {
      setError('Nama skill wajib diisi!');
      return;
    }

    try {
      await axios.post(`${API_URL}/skills`, {
        category: editingSkillCategory,
        name: skillForm.name,
        level: skillForm.level
      });
      
      setSaveStatus('✓ Skill added');
      loadAllData();
      setSkillForm({ name: '', level: 50 });
      setShowSkillForm(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error('Error adding skill:', err);
      setError('Gagal menambah skill!');
    }
  };

  const handleDeleteSkill = async (category, index) => {
    if (window.confirm('Hapus skill ini?')) {
      try {
        const skill = skills[category][index];
        await axios.delete(`${API_URL}/skills/${skill.id}`);
        setSaveStatus('✓ Skill deleted');
        loadAllData();
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        console.error('Error deleting skill:', err);
        alert('Gagal menghapus skill!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter(p => projectCategory === 'all' || p.category === projectCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {saveStatus && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          {saveStatus}
        </div>
      )}

      <header className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-white border-opacity-10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 cursor-pointer select-none" onDoubleClick={() => !isAuthenticated && setShowLogin(true)} title="Double click untuk admin">
                Fikral Andhika Ramadhani
              </h1>
              <p className="text-purple-300">Web Developer & Data Analyst | Automotive Enthusiast </p>
            </div>
            <nav className="hidden md:flex gap-6 items-center">
              {['home', 'about', 'skills', 'experience', 'certifications', 'projects'].map(section => (
                <button key={section} onClick={() => scrollToSection(section)} className={`text-sm font-medium transition-colors capitalize ${activeSection === section ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                  {section}
                </button>
              ))}
            </nav>
            <div className="flex gap-4 items-center">
              <button onClick={() => setShowMobileMenu(true)} className="md:hidden text-white hover:text-purple-300 transition-colors">
                <Menu size={24} />
              </button>
              <a href="mailto:email@example.com" className="hidden md:block text-white hover:text-purple-300 transition-colors"><Mail size={24} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hidden md:block text-white hover:text-purple-300 transition-colors"><Github size={24} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hidden md:block text-white hover:text-purple-300 transition-colors"><Linkedin size={24} /></a>
              {isAuthenticated && (
                <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">Logout</button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-white border-opacity-10">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)} className="text-white hover:text-purple-300">
                <X size={28} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col p-6 space-y-4">
              {['home', 'about', 'skills', 'experience', 'certifications', 'projects'].map(section => (
                <button 
                  key={section} 
                  onClick={() => { 
                    scrollToSection(section); 
                    setShowMobileMenu(false); 
                  }} 
                  className={`text-left text-2xl font-medium transition-colors capitalize py-3 ${activeSection === section ? 'text-purple-400' : 'text-gray-300'}`}
                >
                  {section}
                </button>
              ))}
            </nav>
            <div className="p-6 border-t border-white border-opacity-10">
              <div className="flex gap-6 justify-center">
                <a href="mailto:email@example.com" className="text-white hover:text-purple-300 transition-colors">
                  <Mail size={28} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-300 transition-colors">
                  <Github size={28} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-300 transition-colors">
                  <Linkedin size={28} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        <div id="home" className="text-center min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-6">
          <h2 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Hello, I'm Fikral Andhika Ramadhani</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"></p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => scrollToSection('projects')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105">View My Projects</button>
            <button onClick={() => scrollToSection('about')} className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-8 py-3 rounded-lg font-medium transition-all">Learn More</button>
          </div>
        </div>

        <section id="about" className="max-w-7xl mx-auto px-6 py-12 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-4xl font-bold text-white text-center flex-1">About Me</h3>
            {isAuthenticated && (
              <button onClick={() => setShowAboutForm(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"><Edit2 size={16} />Edit</button>
            )}
          </div>
          <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative group">
                <img src={aboutData.profileImage} alt="Profile" className="rounded-2xl w-full h-96 object-cover" />
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setShowAboutForm(true)} 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Edit About & Photo
                    </button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-300 mb-4 leading-relaxed">{aboutData.bio1}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{aboutData.bio2}</p>
                <div className="grid grid-cols-2 gap-4">
                  {aboutData.stats.map((stat, i) => (
                    <div key={i} className="bg-purple-500 bg-opacity-10 p-4 rounded-lg">
                      <h4 className="text-purple-400 font-bold text-2xl mb-1">{stat.value}</h4>
                      <p className="text-gray-300 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="max-w-7xl mx-auto px-6 py-12 mb-8">
          <h3 className="text-4xl font-bold text-white mb-8 text-center">My Skills</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.keys(skills).map(category => (
              <div key={category} className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-white capitalize">{category}</h4>
                  {isAuthenticated && (
                    <button onClick={() => { setEditingSkillCategory(category); setShowSkillForm(true); }} className="text-purple-400 hover:text-purple-300"><Plus size={20} /></button>
                  )}
                </div>
                <div className="space-y-3">
                  {skills[category].map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">{skill.level}%</span>
                          {isAuthenticated && (
                            <button onClick={() => handleDeleteSkill(category, idx)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="max-w-7xl mx-auto px-6 py-12 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-4xl font-bold text-white flex-1 text-center">Experience</h3>
            {isAuthenticated && (
              <button onClick={() => setShowExpForm(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"><Plus size={16} />Add</button>
            )}
          </div>
          <div className="space-y-6">
            {experiences.map(exp => (
              <div key={exp.id} className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10 relative group">
                {isAuthenticated && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditExperience(exp)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteExperience(exp.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"><Trash2 size={16} /></button>
                  </div>
                )}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-1">{exp.position}</h4>
                    <p className="text-purple-400 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-gray-400 text-sm mt-2 md:mt-0 flex-shrink-0">{exp.year}</span>
                </div>
                {exp.description && <p className="text-gray-300 mb-4 break-words" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mt-4 w-full overflow-hidden">
                    <p className="text-gray-400 text-sm font-medium mb-3">Key Achievements:</p>
                    <ul className="space-y-2 list-none pl-0">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-3 w-full">
                          <span className="text-purple-400 flex-shrink-0 select-none">•</span>
                          <span className="text-gray-300 text-sm flex-1 leading-relaxed" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="certifications" className="max-w-7xl mx-auto px-6 py-12 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-4xl font-bold text-white flex-1 text-center">Certifications</h3>
            {isAuthenticated && (
              <button onClick={() => setShowCertForm(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"><Plus size={16} />Add</button>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map(cert => (
              <div key={cert.id} className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10 hover:border-purple-500 transition-all relative group">
                {isAuthenticated && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditCertification(cert)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteCertification(cert.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"><Trash2 size={16} /></button>
                  </div>
                )}
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2">{cert.title}</h4>
                <p className="text-gray-400 text-sm mb-1">{cert.issuer}</p>
                <p className="text-purple-400 text-sm font-medium">{cert.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="max-w-7xl mx-auto px-6 py-12 mb-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Briefcase className="text-purple-400" size={28} />
              <h3 className="text-3xl font-bold text-white">My Projects</h3>
            </div>
            {isAuthenticated && (
              <button onClick={() => setShowProjectForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium"><Plus size={20} />Add Project</button>
            )}
          </div>
          
          <div className="flex gap-3 mb-6 flex-wrap">
            <button onClick={() => setProjectCategory('all')} className={`px-6 py-2 rounded-lg font-medium transition-all ${projectCategory === 'all' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'}`}>
              All Projects
            </button>
            <button onClick={() => setProjectCategory('it')} className={`px-6 py-2 rounded-lg font-medium transition-all ${projectCategory === 'it' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'}`}>
              IT & Development
            </button>
            <button onClick={() => setProjectCategory('automotive')} className={`px-6 py-2 rounded-lg font-medium transition-all ${projectCategory === 'automotive' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'}`}>
              Automotive
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <div key={project.id} className="group bg-white bg-opacity-5 backdrop-blur-lg rounded-xl overflow-hidden border border-white border-opacity-10 hover:border-purple-500 transition-all">
                <div className="relative overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  {isAuthenticated && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditProject(project)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteProject(project.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"><X size={16} /></button>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedProject(project)} className="flex-1 flex items-center justify-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm"><Eye size={16} />View</button>
                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg"><Github size={20} /></a>}
                    {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg"><ExternalLink size={20} /></a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-purple-500 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Admin Login</h3>
              <button onClick={() => { setShowLogin(false); setError(''); setPassword(''); }} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
                <AlertCircle size={18} /><span className="text-sm">{error}</span>
              </div>
            )}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500 mb-4" placeholder="Enter password" autoFocus />
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium">Login</button>
            <p className="text-gray-400 text-sm mt-4 text-center">Default password: admin123</p>
          </div>
        </div>
      )}

      {showAboutForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit About</h3>
              <button onClick={() => setShowAboutForm(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {aboutData.profileImage && (
                    <img src={aboutData.profileImage} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors text-sm">
                    <Plus size={16} />
                    {aboutData.profileImage ? 'Change Photo' : 'Upload Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img) => {
                      setAboutData({ ...aboutData, profileImage: img });
                    })} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio Paragraph 1</label>
                <textarea value={aboutData.bio1} onChange={(e) => setAboutData({ ...aboutData, bio1: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio Paragraph 2</label>
                <textarea value={aboutData.bio2} onChange={(e) => setAboutData({ ...aboutData, bio2: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24 resize-none" />
              </div>
              <button onClick={handleSaveAbout} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showSkillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-purple-500 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add Skill</h3>
              <button onClick={() => { setShowSkillForm(false); setSkillForm({ name: '', level: 50 }); setError(''); }} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
                <AlertCircle size={18} /><span className="text-sm">{error}</span>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name *</label>
                <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="e.g., React.js" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Level: {skillForm.level}%</label>
                <input type="range" min="0" max="100" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })} className="w-full" />
              </div>
              <button onClick={handleAddSkill} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium">Add Skill</button>
            </div>
          </div>
        </div>
      )}

      {showExpForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{editingExp ? 'Edit Experience' : 'Add Experience'}</h3>
              <button onClick={() => { setShowExpForm(false); setExpForm({ year: '', position: '', company: '', description: '', achievements: '' }); setEditingExp(null); setError(''); }} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
                <AlertCircle size={18} /><span className="text-sm">{error}</span>
              </div>
            )}
            <div className="space-y-4">
              <input type="text" value={expForm.year} onChange={(e) => setExpForm({ ...expForm, year: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Year (e.g., 2023 - Present)" />
              <input type="text" value={expForm.position} onChange={(e) => setExpForm({ ...expForm, position: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Position *" />
              <input type="text" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Company *" />
              <textarea value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24 resize-none" placeholder="Description" />
              <textarea value={expForm.achievements} onChange={(e) => setExpForm({ ...expForm, achievements: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500 h-32 resize-none" placeholder="Achievements (one per line)" />
              <button onClick={handleAddExperience} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium">{editingExp ? 'Update' : 'Add'} Experience</button>
            </div>
          </div>
        </div>
      )}

      {showCertForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-purple-500 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{editingCert ? 'Edit Certification' : 'Add Certification'}</h3>
              <button onClick={() => { setShowCertForm(false); setCertForm({ title: '', issuer: '', year: '', icon: '🎓' }); setEditingCert(null); setError(''); }} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
                <AlertCircle size={18} /><span className="text-sm">{error}</span>
              </div>
            )}
            <div className="space-y-4">
              <input type="text" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Title *" />
              <input type="text" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Issuer *" />
              <input type="text" value={certForm.year} onChange={(e) => setCertForm({ ...certForm, year: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Year" />
              <input type="text" value={certForm.icon} onChange={(e) => setCertForm({ ...certForm, icon: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Icon (emoji)" />
              <button onClick={handleAddCertification} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium">{editingCert ? 'Update' : 'Add'} Certification</button>
            </div>
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{editingProject ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => { setShowProjectForm(false); setError(''); setEditingProject(null); setProjectForm({ title: '', description: '', image: '', tags: '', github: '', demo: '', category: 'it' }); }} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
                <AlertCircle size={18} /><span className="text-sm">{error}</span>
              </div>
            )}
            <div className="space-y-4">
              <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Project Title *" />
              <textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24 resize-none" placeholder="Description *" />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500">
                  <option value="it">IT & Development</option>
                  <option value="automotive">Automotive</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <input type="text" value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Image URL" />
                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors">
                  <Plus size={18} />Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img) => setProjectForm({ ...projectForm, image: img }))} />
                </label>
              </div>
              <input type="text" value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Tags (comma separated)" />
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" value={projectForm.github} onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="GitHub URL" />
                <input type="text" value={projectForm.demo} onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })} className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Demo URL" />
              </div>
              <button onClick={handleAddProject} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium">{editingProject ? 'Update' : 'Add'} Project</button>
            </div>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full border border-purple-500 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-64 object-cover rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent rounded-t-2xl"></div>
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full text-sm font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4">
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-6 py-3 rounded-lg font-medium transition-colors"><Github size={20} />View Code</a>
                )}
                {selectedProject.demo && (
                  <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"><ExternalLink size={20} />Live Demo</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-black bg-opacity-30 backdrop-blur-lg border-t border-white border-opacity-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>© 2025 Fikral Andhika Ramadhani. Built with passion and React.</p>
        </div>
      </footer>
    </div>
  );
}
