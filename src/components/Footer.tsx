import { Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t-4 border-brand-magenta">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Columna 1: Branding */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <span className="font-display text-2xl font-black tracking-tighter uppercase">
                Silvina<span className="text-brand-magenta">Salvatori</span>
              </span>
              <p className="text-[10px] font-body font-bold text-brand-magenta tracking-[0.3em] uppercase mt-1">
                Excelencia Inmobiliaria
              </p>
            </div>
            <p className="text-white/50 font-body text-sm leading-relaxed max-w-xs">
              Transformando sueños en hogares con profesionalismo y calidez humana en la zona de Campana y alrededores.
            </p>
          </div>

          {/* Columna 2: Contacto Directo */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold uppercase tracking-widest text-white mb-6">
              Contacto
            </h4>
            <div className="flex items-center gap-3 text-white/70 hover:text-brand-magenta transition-colors group">
              <div className="p-2 bg-white/5 group-hover:bg-brand-magenta/10 transition-colors">
                <MapPin className="h-4 w-4 text-brand-magenta" />
              </div>
              <span className="font-body text-sm">Campana, Buenos Aires, Argentina</span>
            </div>
            <div className="flex items-center gap-3 text-white/70 hover:text-brand-magenta transition-colors group">
              <div className="p-2 bg-white/5 group-hover:bg-brand-magenta/10 transition-colors">
                <Phone className="h-4 w-4 text-brand-magenta" />
              </div>
              <span className="font-body text-sm">+54 9 03489 49-7532</span>
            </div>
            <div className="flex items-center gap-3 text-white/70 hover:text-brand-magenta transition-colors group">
              <div className="p-2 bg-white/5 group-hover:bg-brand-magenta/10 transition-colors">
                <Mail className="h-4 w-4 text-brand-magenta" />
              </div>
              <span className="font-body text-sm">contacto@silvinasalvatori.com</span>
            </div>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div>
            <h4 className="font-display text-lg font-bold uppercase tracking-widest text-white mb-6">
              Seguinos
            </h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/inmosilvinasalvatori" target='_blank' className="p-3 bg-white/5 hover:bg-brand-magenta transition-all duration-300 rounded-none group">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="https://www.facebook.com/SilvinaSalvatoriInmobiliaria" target='_blank' className="p-3 bg-white/5 hover:bg-brand-magenta transition-all duration-300 rounded-none group">
                <Facebook className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior de Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 font-body text-[10px] uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} Silvina Salvatori. Todos los derechos reservados.
          </p>
          <p className="text-white/30 font-body text-[10px] uppercase tracking-widest">
            Diseño por <span className="text-white/60 font-bold hover:text-brand-magenta cursor-pointer">Sansol Stack</span>
          </p>
        </div>
      </div>
    </footer>
  );
}