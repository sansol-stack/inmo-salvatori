import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { themeConfig } from '@/config/theme.config';

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 50);
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const navbarBg = isAtTop && isHomePage
    ? "bg-transparent border-transparent"
    : "bg-white/95 backdrop-blur-md border-b border-brand-light-gray shadow-sm";

  const textColor = isAtTop && isHomePage ? "text-white" : "text-brand-dark";
  const logoColor = isAtTop && isHomePage ? "text-white" : "text-brand-dark";

  // Extraemos el nombre en dos partes: todo menos el highlight, y el highlight
  const nameStart = themeConfig.brand.name.replace(themeConfig.brand.nameHighlight, '');
  const whatsappUrl = `https://wa.me/${themeConfig.contact.whatsapp}?text=${encodeURIComponent(themeConfig.contact.whatsappMessage)}`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${navbarBg} ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex flex-col items-start leading-tight">
          <span className={`font-display text-2xl font-black tracking-tighter transition-colors duration-500 ${logoColor}`}>
            {nameStart}
            <span className={isAtTop && isHomePage ? "text-white/90" : "text-brand-magenta"}>
              {themeConfig.brand.nameHighlight}
            </span>
          </span>
          <span className={`text-[10px] font-body font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
            isAtTop && isHomePage ? "text-white/70" : "text-muted-foreground"
          }`}>
            {themeConfig.brand.tagline}
          </span>
        </Link>

        {/* NAV & ACCIÓN */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`hover:text-brand-magenta font-body text-xs font-bold uppercase tracking-widest transition-all ${textColor}`}
            >
              Propiedades
            </Link>
          </div>

          <a
            href={whatsappUrl}
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