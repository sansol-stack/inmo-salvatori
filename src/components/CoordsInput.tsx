import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoordsInputProps {
  onCoordsChange: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
}

export const CoordsInput = ({ onCoordsChange, defaultLat, defaultLng }: CoordsInputProps) => {
  const [rawText, setRawText] = useState("");
  const [displayLat, setDisplayLat] = useState<string>(defaultLat?.toString() || "");
  const [displayLng, setDisplayLng] = useState<string>(defaultLng?.toString() || "");

  const processInput = (text: string) => {
    setRawText(text);
    // Buscamos dos números separados por coma o espacio
    const parts = text.split(/[\s,]+/).filter(p => p.trim() !== "");
    
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        setDisplayLat(lat.toString());
        setDisplayLng(lng.toString());
        onCoordsChange(lat, lng);
      }
    }
  };

  const handlePreview = () => {
    if (displayLat && displayLng) {
      window.open(`https://www.google.com/maps?q=${displayLat},${displayLng}`, '_blank');
    }
  };

  return (
    <div className="space-y-4 p-6 bg-brand-magenta/5 rounded-2xl border-2 border-dashed border-brand-magenta/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-magenta">
          <MapPin className="h-5 w-5" />
          <span className="font-bold uppercase tracking-tighter">Ubicación Geográfica</span>
        </div>
        {displayLat && (
          <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase">
            <CheckCircle2 className="h-3 w-3" /> Coordenadas Listas
          </span>
        )}
      </div>

      <div className="grid gap-4">
        <div>
          <Label className="text-[10px] font-black text-muted-foreground uppercase mb-2 block">
            Pegar desde Google Maps
          </Label>
          <Input
            placeholder="-34.913625, -57.942469"
            value={rawText}
            onChange={(e) => processInput(e.target.value)}
            className="h-12 bg-white border-brand-magenta/20 focus-visible:ring-brand-magenta font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[9px] text-muted-foreground uppercase">Latitud</Label>
            <div className="h-10 px-3 flex items-center bg-white/50 border rounded text-sm font-mono text-brand-dark italic">
              {displayLat || "Esperando..."}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[9px] text-muted-foreground uppercase">Longitud</Label>
            <div className="h-10 px-3 flex items-center bg-white/50 border rounded text-sm font-mono text-brand-dark italic">
              {displayLng || "Esperando..."}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={!displayLat}
          onClick={handlePreview}
          className="w-full h-10 text-[10px] uppercase font-bold tracking-widest hover:bg-brand-magenta hover:text-white transition-all"
        >
          <ExternalLink className="h-3 w-3 mr-2" /> 
          Previsualizar en Google Maps
        </Button>
      </div>
    </div>
  );
};