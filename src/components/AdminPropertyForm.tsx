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
  const [isConsulting, setIsConsulting] = useState(false);
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
    setDescription(property.description);
    setPrice(property.price.toString());
    // Si el precio es 0, activamos el switch de "Consultar"
    setIsConsulting(property.price === 0); 
    setCurrency(property.currency as 'ARS' | 'USD');
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* TITULO Y OPERACION */}
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Label className="font-bold text-[10px] uppercase tracking-widest">Título de la Propiedad</Label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            placeholder="Ej: Casa Quinta con Pileta" 
            className="mt-1"
          />
        </div>
        <div>
          <Label className="font-bold text-[10px] uppercase tracking-widest">Operación</Label>
          <Select value={type} onValueChange={(v: any) => setType(v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">Venta</SelectItem>
              <SelectItem value="rent">Alquiler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    {/* SECCIÓN PRECIO INTEGRADA */}
    <div className="md:col-span-2 p-5 bg-brand-gray/5 border border-brand-light-gray space-y-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <Label className="font-bold text-[10px] uppercase tracking-widest text-brand-magenta">Información Financiera</Label>
        <div className="flex items-center gap-2 bg-white px-3 py-1 border border-brand-light-gray shadow-sm rounded-lg">
          <Switch 
            id="consult" 
            checked={isConsulting} 
            onCheckedChange={(checked) => {
              setIsConsulting(checked);
              if (checked) setPrice('0');
            }} 
          />
          <Label htmlFor="consult" className="text-[10px] font-bold uppercase cursor-pointer">Precio a consultar</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="font-bold text-[10px] uppercase tracking-widest">Moneda</Label>
          <Select value={currency} onValueChange={(v: any) => setCurrency(v)} disabled={isConsulting}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ARS">Peso Argentino ($)</SelectItem>
              <SelectItem value="USD">Dólar (U$S)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label className="font-bold text-[10px] uppercase tracking-widest">Monto</Label>
          <Input 
            type="number" 
            value={isConsulting ? "" : price} 
            onChange={(e) => setPrice(e.target.value)} 
            required={!isConsulting}
            disabled={isConsulting}
            placeholder={isConsulting ? "PRECIO A CONSULTAR" : "0.00"}
            className="mt-1 font-mono font-bold" 
          />
        </div>
      </div>
    </div>

    {/* UBICACIÓN TEXTO */}
    <div className="md:col-span-2">
      <Label className="font-bold text-[10px] uppercase tracking-widest">Ubicación (Dirección/Barrio)</Label>
      <Input 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        required 
        placeholder="Ej: Campana, Bº Dalmine" 
        className="mt-1"
      />
    </div>

    {/* SECCIÓN GEOLOCALIZACIÓN */}
    <div className="md:col-span-2 p-5 bg-brand-magenta/5 border border-brand-magenta/20 space-y-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-magenta">
          <MapPin className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Geolocalización Maps</span>
        </div>
        {lat && <span className="text-[9px] bg-green-600 text-white px-2 py-0.5 font-bold">✓ COORDENADAS VÁLIDAS</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Input 
            value={rawCoords}
            onChange={(e) => handleCoordsChange(e.target.value)}
            placeholder="Pegar coordenadas aquí (ej: -34.16, -58.95)"
            className="bg-white border-brand-magenta/30"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="text-[10px] rounded-lg font-bold uppercase h-10 border-brand-magenta/30 text-brand-magenta hover:bg-brand-magenta hover:text-white"
          disabled={!lat}
          onClick={() => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-2" /> Verificar
        </Button>
      </div>
    </div>

    {/* AMBIENTES Y M2 */}
    <div className="grid grid-cols-3 gap-4 md:col-span-2">
      <div>
        <Label className="font-bold text-[10px] uppercase tracking-widest">Ambientes</Label>
        <Input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} className="none mt-1" />
      </div>
      <div>
        <Label className="font-bold text-[10px] uppercase tracking-widest">Baños</Label>
        <Input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label className="font-bold text-[10px] uppercase tracking-widest">m² Totales</Label>
        <Input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} className="mt-1" />
      </div>
    </div>
  </div>

  {/* DESCRIPCIÓN */}
  <div>
    <Label className="font-bold text-[10px] uppercase tracking-widest">Descripción del Inmueble</Label>
    <Textarea 
      value={description} 
      onChange={(e) => setDescription(e.target.value)} 
      rows={5} 
      className="mt-1 resize-none" 
    />
  </div>

  {/* GALERÍA */}
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-bold uppercase tracking-widest">Galería de Imágenes</Label>
      <span className="text-[10px] text-muted-foreground font-bold">{imageUrls.length} FOTOS CARGADAS</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {imageUrls.map((url, i) => (
        <div key={url} className="relative aspect-square border border-brand-light-gray overflow-hidden group">
          <img src={url} className="w-full h-full object-cover" alt="" />
          {i === 0 && <div className="absolute top-0 left-0 bg-brand-magenta text-white text-[8px] px-2 py-1 font-bold tracking-tighter">PRINCIPAL</div>}
          <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
            <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => moveImage(i, 'up')} disabled={i===0}><ArrowLeft className="h-3 w-3" /></Button>
            <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}><X className="h-3 w-3" /></Button>
            <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => moveImage(i, 'down')} disabled={i===imageUrls.length-1}><ArrowRight className="h-3 w-3" /></Button>
          </div>
        </div>
      ))}
      <label className="border-2 border-dashed border-brand-light-gray flex flex-col items-center justify-center cursor-pointer hover:bg-brand-gray/5 min-h-[100px] transition-colors">
        {isUploading ? <Loader2 className="animate-spin text-brand-magenta" /> : <><Upload className="h-5 w-5 text-brand-magenta mb-1" /><span className="text-[8px] font-bold uppercase">Añadir</span></>}
        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
      </label>
    </div>
  </div>

  {/* FOOTER */}
  <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-brand-light-gray gap-4">
    <div className="flex items-center gap-3 bg-brand-magenta/5 px-4 py-2 border border-brand-magenta/10 rounded-lg">
      <Switch checked={featured} onCheckedChange={setFeatured} id="feat" />
      <Label htmlFor="feat" className="font-bold text-[10px] uppercase tracking-widest text-brand-magenta cursor-pointer">Destacar Propiedad</Label>
    </div>
    <div className="flex gap-3 w-full md:w-auto">
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1 md:flex-none text-[10px] rounded-lg font-bold uppercase tracking-widest">Descartar</Button>
      <Button type="submit" disabled={loading || isUploading} className="flex-1 md:flex-none bg-brand-magenta rounded-lg text-white px-12 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors">
        {loading ? 'Procesando...' : property ? 'Guardar Cambios' : 'Publicar Inmueble'}
      </Button>
    </div>
  </div>
</form>
  );
}