import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, LogOut, MapPin, Eye, EyeOff, CheckCircle2, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminPropertyForm } from '@/components/AdminPropertyForm';
import { useAuth } from '@/hooks/useAuth';
import { useProperties, useCreateProperty, useUpdateProperty, useDeleteProperty } from '@/hooks/useProperties';
import { toast } from 'sonner';
import type { Property } from '@/types/property';
import { themeConfig } from '@/config/theme.config';

export default function Admin() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: properties, isLoading } = useProperties({ isAdmin: true });
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center font-body text-muted-foreground">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleCreate = async (data: Omit<Property, 'id' | 'created_at'>) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Propiedad creada exitosamente');
      setShowForm(false);
    } catch {
      toast.error('Error al crear la propiedad');
    }
  };

  const handleUpdate = async (data: Omit<Property, 'id' | 'created_at'>) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, ...data });
      toast.success('Propiedad actualizada');
      setEditing(null);
      setShowForm(false);
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Propiedad eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 container mx-auto px-0 pb-12">
        <header className="bg-background sticky top-0 z-30">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-brand-dark">Panel de Control</h1>
                <p className="text-sm text-muted-foreground font-body">Gestioná tus propiedades publicadas</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setShowForm(true)}
                  className="flex-1 sm:flex-none bg-brand-magenta hover:bg-brand-dark text-white rounded-lg gap-2 shadow-md transition-all"
                >
                  <Plus className="h-4 w-4" /> <span className="xs:inline">Nueva Propiedad</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={signOut}
                  className="rounded-lg border-brand-light-gray hover:bg-brand-gray/10 text-destructive"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {showForm && (
          <Card className="mb-8 card-shadow mx-4 mt-6">
            <CardHeader>
              <CardTitle className="font-display">
                {editing ? 'Editar Propiedad' : 'Nueva Propiedad'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminPropertyForm
                property={editing}
                onSubmit={editing ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={createMutation.isPending || updateMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        <Card className="card-shadow mx-4 border-none shadow-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="md:table-header-group">
                  <TableRow className="bg-brand-gray/5 border-b">
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest p-2">Propiedad</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest p-2">Ubicación</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Estado</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Tipo</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Inmueble</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Precio</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center px-0">Visibilidad</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-wides w-px text-center whitespace-nowrap">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 font-body text-muted-foreground">
                        Cargando propiedades...
                      </TableCell>
                    </TableRow>
                  ) : properties?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 font-body text-muted-foreground">
                        No hay propiedades. Crea la primera.
                      </TableCell>
                    </TableRow>
                  ) : (
                    properties?.map((p) => (
                      <TableRow key={p.id}>
                        {/* COLUMNA: TÍTULO */}
                        <TableCell className="font-body font-medium"><span className="font-display font-bold text-brand-dark text-base md:text-sm">{p.title}</span></TableCell>

                        {/* COLUMNA: UBICACIÓN */}
                        <TableCell className="font-body"><span className="text-sm flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {p.location}
                        </span></TableCell>

                        {/* COLUMNA: STATUS (Disponible/Reservada/Vendida) */}
                        <TableCell className="px-4 py-2 md:p-4 text-left md:text-center">
                          <div className="inline-flex items-center">
                            {p.status === 'available' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-lg font-bold text-[10px] uppercase tracking-tighter"><CheckCircle2 className="h-3 w-3 mr-1" /> Disponible</Badge>}
                            {p.status === 'reserved' && <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none rounded-lg font-bold text-[10px] uppercase tracking-tighter"><Clock className="h-3 w-3 mr-1" /> Reservada</Badge>}
                            {p.status === 'sold' && <Badge className="bg-brand-dark text-white hover:bg-brand-dark border-none rounded-lg font-bold text-[10px] uppercase tracking-tighter">{p.type === 'rent' ? 'Alquilada' : 'Vendida'}</Badge>}
                          </div>
                        </TableCell>

                        {/* COLUMNA: TIPO (Venta/Alquiler) */}
                        <TableCell className="px-4 py-2 md:p-4 text-center">
                          <Badge variant="secondary" className="font-body">
                            {p.type === 'sale' ? 'Venta' : 'Alquiler'}
                          </Badge>
                        </TableCell>

                        {/* COLUMNA: TIPO DE INMUEBLE */}
                        <TableCell className="px-4 py-2 md:p-4 text-center">
                          <Badge variant="outline" className="font-body text-[10px] uppercase tracking-wider">
                            {themeConfig.propertyTypes.find(pt => pt.value === p.property_type)?.label || p.property_type}
                          </Badge>
                        </TableCell>

                        {/* COLUMNA: PRECIO */}
                        <TableCell className="px-4 py-2 md:p-4 font-display font-bold text-brand-magenta">
                          {formatPrice(p.price, p.type, p.currency)}
                        </TableCell>

                        {/* COLUMNA: VISIBILIDAD (Ojo abierto/cerrado) */}
                        <TableCell className="px-2 py-2 md:p-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest ${p.is_visible ? 'text-blue-600' : 'text-muted-foreground opacity-50'}`}>
                            {p.is_visible ? <><Eye className="h-4 w-4" /></> : <><EyeOff className="h-4 w-4" /></>}
                          </div>
                        </TableCell>

                        {/* COLUMNA: ACCIONES */}
                        <TableCell className="px-4 py-2  text-left md:text-center">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => { setEditing(p); setShowForm(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-display">¿Eliminar propiedad?</AlertDialogTitle>
                                  <AlertDialogDescription className="font-body">
                                    Esta acción no se puede deshacer. Se eliminará permanentemente "{p.title}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="font-body">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive text-destructive-foreground font-body">
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}