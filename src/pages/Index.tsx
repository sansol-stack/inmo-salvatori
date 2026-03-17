import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, List as ListIcon, SlidersHorizontal, X } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import PropertyMap from "@/components/PropertyMap";
import { Footer } from "@/components/Footer";
import { themeConfig } from "@/config/theme.config";
import type { PropertyType } from "@/types/property";

const Index = () => {
  const { data: properties, isLoading } = useProperties();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyType | 'all'>('all');
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const activeFiltersCount = [
    typeFilter !== 'all',
    propertyTypeFilter !== 'all',
    minPrice !== '',
    maxPrice !== '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter('all');
    setPropertyTypeFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  const filteredProperties = properties?.filter(p => {
    // 1. Filtro de status
    const isVisible =
      p.status === 'available' ||
      p.status === 'reserved' ||
      (p.status === 'sold' && p.sold_at &&
        Math.ceil((new Date().getTime() - new Date(p.sold_at).getTime())
          / (1000 * 60 * 60 * 24)) <= 30);
    if (!isVisible) return false;

    // 2. Filtro por tipo de operación
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;

    // 3. Filtro por tipo de propiedad
    if (propertyTypeFilter !== 'all' && p.property_type !== propertyTypeFilter) return false;

    // 4. Filtro por precio mínimo
    if (minPrice && p.price < Number(minPrice)) return false;

    // 5. Filtro por precio máximo
    if (maxPrice && p.price > Number(maxPrice)) return false;

    // 6. Filtro por búsqueda de texto
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle    = p.title?.toLowerCase().includes(q);
      const matchesLocation = p.location?.toLowerCase().includes(q);
      const matchesDesc     = p.description?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesLocation && !matchesDesc) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <HeroSection onSearch={(query) => setSearchQuery(query)} />

      {/* BARRA DE CONTROLES */}
      <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Izquierda: contador + botón filtros */}
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground font-medium">
              {filteredProperties?.length || 0} propiedades encontradas
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 h-9 border rounded-full text-sm font-bold text-brand-magenta border-brand-magenta/20 hover:bg-brand-magenta hover:text-white transition-all"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-brand-magenta text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand-magenta transition-colors"
              >
                <X className="h-3 w-3" /> Limpiar
              </button>
            )}
          </div>

          {/* Derecha: toggle lista/mapa */}
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

        {/* PANEL DE FILTROS — se expande al hacer clic */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-brand-light-gray rounded-lg animate-fade-in">

            {/* Operación */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Operación
              </label>
              <select
                className="border rounded-lg px-3 h-9 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-magenta"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="sale">Venta</option>
                <option value="rent">Alquiler</option>
              </select>
            </div>

            {/* Tipo de propiedad */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Tipo
              </label>
              <select
                className="border rounded-lg px-3 h-9 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-magenta"
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value as PropertyType | 'all')}
              >
                {themeConfig.propertyTypes.map(pt => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>

            {/* Precio mínimo */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Precio desde
              </label>
              <input
                type="number"
                placeholder="Sin mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border rounded-lg px-3 h-9 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-magenta"
              />
            </div>

            {/* Precio máximo */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Precio hasta
              </label>
              <input
                type="number"
                placeholder="Sin máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded-lg px-3 h-9 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-magenta"
              />
            </div>
          </div>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-brand-magenta border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Buscando las mejores opciones...</p>
          </div>
        ) : filteredProperties?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-muted-foreground text-lg">No se encontraron propiedades con esos filtros.</p>
            <button
              onClick={clearFilters}
              className="text-brand-magenta font-bold text-sm hover:underline"
            >
              Limpiar filtros
            </button>
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
      <Footer />
    </div>
  );
};

export default Index;