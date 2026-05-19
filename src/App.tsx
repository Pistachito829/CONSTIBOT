/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useParams, Navigate, useLocation } from "react-router-dom";
import { 
  Gavel, 
  User, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  Compass,
  Calendar, 
  ChevronRight, 
  LayoutDashboard, 
  Scale, 
  School, 
  Send,
  Download,
  Brain,
  HelpCircle,
  Library,
  TrendingUp,
  UploadCloud,
  FileText,
  History,
  LogOut,
  BookOpen,
  Lock,
  MessageSquare,
  Activity,
  Users,
  Clock,
  CheckCircle,
  Eye,
  LogIn,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { jsPDF } from "jspdf";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Header = ({ title }: { title: string }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const userName = userData?.name || "Invitado";

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-40 h-16 w-full">
      <div className="flex justify-between items-center w-full px-4 md:px-12 max-w-[1600px] mx-auto h-16">
        <div className="flex items-center gap-3">
          <Gavel className="text-primary h-6 w-6" />
          <h1 className="text-xl md:text-2xl font-headline font-bold text-primary uppercase tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 items-center mr-8">
            <Link to={userData?.role === 'professor' ? '/teacher' : '/dashboard'} className="text-primary font-bold text-sm uppercase tracking-widest">Dashboard</Link>
            <Link to="/casos" className="text-on-surface-variant hover:text-primary transition-colors text-sm uppercase tracking-widest">Casos</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary hidden sm:block uppercase tracking-widest">{userName}</span>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <User className="h-[18px] w-[18px] text-on-primary-container" />
              </div>
            </div>
            {userData && (
              <button 
                onClick={handleSignOut}
                className="p-2 text-on-surface-variant hover:text-red-600 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 bg-surface-container-lowest border-t border-outline-variant px-2 pb-safe z-50">
    <Link to="/dashboard" className="flex flex-col items-center justify-center p-2 text-on-secondary-container hover:text-primary transition-all">
      <LayoutDashboard size={24} />
      <span className="text-[10px] uppercase tracking-widest mt-1">Dashboard</span>
    </Link>
    <Link to="/casos" className="flex flex-col items-center justify-center p-2 text-primary">
      <Scale size={24} />
      <span className="text-[10px] uppercase tracking-widest mt-1">Casos</span>
    </Link>
    <Link to="/perfil" className="flex flex-col items-center justify-center p-2 text-on-secondary-container hover:text-primary transition-all">
      <User size={24} />
      <span className="text-[10px] uppercase tracking-widest mt-1">Perfil</span>
    </Link>
  </nav>
);

// --- Pages ---

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, userData, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user && userData) {
      if (userData.role === 'professor') {
        navigate("/teacher");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, userData, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      if (username === "profesor" && password === "catedra2026") {
        sessionStorage.setItem("userRole", "professor");
        sessionStorage.setItem("userName", "Profesor Titular");
        sessionStorage.setItem("authStatus", "authenticated");
        window.location.href = "/teacher";
      } else {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: username.trim(), legajo: password.trim() })
        });
        if (res.ok) {
          const data = await res.json();
          sessionStorage.setItem("userRole", "student");
          sessionStorage.setItem("userName", data.name);
          sessionStorage.setItem("authStatus", "authenticated");
          window.location.href = "/dashboard";
        } else {
          setError("Credenciales inválidas. Por favor, verifique su nombre y legajo.");
        }
      }
    } catch (err: any) {
      setError("Error al conectar con el sistema.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
      <div className="fixed top-0 left-0 w-1 bg-primary h-full z-20"></div>
      
      {/* Background Motif */}
      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
        <Scale size={800} strokeWidth={0.5} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full border border-outline-variant bg-surface-container-lowest shadow-sm">
            <Gavel className="text-primary h-12 w-12" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight mb-2 uppercase tracking-tighter">Derecho Constitucional C</h1>
          <p className="text-[10px] font-black text-on-secondary-container tracking-[0.25em] uppercase">Portal Académico Institucional</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-10 shadow-sm rounded-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-on-secondary-container h-5 w-5" />
                <input 
                  type="text" 
                  className="w-full bg-surface-container-low border border-outline-variant py-3 pl-10 pr-4 text-sm font-semibold focus:border-primary outline-none" 
                  placeholder="Ej: Juan Pérez"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Legajo</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-secondary-container h-5 w-5" />
                <input 
                  type="password" 
                  className="w-full bg-surface-container-low border border-outline-variant py-3 pl-10 pr-4 text-sm font-semibold focus:border-primary outline-none" 
                  placeholder="Ej: 12345"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-700 text-[9px] font-black uppercase text-center bg-red-50 p-2 border border-red-100 rounded-lg">{error}</p>}

            <button 
              disabled={isLoggingIn}
              className="w-full bg-primary text-white py-4 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center group shadow-lg shadow-primary/20 rounded-xl"
            >
              <span>{isLoggingIn ? "Verificando..." : "Ingresar al Aula Virtual"}</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-[10px] text-on-surface-variant uppercase tracking-widest font-black opacity-40">
          Facultad de Derecho y Ciencias Sociales • UNT
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => setCases(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching cases:", err));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header title="Derecho Constitucional C" />
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <section className="mb-12">
          <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Bienvenido de nuevo</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-5xl font-headline font-bold text-on-surface">¡Hola, {userData?.name || "Estudiante"}!</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
              <input 
                type="text" 
                className="w-full bg-surface border border-outline-variant py-3 pl-10 pr-4 text-sm font-semibold focus:border-primary outline-none" 
                placeholder="BUSCAR FALLOS O ARTÍCULOS..." 
              />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-2xl font-headline font-bold mb-8 border-b border-outline-variant pb-2">Estudios de Caso Disponibles</h3>
          {cases.length === 0 ? (
            <p className="text-on-surface-variant text-sm italic">Aún no hay casos publicados por el profesor.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {cases.map((item) => (
                <article key={item.id} className="bg-surface-container-lowest border border-outline-variant overflow-hidden relative group min-h-[380px] flex flex-col p-8 md:p-10 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="absolute top-0 left-0 w-1 bg-primary h-full"></div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">{item.tag || "Caso de Estudio"}</span>
                    <span className="text-on-surface-variant text-[10px] font-bold uppercase">CSJN • {item.year || "S/F"}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-4xl font-headline font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
                      {item.description || item.desc || "Análisis socrático interactivo del fallo."}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/chat/${item.id}`, { state: { title: item.title, year: item.year, tag: item.tag, description: item.description || item.desc } })}
                    className="self-start bg-primary text-white text-xs font-bold px-8 py-4 uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 group-btn relative z-10"
                  >
                    Analizar Fallo
                    <ArrowRight size={20} className="group-[.group-btn]:hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]">
                    <Scale size={300} strokeWidth={0.5} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

// Helper component moved outside to prevent focus loss
const InputField = ({ label, value, onChange, placeholder, isShort }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, isShort?: boolean }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">{label}</label>
    {isShort ? (
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Escriba aquí..."}
        className="w-full bg-white border border-outline-variant px-3 py-1.5 text-[11px] focus:border-primary outline-none italic text-on-surface-variant font-medium"
      />
    ) : (
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Desarrolle aquí..."}
        className="w-full bg-white border border-outline-variant px-3 py-2 text-[11px] focus:border-primary outline-none italic text-on-surface-variant leading-relaxed min-h-[60px] resize-y font-medium"
        rows={2}
      />
    )}
  </div>
);

const ChatCase = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { state } = useLocation();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = `${user?.uid}_${caseId}`;
  const [activeTabMobile, setActiveTabMobile] = useState<'chat' | 'ficha'>('chat');

  // States for the synthesis sheet
  const [synthesis, setSynthesis] = useState({
    nombreFallo: "",
    fallos: "",
    anio: "",
    hechos: "",
    cuestiones: "",
    primeraInstancia: "",
    segundaInstancia: "",
    jurisdiccionCorte: "",
    opinionProcurador: "",
    procuradorPrincipios: "",
    procuradorRazonamiento: "",
    decisionCorte: "",
    cortePrincipios: "",
    corteRazonamiento: "",
    disidenciaConcurrencia: "",
    disidenciaPrincipios: "",
    disidenciaRazonamiento: "",
    obiterDictum: ""
  });

  const handleSynthesisChange = (field: keyof typeof synthesis, value: string) => {
    setSynthesis(prev => ({ ...prev, [field]: value }));
  };

  const [caseMetadata, setCaseMetadata] = useState({
    title: state?.title || caseId || "Cargando...",
    year: state?.year || "",
    tag: state?.tag || "",
    description: state?.description || state?.desc || ""
  });

  const caseTitle = caseMetadata.title;
  const caseYear = caseMetadata.year;

  useEffect(() => {
    if (!caseId) return;

    fetch(`/api/cases/${caseId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch case details");
        return res.json();
      })
      .then(data => {
        const title = data.title || caseId;
        const year = data.year || "Desconocido";
        setCaseMetadata({
          title,
          year,
          tag: data.tag || "",
          description: data.description || data.desc || ""
        });

        // If synthesis hasn't been saved yet, populate its headers
        const saved = localStorage.getItem(`synthesis_${sessionId}`);
        if (!saved) {
          setSynthesis(prev => ({
            ...prev,
            nombreFallo: prev.nombreFallo || title,
            anio: prev.anio || year.toString()
          }));
        }
      })
      .catch(err => {
        console.warn("Using fallback/local navigation state for case details:", err);
      });
  }, [caseId, sessionId]);

  useEffect(() => {
    if (!user) return;

    const welcomeText = `¡Bienvenido! Soy ConstiBot. ¿Empezamos a analizar el ${caseTitle}?`;
    const savedChat = localStorage.getItem(`chat_${sessionId}`);
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      setMessages([{ role: 'ai', text: welcomeText }]);
    }
    
    const saved = localStorage.getItem(`synthesis_${sessionId}`);
    if (saved) {
      setSynthesis(JSON.parse(saved));
    } else {
      // Auto-fill header
      setSynthesis(prev => ({ 
        ...prev, 
        nombreFallo: caseTitle || "",
        anio: caseYear.toString()
      }));
    }
  }, [caseId, user, caseTitle, caseYear]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    if (messages.length > 0) {
      const sliced = messages.slice(-15);
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(sliced));
    }
  }, [messages, sessionId]);

  useEffect(() => {
    if (!caseId || !user) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/poll?caseId=${caseId}&studentName=${encodeURIComponent(userData?.name || "Estudiante")}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.teacherMessages && data.teacherMessages.length > 0) {
          setMessages(prev => {
            const newMsgs = [...prev];
            data.teacherMessages.forEach((msg: string) => {
               newMsgs.push({ role: 'ai', text: `👨‍🏫 **Sugerencia Directa del Profesor:** ${msg}` });
            });
            return newMsgs;
          });
        }
      } catch (e) {}
    }, 15000);
    return () => clearInterval(interval);
  }, [caseId, user]);

  const handleSaveSynthesis = async () => {
    localStorage.setItem(`synthesis_${sessionId}`, JSON.stringify(synthesis));
    alert("Progreso de ficha guardado exitosamente en el navegador.");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20;
    const pageHeight = 297;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    let y = 25;

    const addText = (text: string, fontSize: number, isBold: boolean, color: [number, number, number] = [0, 0, 0], indent: number = 0) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text || 'N/A', contentWidth - indent);
      const lineHeight = fontSize * 0.45;

      lines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Ficha de Jurisprudencia - ${synthesis.nombreFallo || 'Caso'}`, margin, 12);
          doc.line(margin, 14, pageWidth - margin, 14);
          doc.setFont('helvetica', isBold ? 'bold' : 'normal');
          doc.setFontSize(fontSize);
          doc.setTextColor(color[0], color[1], color[2]);
        }
        doc.text(line, margin + indent, y);
        y += lineHeight + 1.2;
      });
    };

    const addHeader = () => {
      doc.setDrawColor(128, 0, 32);
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("UNIVERSIDAD NACIONAL DE TUCUMÁN  |  CÁTEDRA DERECHO CONSTITUCIONAL C", margin, y);
      y += 5;

      doc.setFontSize(20);
      doc.setTextColor(128, 0, 32);
      doc.text("FICHA DE JURISPRUDENCIA", margin, y);
      y += 8;

      doc.setFillColor(248, 246, 244);
      doc.rect(margin, y, contentWidth, 20, 'F');
      doc.setDrawColor(230, 225, 220);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, contentWidth, 20, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`ESTUDIANTE: ${(userData?.name || "Elisa Belén Flores").toUpperCase()}`, margin + 5, y + 7);
      doc.text(`LEGAJO: ${userData?.legajo || "44814605"}`, margin + 5, y + 13);
      doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-AR')}`, pageWidth - margin - 60, y + 10);
      y += 28;
    };

    addHeader();

    const brandColor: [number, number, number] = [128, 0, 32];
    const textColor: [number, number, number] = [40, 40, 40];
    const sectionTitleColor: [number, number, number] = [110, 110, 110];

    addText("NOMBRE DEL FALLO", 10, true, brandColor);
    addText(synthesis.nombreFallo, 11, false, textColor);
    y += 5;

    addText("FALLO", 10, true, brandColor);
    addText(synthesis.fallos, 11, false, textColor);
    y += 5;

    addText("AÑO", 10, true, brandColor);
    addText(synthesis.anio, 11, false, textColor);
    y += 5;

    addText("HECHOS", 10, true, brandColor);
    addText(synthesis.hechos, 11, false, textColor);
    y += 5;

    addText("CUESTIONES PRESENTADAS", 10, true, brandColor);
    addText(synthesis.cuestiones, 11, false, textColor);
    y += 5;

    addText("PRIMERA INSTANCIA", 10, true, brandColor);
    addText(synthesis.primeraInstancia, 11, false, textColor);
    y += 5;

    addText("SEGUNDA INSTANCIA", 10, true, brandColor);
    addText(synthesis.segundaInstancia, 11, false, textColor);
    y += 5;

    addText("TIPO DE JURISDICCIÓN INVOCADA PARA ACCEDER A LA CORTE SUPREMA", 10, true, brandColor);
    addText(synthesis.jurisdiccionCorte, 11, false, textColor);
    y += 5;

    addText("OPINIÓN DEL PROCURADOR GENERAL", 11, true, brandColor);
    y += 2;
    addText("PRINCIPIOS ELABORADOS", 9, true, sectionTitleColor, 4);
    addText(synthesis.procuradorPrincipios, 11, false, textColor, 4);
    y += 2.5;
    addText("RAZONAMIENTO", 9, true, sectionTitleColor, 4);
    addText(synthesis.procuradorRazonamiento, 11, false, textColor, 4);
    y += 5;

    addText("OPINIÓN DE LA CORTE SUPREMA", 11, true, brandColor);
    y += 2;
    addText("PRINCIPIOS ELABORADOS", 9, true, sectionTitleColor, 4);
    addText(synthesis.cortePrincipios, 11, false, textColor, 4);
    y += 2.5;
    addText("RAZONAMIENTO", 9, true, sectionTitleColor, 4);
    addText(synthesis.corteRazonamiento, 11, false, textColor, 4);
    y += 5;

    addText("DISIDENCIA O CONCURRENCIA", 11, true, brandColor);
    y += 2;
    addText("PRINCIPIOS ELABORADOS", 9, true, sectionTitleColor, 4);
    addText(synthesis.disidenciaPrincipios, 11, false, textColor, 4);
    y += 2.5;
    addText("RAZONAMIENTO", 9, true, sectionTitleColor, 4);
    addText(synthesis.disidenciaRazonamiento, 11, false, textColor, 4);
    y += 5;

    addText("OBITER DICTUM SIGNIFICATIVO", 10, true, brandColor);
    addText(synthesis.obiterDictum, 11, false, textColor);

    const filename = `Ficha_Jurisprudencia_${(synthesis.nombreFallo || 'Caso').trim().replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMsgText = inputText;
    const newMessage: { role: 'ai' | 'user', text: string } = { role: 'user', text: userMsgText };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          caseId,
          studentName: userData?.name || "Estudiante",
          history: messages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', text: m.text }))
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Lo siento, estudiante. Hubo un error técnico. ¿Podrías reintentar?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="ConstiBot" />
      
      <main className="h-[calc(100dvh-144px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row w-full md:px-12 px-2 py-4 md:py-8 gap-4 md:gap-8 overflow-hidden max-w-[1600px] mx-auto">
        
        {/* Mobile Top Navigation & Back Button */}
        <div className="md:hidden flex items-center justify-between px-2 shrink-0">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <ArrowLeft size={14} />
            <span>Mis Casos</span>
          </Link>
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider truncate max-w-[200px]">
            {caseTitle}
          </span>
        </div>

        {/* Mobile Tab Selector */}
        <div className="md:hidden flex border border-outline-variant rounded-xl overflow-hidden bg-white shadow-sm w-full shrink-0">
          <button 
            onClick={() => setActiveTabMobile('chat')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              activeTabMobile === 'chat' ? "bg-primary text-white" : "bg-white text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            <MessageSquare size={16} />
            <span>Chat ConstiBot</span>
          </button>
          <button 
            onClick={() => setActiveTabMobile('ficha')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              activeTabMobile === 'ficha' ? "bg-primary text-white" : "bg-white text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            <FileText size={16} />
            <span>Ficha de Jurisprudencia</span>
          </button>
        </div>

        {/* Left Sidebar - Info & Instructions (Desktop Only) */}
        <div className="hidden md:flex md:flex-[1.5] flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft size={16} />
            <span>Volver a Mis Casos</span>
          </Link>

          {/* Case Card */}
          <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
            <span className="bg-primary/10 text-primary text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest">
              {caseMetadata.tag || "Caso Activo"}
            </span>
            <h3 className="font-headline font-bold text-xl text-on-surface mt-3 leading-tight">{caseTitle}</h3>
            <p className="text-xs text-on-surface-variant/70 mt-1 uppercase tracking-wider font-semibold">Año: {caseYear}</p>
            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed italic">
              {caseMetadata.description || "Análisis socrático interactivo del fallo."}
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-surface-container-low border border-outline-variant/60 p-6 rounded-xl shadow-inner space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Compass size={16} />
              <span>Instrucciones de Trabajo</span>
            </h4>
            <ul className="space-y-3 text-xs text-on-surface-variant font-medium">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Lee cuidadosamente las preguntas de ConstiBot.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Intenta responder basándote en los hechos reales y el material del caso.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Si cometes un error fáctico, ConstiBot te guiará socráticamente para corregirlo.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>El análisis progresa: Hechos &rarr; Holding &rarr; Fundamentos &rarr; Valoración Crítica.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <section className={cn(
          "w-full md:flex-[3] flex flex-col bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-sm rounded-xl min-h-0 h-full",
          activeTabMobile === 'chat' ? "flex" : "hidden md:flex"
        )}>
          <div className="p-4 md:p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary-container p-2 md:p-3 rounded-xl text-on-primary-container shadow-sm">
                <School size={22} className="md:w-7 md:h-7 w-5 h-5" />
              </div>
              <div>
                <h2 className="font-headline text-xl md:text-3xl font-bold text-primary">ConstiBot</h2>
                <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Análisis Dialéctico de Jurisprudencia</p>
              </div>
            </div>
            <div className="bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hidden sm:block">
               <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.25em]">Sesión Activa</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar bg-surface-container-lowest/50">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("flex gap-3 md:gap-4 max-w-[90%]", msg.role === 'user' && "ml-auto flex-row-reverse")}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-sm text-xs md:text-sm",
                  msg.role === 'ai' ? "bg-primary text-white" : "bg-secondary text-white"
                )}>
                  {msg.role === 'ai' ? <Scale size={16} className="md:w-5 md:h-5" /> : <User size={16} className="md:w-5 md:h-5" />}
                </div>
                <div className={cn("space-y-1.5", msg.role === 'user' && "text-right")}>
                  <div className={cn(
                    "p-4 md:p-5 rounded-2xl text-[13px] md:text-[15px] leading-relaxed shadow-sm",
                    msg.role === 'ai' ? "bg-white border border-outline-variant rounded-tl-none text-[#333]" : "bg-primary text-white font-medium rounded-tr-none shadow-md shadow-primary/10 text-left"
                  )}>
                    <div className="whitespace-pre-wrap">
                      {msg.text.replace(/\*/g, "")}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase opacity-40">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-3 md:gap-4 max-w-[85%] animate-pulse">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10" />
                <div className="bg-white p-4 md:p-5 h-14 md:h-16 w-40 md:w-48 rounded-2xl border border-outline-variant" />
              </div>
            )}
          </div>

          <div className="p-4 md:p-8 border-t border-outline-variant bg-white">
            <div className="relative">
              <textarea 
                className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 md:px-6 md:py-4 pr-24 md:pr-36 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none resize-none font-sans text-xs md:text-[15px] transition-all" 
                placeholder="Exprese aquí sus fundamentos jurídicos..." 
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-primary text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 md:gap-3 group disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Enviar</span>
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </div>
        </section>

        {/* Info Sidebar - Editable Synthesis Sheet */}
        <aside className={cn(
          "w-full md:flex-[2.5] flex flex-col md:overflow-hidden md:h-full h-full pb-0",
          activeTabMobile === 'ficha' ? "flex" : "hidden md:flex"
        )}>
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col h-full shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-outline-variant bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText size={20} className="text-primary md:w-6 md:h-6" />
                </div>
                <h4 className="text-base md:text-xl font-headline font-bold text-primary uppercase tracking-tight">Ficha de Jurisprudencia</h4>
              </div>
            </div>

            <div className="flex-grow p-4 md:p-6 pb-24 md:pb-6 space-y-6 overflow-y-auto custom-scrollbar bg-[#FDFCFB]/80 font-sans">
              
              <div className="grid grid-cols-1 gap-5">
                <InputField 
                  label="NOMBRE DEL FALLO" 
                  value={synthesis.nombreFallo} 
                  onChange={(v) => handleSynthesisChange('nombreFallo', v)} 
                  isShort
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="FALLO" 
                    value={synthesis.fallos} 
                    onChange={(v) => handleSynthesisChange('fallos', v)} 
                    isShort 
                    placeholder="Tomo y página..."
                  />
                  <InputField 
                    label="AÑO" 
                    value={synthesis.anio} 
                    onChange={(v) => handleSynthesisChange('anio', v)} 
                    isShort
                  />
                </div>

                <InputField 
                  label="HECHOS" 
                  value={synthesis.hechos} 
                  onChange={(v) => handleSynthesisChange('hechos', v)} 
                />

                <InputField 
                  label="CUESTIONES PRESENTADAS" 
                  value={synthesis.cuestiones} 
                  onChange={(v) => handleSynthesisChange('cuestiones', v)} 
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="PRIMERA INSTANCIA" 
                    value={synthesis.primeraInstancia} 
                    onChange={(v) => handleSynthesisChange('primeraInstancia', v)} 
                  />
                  <InputField 
                    label="SEGUNDA INSTANCIA" 
                    value={synthesis.segundaInstancia} 
                    onChange={(v) => handleSynthesisChange('segundaInstancia', v)} 
                  />
                </div>

                <InputField 
                  label="TIPO DE JURISDICCIÓN INVOCADA PARA ACCEDER A LA CORTE SUPREMA" 
                  value={synthesis.jurisdiccionCorte} 
                  onChange={(v) => handleSynthesisChange('jurisdiccionCorte', v)} 
                />

                <div className="border border-outline-variant/30 rounded-xl p-4 bg-white/50 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 text-primary">
                    <label className="text-[11px] font-black uppercase tracking-widest">Opinión del Procurador General</label>
                  </div>
                  <InputField 
                    label="PRINCIPIOS ELABORADOS" 
                    value={synthesis.procuradorPrincipios} 
                    onChange={(v) => handleSynthesisChange('procuradorPrincipios', v)} 
                  />
                  <InputField 
                    label="RAZONAMIENTO" 
                    value={synthesis.procuradorRazonamiento} 
                    onChange={(v) => handleSynthesisChange('procuradorRazonamiento', v)} 
                  />
                </div>

                <div className="border border-outline-variant/30 rounded-xl p-4 bg-white/50 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 text-primary">
                    <label className="text-[11px] font-black uppercase tracking-widest">Opinión de la Corte Suprema</label>
                  </div>
                  <InputField 
                    label="PRINCIPIOS ELABORADOS" 
                    value={synthesis.cortePrincipios} 
                    onChange={(v) => handleSynthesisChange('cortePrincipios', v)} 
                  />
                  <InputField 
                    label="RAZONAMIENTO" 
                    value={synthesis.corteRazonamiento} 
                    onChange={(v) => handleSynthesisChange('corteRazonamiento', v)} 
                  />
                </div>

                <div className="border border-outline-variant/30 rounded-xl p-4 bg-white/50 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 text-primary">
                    <label className="text-[11px] font-black uppercase tracking-widest">Disidencia o concurrencia</label>
                  </div>
                  <InputField 
                    label="PRINCIPIOS ELABORADOS" 
                    value={synthesis.disidenciaPrincipios} 
                    onChange={(v) => handleSynthesisChange('disidenciaPrincipios', v)} 
                  />
                  <InputField 
                    label="RAZONAMIENTO" 
                    value={synthesis.disidenciaRazonamiento} 
                    onChange={(v) => handleSynthesisChange('disidenciaRazonamiento', v)} 
                  />
                </div>

                <InputField 
                  label="OBITER DICTUM SIGNIFICATIVO" 
                  value={synthesis.obiterDictum} 
                  onChange={(v) => handleSynthesisChange('obiterDictum', v)} 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 shrink-0">
                  <button 
                    onClick={handleSaveSynthesis}
                    className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold py-4 uppercase tracking-widest hover:bg-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 rounded-xl"
                  >
                    Guardar Progreso
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="bg-primary text-white text-xs font-bold py-4 uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-primary/15"
                  >
                    <Download size={16} />
                    <span>Descargar Ficha PDF</span>
                  </button>
                </div>

              </div>
            </div>
          </aside>

        </main>
        <BottomNav />
      </div>
    );
  };

  // --- Teacher Panel ---

  const TeacherPanel = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalStudents: 0, totalCases: 0, totalInteractions: 0, activeNow: 0 });
    const [students, setStudents] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [docs, setDocs] = useState<any[]>([]);
    
    // Forms states
    const [newStudent, setNewStudent] = useState({ name: "", legajo: "", email: "" });
    const [newCase, setNewCase] = useState({ caseId: "", title: "", year: "", tag: "", description: "", file: null as File | null });
    const [newDoc, setNewDoc] = useState({ title: "", category: "Fallo Principal", file: null as File | null });

    // Session Control States
    const [interactModal, setInteractModal] = useState<{ open: boolean, userName: string, caseId: string }>({ open: false, userName: "", caseId: "" });
    const [teacherMsg, setTeacherMsg] = useState("");

    const loadData = () => {
      fetch("/api/admin/stats").then(res => res.json()).then(setStats).catch(console.error);
      fetch("/api/admin/students").then(res => res.json()).then(data => setStudents(Array.isArray(data) ? data : [])).catch(console.error);
      fetch("/api/cases").then(res => res.json()).then(data => setCases(Array.isArray(data) ? data : [])).catch(console.error);
      fetch("/api/admin/activity").then(res => res.json()).then(data => setActivity(Array.isArray(data) ? data : [])).catch(console.error);
      fetch("/api/admin/docs").then(res => res.json()).then(data => setDocs(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => {
      loadData();
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
    }, []);

    const handleAddStudent = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newStudent.name || !newStudent.legajo) return;
      try {
        const res = await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent)
        });
        if (res.ok) {
          setNewStudent({ name: "", legajo: "", email: "" });
          loadData();
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleDeleteStudent = async (id: string) => {
      if (!confirm("¿Está seguro de eliminar este alumno?")) return;
      try {
        const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
        if (res.ok) loadData();
      } catch (err) {
        console.error(err);
      }
    };

    const handleUploadCase = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCase.caseId || !newCase.file) return alert("Por favor complete el ID del caso y seleccione un archivo.");

      const formData = new FormData();
      formData.append("caseId", newCase.caseId);
      formData.append("title", newCase.title);
      formData.append("year", newCase.year);
      formData.append("tag", newCase.tag);
      formData.append("description", newCase.description);
      formData.append("file", newCase.file);

      try {
        const res = await fetch("/api/admin/upload-case", {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          alert("Caso subido y vectorizado con éxito.");
          setNewCase({ caseId: "", title: "", year: "", tag: "", description: "", file: null });
          loadData();
        } else {
          const errData = await res.json();
          alert(`Error: ${errData.error}`);
        }
      } catch (err) {
        console.error(err);
        alert("Error de conexión al subir el caso.");
      }
    };

    const handleUploadDoc = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newDoc.title || !newDoc.file) return alert("Por favor complete el título y seleccione un archivo.");

      const formData = new FormData();
      formData.append("title", newDoc.title);
      formData.append("category", newDoc.category);
      formData.append("file", newDoc.file);

      try {
        const res = await fetch("/api/admin/upload-doc", {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          alert("Documento de acervo subido con éxito.");
          setNewDoc({ title: "", category: "Fallo Principal", file: null });
          loadData();
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleDeleteCase = async (id: string) => {
      if (!confirm("¿Está seguro de eliminar este caso?")) return;
      try {
        const res = await fetch(`/api/cases/${id}`, { method: "DELETE" });
        if (res.ok) loadData();
      } catch (err) {
        console.error(err);
      }
    };

    const handleSessionControl = async (action: 'interrupt' | 'resume' | 'suggest') => {
      try {
        const res = await fetch("/api/admin/interact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            userName: interactModal.userName,
            caseId: interactModal.caseId,
            message: teacherMsg
          })
        });
        if (res.ok) {
          if (action === 'suggest') {
            setTeacherMsg("");
            alert("Sugerencia enviada al alumno.");
          } else {
            alert(`Acción '${action}' ejecutada con éxito.`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header title="Panel del Profesor" />
        <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 space-y-12">
          
          {/* Row 1: Stats */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Alumnos Registrados", val: stats.totalStudents, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
              { label: "Casos Socráticos", val: stats.totalCases, icon: Scale, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { label: "Documentos Acervo", val: docs.length, icon: BookOpen, color: "text-amber-600 bg-amber-50 border-amber-100" },
              { label: "Total Interacciones", val: stats.totalInteractions, icon: Activity, color: "text-purple-600 bg-purple-50 border-purple-100" }
            ].map((st, i) => (
              <div key={i} className={cn("p-6 bg-white border rounded-xl flex items-center justify-between shadow-sm", st.color)}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">{st.label}</p>
                  <h4 className="text-3xl font-headline font-bold text-on-surface mt-1">{st.val}</h4>
                </div>
                <st.icon className="h-8 w-8 opacity-80" />
              </div>
            ))}
          </section>

          {/* Row 2: Management forms */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section A: Cases */}
            <section className="bg-white border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary uppercase tracking-wider border-b border-outline-variant pb-2 flex items-center gap-2">
                <UploadCloud size={20} />
                <span>Subir Caso Socrático</span>
              </h3>
              <form onSubmit={handleUploadCase} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">ID Único del Caso (ej: arenzon, gottschau)</label>
                  <input 
                    type="text" 
                    value={newCase.caseId} 
                    onChange={e => setNewCase(prev => ({ ...prev, caseId: e.target.value }))}
                    placeholder="ID del caso sin espacios..."
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Título del Fallo</label>
                  <input 
                    type="text" 
                    value={newCase.title} 
                    onChange={e => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Arenzon Gabriel c/ Estado Nacional..."
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Año</label>
                    <input 
                      type="number" 
                      value={newCase.year} 
                      onChange={e => setNewCase(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="Ej: 1984"
                      className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Etiqueta/Materia</label>
                    <input 
                      type="text" 
                      value={newCase.tag} 
                      onChange={e => setNewCase(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="Ej: Razonabilidad"
                      className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Descripción Breve</label>
                  <textarea 
                    value={newCase.description} 
                    onChange={e => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Introducción al caso para el alumno..."
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Documento Completo (PDF o TXT)</label>
                  <input 
                    type="file" 
                    accept=".pdf,.txt"
                    onChange={e => setNewCase(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                    required
                  />
                </div>
                <button className="w-full bg-primary text-white py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                  Cargar y Vectorizar
                </button>
              </form>
            </section>

            {/* Section B: Global Docs (Bibliografía) */}
            <section className="bg-white border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary uppercase tracking-wider border-b border-outline-variant pb-2 flex items-center gap-2">
                <Library size={20} />
                <span>Acervo Bibliográfico</span>
              </h3>
              <form onSubmit={handleUploadDoc} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Título del Documento</label>
                  <input 
                    type="text" 
                    value={newDoc.title} 
                    onChange={e => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Constitución Nacional Argentina..."
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Categoría</label>
                  <select 
                    value={newDoc.category} 
                    onChange={e => setNewDoc(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                  >
                    <option value="Fallo Principal">Fallo Principal</option>
                    <option value="Constitución">Constitución</option>
                    <option value="Tratados Internacionales">Tratados Internacionales</option>
                    <option value="Doctrina Cátedra">Doctrina Cátedra</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Archivo (PDF o TXT)</label>
                  <input 
                    type="file" 
                    accept=".pdf,.txt"
                    onChange={e => setNewDoc(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                    required
                  />
                </div>
                <button className="w-full bg-primary text-white py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                  Subir Documento
                </button>
              </form>
            </section>

            {/* Section C: Student register */}
            <section className="bg-white border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary uppercase tracking-wider border-b border-outline-variant pb-2 flex items-center gap-2">
                <Users size={20} />
                <span>Matricular Alumno</span>
              </h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={newStudent.name} 
                    onChange={e => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Elisa Belén Flores..."
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nº de Legajo</label>
                  <input 
                    type="text" 
                    value={newStudent.legajo} 
                    onChange={e => setNewStudent(prev => ({ ...prev, legajo: e.target.value }))}
                    placeholder="Ej: 44814605"
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={newStudent.email} 
                    onChange={e => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Ej: elisa@gmail.com"
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-xs focus:border-primary outline-none"
                  />
                </div>
                <button className="w-full bg-primary text-white py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                  Matricular en Aula Virtual
                </button>
              </form>
            </section>
          </div>

          {/* Row 3: Lists & Live monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List of active cases */}
            <div className="lg:col-span-1 bg-white border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary uppercase tracking-wider border-b border-outline-variant pb-2 flex items-center gap-2">
                <Scale size={20} />
                <span>Casos Socráticos Activos</span>
              </h3>
              <div className="divide-y divide-outline-variant/60 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cases.map((c) => (
                  <div key={c.id} className="py-4 flex justify-between items-center group">
                    <div>
                      <h5 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{c.title}</h5>
                      <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">Año: {c.year} • Etiqueta: {c.tag}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCase(c.id)}
                      className="p-2 text-on-surface-variant hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar Caso"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {cases.length === 0 && <p className="text-xs text-on-surface-variant italic py-4">No hay casos cargados.</p>}
              </div>
            </div>

            {/* List of enrolled students */}
            <div className="lg:col-span-1 bg-white border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary uppercase tracking-wider border-b border-outline-variant pb-2 flex items-center gap-2">
                <Users size={20} />
                <span>Alumnado Matriculado</span>
              </h3>
              <div className="divide-y divide-outline-variant/60 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {students.map((st) => (
                  <div key={st.id} className="py-4 flex justify-between items-center group">
                    <div>
                      <h5 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{st.name}</h5>
                      <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">Legajo: {st.legajo} • Email: {st.email || "N/C"}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteStudent(st.id)}
                      className="p-2 text-on-surface-variant hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      title="Dar de Baja"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {students.length === 0 && <p className="text-xs text-on-surface-variant italic py-4">No hay alumnos matriculados.</p>}
              </div>
            </div>

            {/* Real-time interaction tracker */}
            <div className="lg:col-span-1 bg-white border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary uppercase tracking-wider border-b border-outline-variant pb-2 flex items-center gap-2">
                <Activity size={20} />
                <span>Monitoreo en Tiempo Real</span>
              </h3>
              <div className="divide-y divide-outline-variant/60 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {activity.map((act) => (
                  <div key={act.id} className="py-4 space-y-2 group relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-xs text-primary">{act.userName}</span>
                        <span className="text-[9px] text-on-surface-variant/70 uppercase font-semibold ml-2">Caso: {act.caseTitle}</span>
                      </div>
                      <span className="text-[9px] text-on-surface-variant/40 font-bold">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {act.messages && act.messages.slice(-1).map((msg: any, i: number) => (
                      <div key={i} className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40 text-[11px] leading-relaxed italic text-on-surface-variant font-medium">
                        <span className="font-bold text-[9px] uppercase tracking-wider text-primary block not-italic mb-1">Último Mensaje Alumno:</span>
                        "{msg.text}"
                      </div>
                    ))}

                    <button
                      onClick={() => setInteractModal({ open: true, userName: act.userName, caseId: act.caseTitle })}
                      className="mt-2 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                      <span>Intervenir Diálogo</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
                {activity.length === 0 && <p className="text-xs text-on-surface-variant italic py-4">Sin actividad reciente de alumnos.</p>}
              </div>
            </div>

          </div>

        </main>

        {/* Intervention Modal */}
        <AnimatePresence>
          {interactModal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-outline-variant rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-start border-b border-outline-variant pb-2">
                  <div>
                    <h3 className="text-xl font-headline font-bold text-primary uppercase tracking-wider">Panel de Intervención Socrática</h3>
                    <p className="text-xs text-on-surface-variant mt-1 font-semibold uppercase">Alumno: {interactModal.userName} • Caso: {interactModal.caseId}</p>
                  </div>
                  <button 
                    onClick={() => setInteractModal({ open: false, userName: "", caseId: "" })}
                    className="text-on-surface-variant hover:text-on-surface text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleSessionControl('interrupt')}
                    className="w-full bg-red-700 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-800 transition-all flex items-center justify-center gap-2 rounded-xl"
                  >
                    Pausar Sesión (Interrupción Directa)
                  </button>
                  
                  <button 
                    onClick={() => handleSessionControl('resume')}
                    className="w-full bg-emerald-700 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 rounded-xl"
                  >
                    Reanudar Sesión (Quitar Pausa)
                  </button>

                  <div className="space-y-2 pt-4">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Enviar Sugerencia o Pista Directa</label>
                    <textarea 
                      value={teacherMsg}
                      onChange={e => setTeacherMsg(e.target.value)}
                      placeholder="Ej: Te recomiendo revisar el artículo 28 de la Constitución Nacional en relación al principio de razonabilidad..."
                      className="w-full bg-surface border border-outline-variant p-3 text-xs focus:border-primary outline-none"
                      rows={4}
                    />
                    <button 
                      onClick={() => handleSessionControl('suggest')}
                      className="bg-primary text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center gap-2"
                    >
                      Enviar Pista/Sugerencia
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    );
  };

  const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
    const { user, userData, loading, isAdmin } = useAuth();

    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

    if (!user) return <Navigate to="/" />;
    if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;

    return <>{children}</>;
  };

  // --- App ---

  export default function App() {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/casos" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat/:caseId" element={<ProtectedRoute><ChatCase /></ProtectedRoute>} />
            <Route path="/teacher" element={<ProtectedRoute requireAdmin><TeacherPanel /></ProtectedRoute>} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
