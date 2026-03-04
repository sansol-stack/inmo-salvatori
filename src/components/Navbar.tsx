import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Verificamos si estamos en el Home, ya que el efecto transparente 
  // suele lucir mejor sobre el Hero de la página principal.
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // 1. Lógica de Transparencia
      setIsAtTop(currentScrollY < 50);

      // 2. Lógica de Ocultar/Mostrar
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Baja -> Esconde
      } else {
        setIsVisible(true); // Sube -> Muestra
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Definimos las clases dinámicas según el estado del scroll
  // Si está en el tope y es el Home, es transparente. Si no, es blanco.
  const navbarBg = isAtTop && isHomePage
    ? "bg-transparent border-transparent"
    : "bg-white/95 backdrop-blur-md border-b border-brand-light-gray shadow-sm";

  const textColor = isAtTop && isHomePage
    ? "text-white"
    : "text-brand-dark";

  const logoColor = isAtTop && isHomePage
    ? "text-white"
    : "text-brand-dark";

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${navbarBg} ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link to="/" className="flex flex-col items-start leading-tight">
          <span className={`font-display text-2xl font-black tracking-tighter transition-colors duration-500 ${logoColor}`}>
            Silvina<span className={isAtTop && isHomePage ? "text-white/90" : "text-brand-magenta"}>Salvatori</span>
          </span>
          <span className={`text-[10px] font-body font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${isAtTop && isHomePage ? "text-white/70" : "text-muted-foreground"}`}>
            Excelencia Inmobiliaria
          </span>
        </Link>

        {/* NAVIGATION & ACTION */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`hover:text-brand-magenta font-body text-xs font-bold uppercase tracking-widest transition-all ${textColor}`}>
              Propiedades
            </Link>
            {/* <Link to="/admin" className={`hover:text-brand-magenta font-body text-xs font-bold uppercase tracking-widest transition-all ${textColor}`}>
              Panel Admin
            </Link> */}
          </div>
          
          <a 
            href="https://wa.me/+5493489497532" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-none font-body text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${
              isAtTop && isHomePage 
              ? "bg-white text-brand-dark hover:bg-brand-magenta hover:text-white" 
              : "bg-brand-magenta text-white hover:bg-brand-dark"
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Contactar</span>
          </a>
        </div>
      </div>
    </nav>
  );
}