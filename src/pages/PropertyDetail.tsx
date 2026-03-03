import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProperty } from '@/hooks/useProperties';
import { useState } from 'react';
import SinglePropertyMap from "@/components/SinglePropertyMap";

function formatPrice(price: number, type: string, currency: string = 'ARS') {
  // Configuramos el formato según la moneda
  const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-AR', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  });

  let priceString = formatter.format(price);

  // Ajuste estético para Argentina: el formato USD suele ponerse como U$S
  if (currency === 'USD') {
    priceString = priceString.replace('$', 'U$S ');
  }

  return type === 'rent' ? `${priceString}/mes` : priceString;
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id || '');
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 py-12">
          <Skeleton className="h-[500px] w-full rounded-none mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-16 flex-1 flex items-center justify-center">
          <p className="text-brand-dark font-body text-lg">Propiedad no encontrada.</p>
        </div>
      </div>
    );
  }

  const images = property.image_urls?.length > 0 ? property.image_urls : ['/placeholder.svg'];
  const whatsappUrl = `https://wa.me/54911XXXXXXXX?text=${encodeURIComponent(
    `Hola Silvina, me interesa la propiedad "${property.title}" que vi en tu web.`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="pt-20 flex-1">
        {/* Gallery Section - Full Width Look */}
        <div className="bg-brand-gray/20 border-b border-brand-light-gray">
          <div className="container mx-auto px-4 py-6">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-dark/60 hover:text-brand-magenta font-body text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Volver al listado
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[400px] md:h-[600px]">
              {/* Main Image */}
              <div className="lg:col-span-9 rounded-none overflow-hidden relative group">
                <img
                  src={images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 flex gap-2">
                   <Badge className="bg-brand-magenta text-white border-none rounded-none px-4 py-1 text-[10px] tracking-widest uppercase font-bold shadow-xl">
                    {property.type === 'sale' ? 'En Venta' : 'Alquiler'}
                  </Badge>
                </div>
              </div>

              {/* Thumbnails Sidebar */}
              <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative flex-shrink-0 w-24 lg:w-full h-24 lg:h-32 rounded-none overflow-hidden transition-all ${
                      i === selectedImage ? 'ring-2 ring-brand-magenta ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="mb-8 border-b border-brand-light-gray pb-8">
                <h1 className="font-display text-4xl md:text-5xl font-black text-brand-dark mb-4 leading-none uppercase tracking-tighter">
                  {property.title}
                </h1>
                <p className="flex items-center gap-2 text-brand-magenta font-body font-bold text-sm uppercase tracking-widest">
                  <MapPin className="h-4 w-4" /> {property.location}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="bg-brand-gray/40 p-6 flex flex-col items-center justify-center text-center">
                  <BedDouble className="h-6 w-6 text-brand-magenta mb-2" />
                  <span className="text-xl font-display font-bold text-brand-dark">{property.rooms}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dormitorios</span>
                </div>
                <div className="bg-brand-gray/40 p-6 flex flex-col items-center justify-center text-center">
                  <Bath className="h-6 w-6 text-brand-magenta mb-2" />
                  <span className="text-xl font-display font-bold text-brand-dark">{property.bathrooms}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Baños</span>
                </div>
                <div className="bg-brand-gray/40 p-6 flex flex-col items-center justify-center text-center">
                  <Maximize className="h-6 w-6 text-brand-magenta mb-2" />
                  <span className="text-xl font-display font-bold text-brand-dark">{property.sqft}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Metros²</span>
                </div>
              </div>

              <div className="prose prose-brand max-w-none">
                <h2 className="font-display text-2xl font-bold text-brand-dark mb-6 uppercase tracking-tight border-l-4 border-brand-magenta pl-4">
                  Sobre esta propiedad
                </h2>
                <p className="text-brand-dark/80 font-body text-lg leading-relaxed whitespace-pre-line mb-8">
                  {property.description}
                </p>
              </div>

              {/* Sección del Mapa */}
<div className="mt-12 pt-12 border-t border-brand-light-gray">
  <h2 className="font-display text-2xl font-bold text-brand-dark mb-6 uppercase tracking-tight border-l-4 border-brand-magenta pl-4 flex items-center gap-3">
    Ubicación Geográfica
  </h2>
  
  {property.lat && property.lng ? (
    <div className="space-y-4">
      <div className="h-[400px] w-full overflow-hidden group">
        <SinglePropertyMap 
          lat={Number(property.lat)} 
          lng={Number(property.lng)} 
          address={property.location} 
        />
      </div>
      
      {/* Botón dinámico para abrir en Google Maps (Cómo llegar) */}
      <Button 
        variant="outline" 
        className="w-full md:w-auto border-brand-magenta text-brand-magenta hover:bg-brand-magenta hover:text-white rounded-none font-bold uppercase text-[10px] tracking-widest px-8 transition-all"
        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`, '_blank')}
      >
        <MapPin className="h-3 w-3 mr-2" />
        Cómo llegar con Google Maps
      </Button>
    </div>
  ) : (
    <div className="bg-brand-gray/20 p-12 text-center border-2 border-dashed border-brand-light-gray">
      <MapPin className="h-8 w-8 text-brand-dark/20 mx-auto mb-4" />
      <p className="text-brand-dark/60 font-body text-sm italic">
        La ubicación exacta está disponible mediante consulta privada.
      </p>
    </div>
  )}
</div>
            </div>

            {/* Sticky Contact Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-brand-dark text-white p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/10 rounded-full -mr-16 -mt-16" />
                
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-magenta mb-2">Valor de la Propiedad</p>
                <p className="text-4xl font-display font-black mb-8">
                  {formatPrice(property.price, property.type, property.currency)}
                </p>
                
                <div className="space-y-4 relative z-10">
                  <Button asChild className="w-full bg-brand-magenta hover:bg-white hover:text-brand-dark transition-all h-14 rounded-none border-none">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                      <MessageCircle className="h-5 w-5" />
                      Consulta por WhatsApp
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-14 rounded-none">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar ahora
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest text-center leading-relaxed">
                    Referencia de propiedad: #{property.id.slice(0, 8).toUpperCase()}<br/>
                    Silvina Salvatori - Excelencia Inmobiliaria
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}