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

// En Admin.tsx, busca el formatPrice y cámbialo por:
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

      <main className="pt-28 container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Panel de Administración</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="font-body"
            >
              <Plus className="h-4 w-4 mr-2" /> Nueva Propiedad
            </Button>
            <Button variant="outline" onClick={() => signOut()} className="font-body">
              <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8 card-shadow">
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

        <Card className="card-shadow">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Título</TableHead>
                  <TableHead className="font-body">Ubicación</TableHead>
                  <TableHead className="font-body">Precio</TableHead>
                  <TableHead className="font-body">Tipo</TableHead>
                  <TableHead className="font-body">Destacada</TableHead>
                  <TableHead className="font-body text-right">Acciones</TableHead>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}