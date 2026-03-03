import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, List as ListIcon } from "lucide-react";
import { HeroSection } from "@/components/HeroSection"; // Importamos tu Hero original
import PropertyMap from "@/components/PropertyMap";

const Index = () => {
  const { data: properties, isLoading } = useProperties();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Estados para los filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Lógica de filtrado
  const filteredProperties = properties?.filter((p) => {
    const matchesSearch = 
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      {/* RESTAURAMOS TU HERO SECTION ORIGINAL */}
      <HeroSection onSearch={(query) => setSearchQuery(query)} />

      {/* CONTROLES DE VISTA Y FILTRO RÁPIDO */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground font-medium">
            {filteredProperties?.length || 0} propiedades encontradas
          </p>
          {/* Selector de Venta/Alquiler */}
          <select 
            className="border rounded-full px-4 h-9 bg-white text-sm font-bold text-brand-magenta border-brand-magenta/20 focus:outline-none focus:ring-2 focus:ring-brand-magenta"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Todas las operaciones</option>
            <option value="sale">Venta</option>
            <option value="rent">Alquiler</option>
          </select>
        </div>

        <div className="flex bg-white border rounded-lg overflow-hidden shadow-sm">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            className={`rounded-none h-10 px-6 ${viewMode === 'list' ? 'bg-brand-magenta hover:bg-brand-magenta/90' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4 mr-2" /> Lista
          </Button>
          <Button 
            variant={viewMode === 'map' ? 'default' : 'ghost'} 
            className={`rounded-none h-10 px-6 ${viewMode === 'map' ? 'bg-brand-magenta hover:bg-brand-magenta/90' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="h-4 w-4 mr-2" /> Mapa
          </Button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-brand-magenta border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Buscando las mejores opciones...</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredProperties?.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-2xl overflow-hidden border shadow-2xl animate-fade-in bg-slate-100">
             <PropertyMap properties={filteredProperties || []} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;