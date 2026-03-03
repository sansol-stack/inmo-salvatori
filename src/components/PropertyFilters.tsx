import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import type { PropertyFilters as Filters } from '@/types/property';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function PropertyFilters({ filters, onChange }: Props) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card p-6 rounded-lg card-shadow mb-8">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-card-foreground">Filtros Avanzados</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={filters.type} onValueChange={(v) => update('type', v)}>
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Tipo de operación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="sale">Venta</SelectItem>
            <SelectItem value="rent">Alquiler</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Precio mínimo"
          value={filters.minPrice}
          onChange={(e) => update('minPrice', e.target.value)}
          className="font-body"
        />

        <Input
          type="number"
          placeholder="Precio máximo"
          value={filters.maxPrice}
          onChange={(e) => update('maxPrice', e.target.value)}
          className="font-body"
        />

        <Input
          placeholder="Ciudad"
          value={filters.city}
          onChange={(e) => update('city', e.target.value)}
          className="font-body"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          onClick={() => onChange({ search: '', type: 'all', minPrice: '', maxPrice: '', city: '' })}
          className="font-body"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
