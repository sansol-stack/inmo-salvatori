import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo con Zoom suave */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
          alt="Propiedad de lujo"
          className="w-full h-full object-cover scale-105 animate-[infinite-zoom_20s_ease-in-out_infinite]"
        />
        {/* Overlay degradado que permite leer el texto pero mantiene la luz */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mt-20">
        <div className="max-w-2xl animate-fade-in">
          {/* Badge superior opcional */}
          <span className="inline-block bg-brand-magenta text-white text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 mb-4">
            Excelencia en Campana
          </span>
          
          <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9] uppercase tracking-tighter">
            Tu próxima <br />
            <span className="text-brand-magenta">inversión</span> empieza aquí
          </h1>
          
          <p className="font-body text-lg md:text-xl text-white/90 mb-10 max-w-lg leading-relaxed font-light">
            Encuentra propiedades exclusivas con el respaldo y la trayectoria de <span className="font-bold">Silvina Salvatori</span>.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-0 shadow-2xl overflow-hidden">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-magenta" />
              <Input
                placeholder="¿Qué estás buscando? (Zona, ciudad...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-16 bg-white border-none text-brand-dark font-body rounded-none focus-visible:ring-0 text-lg"
              />
            </div>
            <Button 
              type="submit" 
              className="h-16 px-8 bg-brand-magenta text-white hover:bg-brand-dark transition-colors font-bold uppercase tracking-widest rounded-none border-none"
            >
              Buscar Ahora
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}