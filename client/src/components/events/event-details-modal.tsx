import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Event, MenuItem } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, Users, Clock, FileText, X } from "lucide-react";

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState(20);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [showMenuOptions, setShowMenuOptions] = useState(false);

  // Fetch menu items
  const { data: menuItems, isLoading: menuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/events", event.id, "menu-items"],
    onError: (error: Error) => {
      toast({
        title: "Error loading menu items",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get the selected menu item
  const selectedMenuItem = menuItems?.find(item => item.id.toString() === selectedMenuId);

  // Calculate total
  const calculateTotal = () => {
    if (!selectedMenuItem || !guestCount) return 0;
    return selectedMenuItem.price * guestCount;
  };

  // Set min date to tomorrow
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Handle form validation
  const isFormValid = () => {
    return eventDate && guestCount > 0 && selectedMenuId;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      onClose();
      window.location.href = "/auth";
      return;
    }

    if (!selectedMenuItem || !eventDate) return;
    
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
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader className="flex justify-between items-center flex-row">
          <DialogTitle>{event.title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-64 object-cover object-top rounded"
              />
              <p className="text-gray-600 mt-4">
                {event.description}
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-700">
                  <FileText className="mr-3 w-6 h-6 flex items-center justify-center" />
                  <span>{event.menuOptions} opções de menu disponíveis</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="mr-3 w-6 h-6 flex items-center justify-center" />
                  <span>Disponível para agendamento</span>
                </div>
              </div>
              
              <Button 
                className="mt-6 w-full"
                onClick={() => setShowMenuOptions(!showMenuOptions)}
              >
                {showMenuOptions ? "Esconder Opções do Menu" : "Ver Opções do Menu"}
              </Button>
              
              {showMenuOptions && (
                <div className="mt-4 space-y-4">
                  {menuItemsLoading ? (
                    <p>Carregando opções de menu...</p>
                  ) : menuItems && menuItems.length > 0 ? (
                    menuItems.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedMenuId === item.id.toString() 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedMenuId(item.id.toString())}
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.name}</h4>
                          <span className="font-medium text-primary">{formatCurrency(item.price)}/pessoa</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                    ))
                  ) : (
                    <p>Não há opções de menu disponíveis.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="md:w-1/2 space-y-6">
              <div>
                <label htmlFor="eventDate" className="block text-gray-700 font-medium mb-2">Data do Evento</label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="guestCount" className="block text-gray-700 font-medium mb-2">Número de Convidados</label>
                <Input
                  id="guestCount"
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  placeholder="Digite o número de convidados"
                  min="1"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="menuSelection" className="block text-gray-700 font-medium mb-2">Selecione o Menu</label>
                <Select
                  value={selectedMenuId}
                  onValueChange={setSelectedMenuId}
                >
                  <SelectTrigger id="menuSelection">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItems?.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name} - {formatCurrency(item.price)}/pessoa
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Preço por pessoa</span>
                  <span className="font-medium">{selectedMenuItem ? formatCurrency(selectedMenuItem.price) : '-'}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Número de convidados</span>
                  <span className="font-medium">{guestCount}</span>
                </div>
                <div className="flex justify-between text-sm font-medium mt-3 pt-3 border-t border-gray-200">
                  <span>Total estimado</span>
                  <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleAddToCart} 
            disabled={!isFormValid()}
          >
            Adicionar ao carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
