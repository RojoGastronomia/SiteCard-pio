import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dish, Event, InsertDish, insertDishSchema } from "@shared/schema";
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
import AdminNavbar from "@/components/admin/admin-navbar";
import { useRoute, Link } from "wouter";

// Form schema
const dishFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
});

type DishFormValues = z.infer<typeof dishFormSchema>;

export default function AdminMenusPage() {
  const { toast } = useToast();
  const [, params] = useRoute("/admin/menus/:menuId/dishes");
  const menuId = params?.menuId ? parseInt(params.menuId) : null;
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Dishes for the specific menuId
  const { 
    data: dishes,
    isLoading: dishesLoading,
    isError: dishesError,
    error: dishesFetchError
  } = useQuery<Dish[]>({
    queryKey: ["/api/menus", menuId, "dishes"],
    queryFn: () => apiRequest("GET", `/api/menus/${menuId}/dishes`).then(res => res.json()),
    enabled: !!menuId,
  });

  // Fetch events (for dropdown)
  const { 
    data: events, 
    isError: eventsError, 
    error: eventsFetchError 
  } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Add dish mutation
  const addDishMutation = useMutation({
    mutationFn: async (dishData: DishFormValues) => {
      console.log("[Mutation] Sending add dish request:", dishData);
      if (!menuId) throw new Error("Menu ID is missing"); 
      const res = await apiRequest("POST", `/api/menus/${menuId}/dishes`, dishData);
      return await res.json();
    },
    onSuccess: (data) => {
      console.log("[Mutation] Add dish success. Response data:", data);
      setShowAddDialog(false);
      console.log("[Mutation] Invalidating dishes query...");
      queryClient.invalidateQueries({ queryKey: ["/api/menus", menuId, "dishes"] });
      console.log("[Mutation] Dishes query invalidated.");
      toast({
        title: "Prato adicionado",
        description: "Dish has been added successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("[Mutation] Error adding dish:", error);
      toast({
        title: "Erro ao adicionar prato",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update dish mutation
  const updateDishMutation = useMutation({
    mutationFn: async ({ id, dishData }: { id: number; dishData: DishFormValues }) => {
      const res = await apiRequest("PUT", `/api/dishes/${id}`, dishData);
      return await res.json();
    },
    onSuccess: () => {
      setShowAddDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/menus", menuId, "dishes"] });
      toast({
        title: "Dish updated",
        description: "Dish has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating dish",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete dish mutation
  const deleteDishMutation = useMutation({
    mutationFn: async (dishId: number) => {
      await apiRequest("DELETE", `/api/dishes/${dishId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menus", menuId, "dishes"] });
      toast({
        title: "Dish deleted",
        description: "Dish has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting dish",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form
  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "executive",
      imageUrl: "",
    },
  });

  // Handle query errors
  useEffect(() => {
    if (dishesError) {
      toast({ title: "Error loading dishes", description: dishesFetchError?.message, variant: "destructive" });
    }
    if (eventsError) {
      toast({ title: "Error loading events", description: eventsFetchError?.message, variant: "destructive" });
    }
  }, [dishesError, eventsError, dishesFetchError, eventsFetchError, toast]);

  // Reset form when dialog is closed
  const handleCloseDialog = () => {
    form.reset();
    setIsEditing(false);
    setSelectedDish(null);
    setShowAddDialog(false);
  };

  // Handle edit dish button click
  const handleEditDish = (dish: Dish) => {
    setSelectedDish(dish);
    setIsEditing(true);
    
    form.reset({
      name: dish.name,
      description: dish.description,
      category: dish.category,
      imageUrl: dish.imageUrl || "",
    });
    
    setShowAddDialog(true);
  };

  // Handle form submission
  const onSubmit = (values: DishFormValues) => {
    if (isEditing && selectedDish) {
      updateDishMutation.mutate({ id: selectedDish.id, dishData: values });
    } else {
      addDishMutation.mutate(values);
    }
  };

  // Filter dishes based on search and category
  const filteredDishes = dishes?.filter((dish: Dish) => {
    const matchesSearch = 
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? dish.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pratos {menuId ? `(Menu #${menuId})` : ''}</h1>
        <Button 
          onClick={() => {
            setIsEditing(false);
            setSelectedDish(null);
            form.reset();
            setShowAddDialog(true);
          }}
          className="gap-2"
          disabled={!menuId}
        >
          <PencilLine size={16} />
          Novo Prato
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
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Buscar pratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dishes Table */}
      <Card className="mt-6">
        <CardContent className="p-0">
          {dishesLoading ? (
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredDishes && filteredDishes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Prato</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDishes.map((dish: Dish) => (
                  <TableRow key={dish.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell>{getCategoryDisplay(dish.category)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditDish(dish)}
                        >
                          <PencilLine className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this dish?')) {
                              deleteDishMutation.mutate(dish.id);
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
              <p className="text-gray-500">Nenhum prato encontrado para este menu.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dish Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Prato" : "Novo Prato"}</DialogTitle>
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
                  disabled={addDishMutation.isPending || updateDishMutation.isPending}
                >
                  {isEditing ? "Atualizar" : "Criar"} Prato
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
