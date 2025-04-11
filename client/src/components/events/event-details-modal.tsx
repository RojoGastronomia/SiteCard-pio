
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Event, MenuItem } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Menu, Clock } from "lucide-react";

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
  const [showMenuOptions, setShowMenuOptions] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [menuItemsLoading, setMenuItemsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setMenuItemsLoading(true);
        const response = await fetch(`/api/events/${event.id}/menu-items`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();
        console.log("Menu items carregados:", data);
        setMenuItems(data);
      } catch (error) {
        console.error("Erro ao carregar itens do menu:", error);
        toast({
          title: "Erro ao carregar itens do menu",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      } finally {
        setMenuItemsLoading(false);
      }
    };

    fetchMenuItems();
  }, [event.id, toast]);

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      onClose();
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
      price: selectedMenuItem.price * guestCount,
      quantity: 1
    };

    addToCart(cartItem);
    toast({
      title: "Adicionado ao carrinho",
      description: `${event.title} foi adicionado ao seu carrinho.`,
    });
    onClose();
  };

  const isFormValid = () => eventDate && guestCount > 0 && selectedMenuItem;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-64 object-cover object-top rounded"
              />
              <p className="text-gray-600 mt-4">{event.description}</p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-700">
                  <Menu className="mr-3 w-6 h-6" />
                  <span>{menuItems.length} opções de menu disponíveis</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="mr-3 w-6 h-6" />
                  <span>Disponível para agendamento</span>
                </div>
              </div>

              <Button 
                className="mt-6 w-full relative bg-primary text-white hover:bg-opacity-90"
                onClick={() => setShowMenuOptions(!showMenuOptions)}
              >
                Ver Opções do Menu
              </Button>
            </div>

            <div className="md:w-1/2 space-y-6">
              <div>
                <label htmlFor="eventDate" className="block text-gray-700 font-medium mb-2">
                  Data do Evento
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="guestCount" className="block text-gray-700 font-medium mb-2">
                  Número de Convidados
                </label>
                <input
                  type="number"
                  id="guestCount"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  placeholder="Digite o número de convidados"
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isFormValid()}
                className={`w-full py-3 rounded !rounded-button font-medium transition-colors mt-8 whitespace-nowrap ${
                  isFormValid() 
                    ? 'bg-primary text-white hover:bg-opacity-90' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
