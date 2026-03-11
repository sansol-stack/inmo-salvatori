import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/types/property';

function formatPrice(price: number, type: string, currency: string = 'ARS') {
  // 1. Validamos si el precio es 0 o no existe
  if (!price || price === 0) {
    return "CONSULTAR";
  }

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
export function PropertyCard({ property }: { property: Property }) {
  const imageUrl = property.image_urls?.[0] || '/placeholder.svg';

  return (
    <Link
      to={`/propiedad/${property.id}`}
      className="group block bg-white rounded-none overflow-hidden border-b-4 border-transparent hover:border-brand-magenta transition-all duration-300 shadow-sm hover:shadow-xl"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-6 left-0 z-10">
          {/* badge / ribbon at top-left showing price or status */}
        <div className={`text-white font-display font-bold py-0.5 px-4 shadow-lg flex items-center relative
      ${property.status === 'available' ? 'bg-brand-magenta' :
        property.status === 'reserved' ? 'bg-yellow-600' :
        property.status === 'rented' ? 'bg-brand-dark' :
        property.status === 'sold' ? 'bg-brand-dark' :
        'bg-brand-dark'}
      after:content-[''] after:absolute after:left-full after:top-0 
      after:border-y-[16px] after:border-y-transparent 
      after:border-l-[12px] ${property.status === 'available' ? 'after:border-l-brand-magenta' :
        property.status === 'reserved' ? 'after:border-l-yellow-600' :
        'after:border-l-brand-dark'}`}>

            <span className="text-lg tracking-tight uppercase">
              {property.status === 'available'
                ? formatPrice(property.price, property.type, property.currency)
                : property.status === 'reserved'
                  ? 'RESERVADA'
                  : property.status === 'rented'
                    ? 'ALQUILADA'
                    : property.status === 'sold'
                      ? 'VENDIDA'
                      : ''}
            </span>
          </div>
        </div>

        {/* TIPO DE OPERACIÓN (Venta/Alquiler) */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Badge className="bg-white/90 text-brand-dark border-none hover:bg-white font-bold uppercase text-[10px] tracking-widest">
            {property.type === 'sale' ? 'Venta' : 'Alquiler'}
          </Badge>
          {property.featured && (
            <Badge className="bg-brand-magenta text-white border-none font-bold uppercase text-[10px] tracking-widest">
              Destacada
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 bg-brand-gray/30">
        <h3 className="font-display text-xl font-bold text-brand-dark mb-1 uppercase tracking-tight line-clamp-1 group-hover:text-brand-magenta transition-colors">
          {property.title}
        </h3>

        <p className="flex items-center gap-1 text-muted-foreground text-sm mb-4 font-body italic">
          <MapPin className="h-3.5 w-3.5 text-brand-magenta" />
          {property.location}
        </p>

        <div className="grid grid-cols-3 gap-2 text-[12px] text-brand-dark font-bold font-body border-t border-brand-light-gray pt-4">
          <span className="flex flex-col items-center gap-1">
            <BedDouble className="h-4 w-4 text-brand-magenta" />
            <span>{property.rooms} DORM.</span>
          </span>
          <span className="flex flex-col items-center gap-1 border-x border-brand-light-gray">
            <Bath className="h-4 w-4 text-brand-magenta" />
            <span>{property.bathrooms} BAÑO</span>
          </span>
          <span className="flex flex-col items-center gap-1">
            <Maximize className="h-4 w-4 text-brand-magenta" />
            <span>{property.sqft} m²</span>
          </span>
        </div>
      </div>
    </Link>
  );
}