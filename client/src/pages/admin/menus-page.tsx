import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, Event, insertMenuItemSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, PencilLine, Trash2, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Form schema
const menuItemFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  category: z.string(),
  eventId: z.coerce.number().int().positive(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
});

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export default function AdminMenusPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch menu items
  const { data: menuItems, isLoading: menuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    onError: (error: Error) => {
      toast({
        title: "Error loading menu items",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch events (for dropdown)
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    onError: (error: Error) => {
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add menu item mutation
  const addMenuItemMutation = useMutation({
    mutationFn: async (menuItemData: MenuItemFormValues) => {
      const res = await apiRequest("POST", "/api/menu-items", menuItemData);
      return await res.json();
    },
    onSuccess: () => {
      setShowAddDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item added",
        description: "Menu item has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding menu item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, menuItemData }: { id: number; menuItemData: MenuItemFormValues }) => {
      const res = await apiRequest("PUT", `/api/menu-items/${id}`, menuItemData);
      return await res.json();
    },
    onSuccess: () => {
      setShowAddDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item updated",
        description: "Menu item has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating menu item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (menuItemId: number) => {
      await apiRequest("DELETE", `/api/menu-items/${menuItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item deleted",
        description: "Menu item has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting menu item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "executive",
      eventId: 0,
      imageUrl: "",
    },
  });

  // Reset form when dialog is closed
  const handleCloseDialog = () => {
    form.reset();
    setIsEditing(false);
    setSelectedMenuItem(null);
    setShowAddDialog(false);
  };

  // Handle edit menu item button click
  const handleEditMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsEditing(true);
    
    form.reset({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      eventId: menuItem.eventId,
      imageUrl: menuItem.imageUrl || "",
    });
    
    setShowAddDialog(true);
  };

  // Handle form submission
  const onSubmit = (values: MenuItemFormValues) => {
    if (isEditing && selectedMenuItem) {
      updateMenuItemMutation.mutate({ id: selectedMenuItem.id, menuItemData: values });
    } else {
      addMenuItemMutation.mutate(values);
    }
  };

  // Filter menu items based on search, category, and event
  const filteredMenuItems = menuItems?.filter((menuItem) => {
    const matchesSearch = 
      menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menuItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? menuItem.category === categoryFilter : true;
    const matchesEvent = eventFilter ? menuItem.eventId === eventFilter : true;
    
    return matchesSearch && matchesCategory && matchesEvent;
  });

  // Helper to get event title by ID
  const getEventTitle = (eventId: number) => {
    const event = events?.find(e => e.id === eventId);
    return event ? event.title : `ID #${eventId}`;
  };

  // Get category display text
  const getCategoryDisplay = (category: string) => {
    const categories: Record<string, string> = {
      'executive': 'Executivo',
      'premium': 'Premium',
      'basic': 'Básico',
      'vegetarian': 'Vegetariano',
      'dessert': 'Sobremesa',
    };
    return categories[category] || category;
  };

  return (
    <>
      <Navbar />
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => window.location.href = "/admin/dashboard"}>
              Dashboard
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => window.location.href = "/admin/events"}>
              Eventos
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => window.location.href = "/admin/users"}>
              Usuários
            </Button>
            <Button className="rounded-full">Cardápios</Button>
            <Button variant="outline" className="rounded-full" onClick={() => window.location.href = "/admin/orders"}>
              Pedidos
            </Button>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Itens de Cardápio</h1>
          <Button 
            onClick={() => {
              setIsEditing(false);
              setSelectedMenuItem(null);
              form.reset();
              setShowAddDialog(true);
            }}
            className="gap-2"
          >
            <PencilLine size={16} />
            Novo Item de Menu
          </Button>
        </div>

        {/* Filter Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter size={16} />
                      {categoryFilter ? getCategoryDisplay(categoryFilter) : "Categoria"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                      Todas as categorias
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("executive")}>
                      Executivo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("premium")}>
                      Premium
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("basic")}>
                      Básico
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("vegetarian")}>
                      Vegetariano
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("dessert")}>
                      Sobremesa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter size={16} />
                      {eventFilter ? "Evento: " + getEventTitle(eventFilter).substring(0, 15) + "..." : "Evento"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setEventFilter(null)}>
                      Todos os eventos
                    </DropdownMenuItem>
                    {events?.map(event => (
                      <DropdownMenuItem key={event.id} onClick={() => setEventFilter(event.id)}>
                        {event.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Buscar itens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Table */}
        <Card>
          <CardContent className="p-0">
            {menuItemsLoading ? (
              <div className="p-4">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-20 w-full mb-2" />
                <Skeleton className="h-20 w-full mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : filteredMenuItems && filteredMenuItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMenuItems.map((menuItem) => (
                    <TableRow key={menuItem.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{menuItem.name}</TableCell>
                      <TableCell>{getCategoryDisplay(menuItem.category)}</TableCell>
                      <TableCell>{getEventTitle(menuItem.eventId)}</TableCell>
                      <TableCell>{formatCurrency(menuItem.price)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditMenuItem(menuItem)}
                          >
                            <PencilLine className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this menu item?')) {
                                deleteMenuItemMutation.mutate(menuItem.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum item de menu encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Menu Item Dialog */}
        <Dialog open={showAddDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Item de Menu" : "Novo Item de Menu"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (por pessoa)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="executive">Executivo</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="basic">Básico</SelectItem>
                            <SelectItem value="vegetarian">Vegetariano</SelectItem>
                            <SelectItem value="dessert">Sobremesa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evento</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um evento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {events?.map((event) => (
                              <SelectItem key={event.id} value={event.id.toString()}>
                                {event.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancelar</Button>
                  </DialogClose>
                  <Button 
                    type="submit"
                    disabled={addMenuItemMutation.isPending || updateMenuItemMutation.isPending}
                  >
                    {isEditing ? "Atualizar" : "Criar"} Item
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </>
  );
}
