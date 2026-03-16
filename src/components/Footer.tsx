import { Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import { themeConfig } from '@/config/theme.config';

export function Footer() {
  const { brand, contact, footer } = themeConfig;

  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;
  const emailUrl = `mailto:${contact.email}?subject=${encodeURIComponent(contact.emailSubject)}`;
  const developerUrl = `https://wa.me/${footer.developerWhatsapp}?text=${encodeURIComponent(footer.developerMessage)}`;
  const nameStart = brand.name.replace(brand.nameHighlight, '');

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t-4 border-brand-magenta">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Columna 1: Branding */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <span className="font-display text-2xl font-black tracking-tighter uppercase">
                {nameStart}<span className="text-brand-magenta">{brand.nameHighlight}</span>
              </span>
              <p className="text-[10px] font-body font-bold text-brand-magenta tracking-[0.3em] uppercase mt-1">
                {brand.tagline}
              </p>
            </div>
            <p className="text-white/50 font-body text-sm leading-relaxed max-w-xs">
              {footer.tagline}
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold uppercase tracking-widest text-white mb-6 text-center md:text-left">
              Contacto
            </h4>
            <div className="space-y-4">
              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-brand-magenta transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-magenta transition-all shrink-0">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-sm leading-tight">{contact.address}</span>
                  <span className="font-body text-[10px] uppercase tracking-widest opacity-60">{contact.city}</span>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-brand-magenta transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-magenta transition-all shrink-0">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="font-body text-sm">{contact.whatsapp}</span>
              </a>

              <a
                href={emailUrl}
                className="flex items-center gap-3 text-white/70 hover:text-brand-magenta transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-magenta transition-all shrink-0">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="font-body text-sm lowercase">{contact.email}</span>
              </a>
            </div>
          </div>

          {/* Columna 3: Redes */}
          <div>
            <h4 className="font-display text-lg font-bold uppercase tracking-widest text-white mb-6">
              Seguinos
            </h4>
            <div className="flex gap-4">
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-brand-magenta transition-all duration-300 rounded-none">
                  <Instagram className="h-5 w-5 text-white" />
                </a>
              )}
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-brand-magenta transition-all duration-300 rounded-none">
                  <Facebook className="h-5 w-5 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 font-body text-[10px] uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          <a
            href={developerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 font-body text-[10px] uppercase tracking-widest"    >      
            Desarrollado por <span className="text-white/60 font-bold hover:text-brand-magenta cursor-pointer">{footer.developerName}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}