import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminPropertyForm } from '@/components/AdminPropertyForm';
import { useAuth } from '@/hooks/useAuth';
import { useProperties, useCreateProperty, useUpdateProperty, useDeleteProperty } from '@/hooks/useProperties';
import { toast } from 'sonner';
import type { Property } from '@/types/property';

export default function Admin() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: properties, isLoading } = useProperties();
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

        <Card className="card-shadow mx-4">
          <CardContent className="p-0 sm:p-6"> {/* Menos padding en móvil */}
            <div className="overflow-x-auto"> {/* Contenedor para scroll horizontal */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-gray/5">
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest min-w-[200px]">Propiedad</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Precio</TableHead>
                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 font-body text-muted-foreground">
                        Cargando propiedades...
                      </TableCell>
                    </TableRow>
                  ) : properties?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 font-body text-muted-foreground">
                        No hay propiedades. Crea la primera.
                      </TableCell>
                    </TableRow>
                  ) : (
                    properties?.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-body font-medium">{p.title}</TableCell>
                        <TableCell className="font-body">{p.location}</TableCell>

                        {/* CORRECCIÓN AQUÍ: Pasamos el precio, el tipo y la moneda de la base de datos */}
                        <TableCell className="font-body">
                          {formatPrice(p.price, p.type, p.currency)}
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary" className="font-body">
                            {p.type === 'sale' ? 'Venta' : 'Alquiler'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-body">{p.featured ? 'Sí' : 'No'}</TableCell>
                        <TableCell className="text-right">
                          {/* ... (botones de editar y borrar igual) ... */}
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