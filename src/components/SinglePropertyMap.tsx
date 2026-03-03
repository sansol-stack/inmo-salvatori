import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix de iconos
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Props {
  lat: number;
  lng: number;
  address: string;
}

export default function SinglePropertyMap({ lat, lng, address }: Props) {
  // Forzamos tipos para evitar errores de TS
  const Map = MapContainer as any;
  const Tile = TileLayer as any;
  const MapMarker = Marker as any;

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border shadow-sm mt-8">
      <Map 
        center={[lat, lng]} 
        zoom={15} 
        scrollWheelZoom={false} // Desactivado para no molestar al hacer scroll en la página
        className="h-full w-full"
      >
        <Tile
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />




        <MapMarker position={[lat, lng]} icon={DefaultIcon}>
          <Popup>{address}</Popup>
        </MapMarker>
      </Map>
    </div>
  );
}