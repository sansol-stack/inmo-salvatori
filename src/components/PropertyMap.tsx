import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import type { Property } from '@/types/property';
import 'leaflet/dist/leaflet.css';

// Función para crear el Pin con Precio (Estilo Airbnb)
const createPriceIcon = (price: number, currency: string, type: string) => {
  const formattedPrice = price >= 1000000 
    ? (price / 1000000).toFixed(1) + 'M' 
    : price >= 1000 
    ? (price / 1000).toFixed(0) + 'k' 
    : price;
    
  const symbol = currency === 'USD' ? 'U$S' : '$';
  const bgColor = type === 'sale' ? '#D12E7B' : '#1A1F2C'; 

  return L.divIcon({
    className: 'custom-price-marker',
    // Usamos un div sin dimensiones fijas para que crezca con el texto
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        padding: 5px 10px;
        border-radius: 8px;
        font-weight: 800;
        font-size: 13px;
        font-family: 'Montserrat', sans-serif;
        border: 1.5px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        transform: translate(-50%, -50%);
        min-width: fit-content;
      ">
        <span style="font-size: 10px; margin-right: 3px; opacity: 0.9;">${symbol}</span>
        ${formattedPrice}
      </div>
    `,
    // Importante: ponemos 0,0 para que no fuerce un tamaño al contenedor de Leaflet
    iconSize: [0, 0], 
    iconAnchor: [0, 0],
  });
};
interface Props {
  properties: Property[];
}

export default function PropertyMap({ properties }: Props) {
  const navigate = useNavigate();
  const defaultCenter: [number, number] = [-34.1633, -58.9592]; // Campana

  // Forzamos el tipado para evitar errores de TS en MapContainer y LayersControl
  const Map = MapContainer as any;
  const Tile = TileLayer as any;
  const Layers = LayersControl as any;
  const MapMarker = Marker as any; // Añadimos esta línea

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border shadow-2xl bg-slate-100 relative group">
      <Map 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <Layers position="topright">
          {/* MODO MINIMALISTA (Por defecto) */}
          <Layers.BaseLayer checked name="Minimalista">
            <Tile
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
          </Layers.BaseLayer>

          {/* MODO NOCTURNO */}
          <Layers.BaseLayer name="Modo Noche">
            <Tile
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
          </Layers.BaseLayer>

          {/* MODO SATELITE */}
          <Layers.BaseLayer name="Satélite">
            <Tile
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri'
            />
          </Layers.BaseLayer>
        </Layers>
        
        {properties.map((prop) => {
  const p = prop as any; 
  const lat = Number(p.lat);
  const lng = Number(p.lng);
  
  if (!lat || !lng) return null;

  return (
    <MapMarker // Usamos la constante MapMarker (que es "any")
      key={prop.id} 
      position={[lat, lng]}
      icon={createPriceIcon(prop.price, prop.currency, prop.type)}
    >
      <Popup>
        <div className="w-48 font-body p-1">
          {prop.image_urls?.[0] && (
            <img src={prop.image_urls[0]} className="w-full h-24 object-cover rounded-lg mb-2" alt="" />
          )}
          <h3 className="font-bold text-sm leading-tight text-brand-dark">{prop.title}</h3>
          <p className="text-brand-magenta font-black mt-1 text-sm uppercase">
            {prop.type === 'sale' ? 'Venta' : 'Alquiler'}
          </p>
          <button 
            onClick={() => navigate(`/propiedad/${prop.id}`)}
            className="w-full bg-brand-magenta text-white text-[10px] py-2 mt-2 rounded-md uppercase font-bold shadow-md hover:bg-brand-dark transition-all"
          >
            Ver Detalles
          </button>
        </div>
      </Popup>
    </MapMarker>
  );
})}
      </Map>
    </div>
  );
}