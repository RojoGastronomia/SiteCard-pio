import { useState, useEffect } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Event, Menu } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, 
  Users, 
  Clock, 
  MenuSquare,
  ArrowLeft
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

export default function EventDetailsPage() {
  const [, params] = useRoute("/events/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const eventId = params?.id ? parseInt(params.id) : null;
  
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState(20);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  
  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery<Event>({
    queryKey: ["/api/events", eventId],
    enabled: !!eventId,
    retry: false,
    onError: (error: Error) => {
      toast({
        title: "Error loading event",
        description: error.message,
        variant: "destructive",
      });
    }
  } as UseQueryOptions<Event>);
  
  // Fetch menu items for this event
  const { data: menuItems, isLoading: menuItemsLoading } = useQuery<Menu[]>({
    queryKey: ["/api/events", eventId, "menus"],
    enabled: !!eventId,
    retry: false,
    onError: (error: Error) => {
      toast({
        title: "Error loading menu items",
        description: error.message,
        variant: "destructive",
      });
    }
  } as UseQueryOptions<Menu[]>);
  
  const selectedMenuItem = menuItems?.find((item: Menu) => item.id.toString() === selectedMenuId);
  
  const calculateTotal = () => {
    if (!selectedMenuItem || !guestCount) return 0;
    return selectedMenuItem.price * guestCount;
  };
  
  const isFormValid = () => {
    return eventDate && guestCount > 0 && selectedMenuId;
  };
  
  const handleAddToCart = () => {
    if (!event || !selectedMenuItem || !eventDate) return;
    
    const cartItem = {
      id: Date.now(),
      eventId: event.id,
      title: event.title,
      imageUrl: event.imageUrl,
      date: eventDate,
      guestCount,
      menuSelection: selectedMenuItem.name,
      price: calculateTotal(),
      quantity: 1
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Adicionado ao carrinho",
      description: `${event.title} foi adicionado ao seu carrinho.`,
    });
  };
  
  // Set min date to tomorrow
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  if (!eventId) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">Evento não encontrado</h3>
          <Button onClick={() => navigate("/events")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista de eventos
          </Button>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <Button 
        onClick={() => navigate("/events")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para eventos
      </Button>
      
      {eventLoading ? (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full h-64 rounded-lg mb-4" />
            <Skeleton className="w-3/4 h-8 mb-2" />
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-2/3 h-4 mb-6" />
            <div className="space-y-4">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      ) : event ? (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h1>
            <p className="text-gray-600 mb-6">{event.description}</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-700">
                <MenuSquare className="mr-3 w-5 h-5" />
                <span>{event.menuOptions} opções de menu disponíveis</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="mr-3 w-5 h-5" />
                <span>Disponível para agendamento</span>
              </div>
            </div>
            
            {menuItemsLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Opções de Menu</h3>
                {menuItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMenuId === item.id.toString() 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedMenuId(item.id.toString())}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <span className="text-primary font-medium">{formatCurrency(item.price)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Não há opções de menu disponíveis.</p>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Data do Evento</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={getMinDate()}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Número de Convidados</label>
              <div className="flex items-center">
                <Button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  min="1"
                  className="mx-2 text-center"
                />
                <Button
                  onClick={() => setGuestCount(guestCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            {selectedMenuItem && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Resumo do Pedido</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Menu selecionado:</span>
                    <span className="font-medium">{selectedMenuItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço por pessoa:</span>
                    <span className="font-medium">{formatCurrency(selectedMenuItem.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de convidados:</span>
                    <span className="font-medium">{guestCount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary mt-4">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              className="w-full"
              disabled={!isFormValid()}
              onClick={handleAddToCart}
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
