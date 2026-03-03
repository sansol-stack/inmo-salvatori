import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Upload, Loader2, ArrowLeft, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '@/types/property';

interface Props {
  property?: Property | null;
  onSubmit: (data: any) => void; 
  onCancel: () => void;
  loading: boolean;
}

export function AdminPropertyForm({ property, onSubmit, onCancel, loading }: Props) {
  // ESTADOS BÁSICOS
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [location, setLocation] = useState('');
  
  // ESTADOS DE GEOLOCALIZACIÓN
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [rawCoords, setRawCoords] = useState('');

  // ESTADOS DE ATRIBUTOS
  const [rooms, setRooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [sqft, setSqft] = useState('0');
  const [type, setType] = useState<'sale' | 'rent'>('sale');
  const [featured, setFeatured] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setDescription(property.description || '');
      setPrice(String(property.price));
      // @ts-ignore
      setCurrency(property.currency || 'ARS');
      setLocation(property.location);
      
      // Cargar coordenadas si existen
      const p = property as any;
      if (p.lat && p.lng) {
        setLat(String(p.lat));
        setLng(String(p.lng));
        setRawCoords(`${p.lat}, ${p.lng}`);
      }

      setRooms(String(property.rooms));
      setBathrooms(String(property.bathrooms));
      setSqft(String(property.sqft));
      setType(property.type);
      setFeatured(property.featured);
      setImageUrls(property.image_urls || []);
    }
  }, [property]);

  // LÓGICA DE COORDENADAS (Limpieza de pegado)
  const handleCoordsChange = (value: string) => {
    setRawCoords(value);
    if (value.includes(',')) {
      const parts = value.split(',');
      if (parts.length >= 2) {
        const cleanedLat = parts[0].replace(/[()]/g, '').trim();
        const cleanedLng = parts[1].replace(/[()]/g, '').trim();
        setLat(cleanedLat);
        setLng(cleanedLng);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const newUrls: string[] = [...imageUrls];

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 11)}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('property-images').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(fileName);
        newUrls.push(publicUrl);
      } catch (error: any) {
        toast.error(`Error: ${error.message}`);
      }
    }
    setImageUrls(newUrls);
    setIsUploading(false);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newUrls = [...imageUrls];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newUrls.length) return;
    [newUrls[index], newUrls[targetIndex]] = [newUrls[targetIndex], newUrls[index]];
    setImageUrls(newUrls);
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Limpiador de seguridad: Convertimos a número y limitamos a 6 decimales
  const cleanLat = lat ? parseFloat(parseFloat(lat).toFixed(6)) : null;
  const cleanLng = lng ? parseFloat(parseFloat(lng).toFixed(6)) : null;

  // Validación extra antes de enviar
  if (lat && isNaN(cleanLat as number)) {
    toast.error("La latitud no es un número válido");
    return;
  }

  onSubmit({
    title,
    description: description || null,
    price: Number(price),
    currency,
    location,
    lat: cleanLat, // Enviamos el número limpio
    lng: cleanLng, // Enviamos el número limpio
    rooms: Number(rooms),
    bathrooms: Number(bathrooms),
    sqft: Number(sqft),
    type,
    featured,
    image_urls: imageUrls,
  });
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TITULO Y OPERACION */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label className="font-bold">Título de la Propiedad</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ej: Casa Quinta con Pileta" />
            </div>
            <div>
              <Label className="font-bold">Tipo</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Venta</SelectItem>
                  <SelectItem value="rent">Alquiler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* PRECIO Y MONEDA */}
        <div className="flex gap-4 items-end">
          <div className="w-24">
            <Label className="font-bold">Moneda</Label>
            <Select value={currency} onValueChange={(v: any) => setCurrency(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ARS">ARS ($)</SelectItem>
                <SelectItem value="USD">USD (U$S)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="font-bold">Precio</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
        </div>

        {/* UBICACIÓN TEXTO */}
        <div>
          <Label className="font-bold">Ubicación (Dirección/Barrio)</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Ej: Campana, Bº Dalmine" />
        </div>

        {/* SECCIÓN GEOLOCALIZACIÓN INTELIGENTE */}
        <div className="md:col-span-2 p-5 bg-brand-magenta/5 rounded-2xl border-2 border-dashed border-brand-magenta/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-magenta">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-tight">Punto exacto en Mapa</span>
            </div>
            {lat && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded font-bold">✓ VÁLIDO</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pegar Coordenadas de Google Maps</Label>
              <Input 
                value={rawCoords}
                onChange={(e) => handleCoordsChange(e.target.value)}
                placeholder="-34.123, -58.456"
                className="bg-white border-brand-magenta/30"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                className="w-full text-[10px] font-bold uppercase h-10 hover:bg-brand-magenta hover:text-white"
                disabled={!lat}
                onClick={() => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-2" /> Probar Punto
              </Button>
            </div>
          </div>
        </div>

        {/* AMBIENTES Y M2 */}
        <div className="grid grid-cols-3 gap-4 md:col-span-2">
          <div>
            <Label>Ambientes</Label>
            <Input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} />
          </div>
          <div>
            <Label>Baños</Label>
            <Input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
          </div>
          <div>
            <Label>m² Totales</Label>
            <Input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} />
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div>
        <Label className="font-bold">Descripción Detallada</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </div>

      {/* GALERÍA */}
      <div className="space-y-4">
        <Label className="text-lg font-bold">Imágenes de la Propiedad</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative aspect-square border rounded-lg overflow-hidden group">
              <img src={url} className="w-full h-full object-cover" alt="" />
              {i === 0 && <div className="absolute top-0 left-0 bg-brand-magenta text-white text-[9px] px-2 py-1 font-bold">PORTADA</div>}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(i, 'up')} disabled={i===0}><ArrowLeft className="h-4 w-4" /></Button>
                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button>
                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(i, 'down')} disabled={i===imageUrls.length-1}><ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-brand-gray/5 min-h-[120px]">
            {isUploading ? <Loader2 className="animate-spin text-brand-magenta" /> : <><Upload className="text-brand-magenta mb-2" /><span className="text-[10px] font-bold uppercase">Subir Fotos</span></>}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <Switch checked={featured} onCheckedChange={setFeatured} id="feat" />
          <Label htmlFor="feat" className="font-bold text-brand-magenta">Destacar en Inicio</Label>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading || isUploading} className="bg-brand-magenta text-white px-10">
            {loading ? 'Guardando...' : property ? 'Actualizar' : 'Publicar'}
          </Button>
        </div>
      </div>
    </form>
  );
}