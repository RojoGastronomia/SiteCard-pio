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
  DialogTrigger,
  DialogClose
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
  const [showMenuOptions, setShowMenuOptions] = useState(false);
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

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="mt-6 w-full relative bg-primary text-white hover:bg-opacity-90"
                  >
                    Ver Opções do Menu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Opções de Menu</h2>
                    <DialogClose className="text-gray-500 hover:text-gray-700">
                      <X className="h-5 w-5" />
                    </DialogClose>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {menuItems.map((menuItem) => (
                        <div key={menuItem.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden card-shadow">
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={menuItem.imageUrl || "https://public.readdy.ai/ai/img_res/c1248e0f61daa1c21adcdc44e06db716.jpg"} 
                              alt={menuItem.name} 
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="p-5">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold text-gray-800">{menuItem.name}</h3>
                              <span className="bg-primary bg-opacity-10 text-primary text-xs px-3 py-1 rounded-full">
                                {formatCurrency(menuItem.price)}/pessoa
                              </span>
                            </div>
                            <div className="space-y-3 mb-4">
                              <div className="flex items-start">
                                <div className="text-gray-600 text-sm">{menuItem.description}</div>
                              </div>
                            </div>
                            <Button 
                              className="w-full bg-primary text-white"
                              onClick={() => {
                                setSelectedMenuItem(menuItem);
                                setShowMenuOptions(true);
                              }}
                            >
                              Selecionar este Menu
                            </Button>
                            
                            {showMenuOptions && (
                              <Dialog open={showMenuOptions} onOpenChange={() => setShowMenuOptions(false)}>
                                <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
                                  <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                                    <h2 className="text-xl font-semibold text-gray-800">{menuItem.name}</h2>
                                    <p className="text-sm text-gray-500">Selecione os itens de cada categoria</p>
                                    <DialogClose className="text-gray-500 hover:text-gray-700">
                                      <X className="h-5 w-5" />
                                    </DialogClose>
                                  </div>
                                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                    <div className="space-y-8">
                                      <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                          <h3 className="font-medium text-gray-800">Entradas</h3>
                                          <span className="text-sm text-primary">Selecione 2 itens</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          {[
                                            { name: "Bruschetta", img: "https://public.readdy.ai/ai/img_res/52df43839701833dcbd110152fb475a5.jpg", desc: "Pão italiano grelhado com tomate e manjericão" },
                                            { name: "Salada Caprese", img: "https://public.readdy.ai/ai/img_res/af718d201988b5ac8c469609f522c959.jpg", desc: "Mussarela de búfala, tomate e manjericão" },
                                            { name: "Carpaccio", img: "https://public.readdy.ai/ai/img_res/e3ffc524b6e6a25406bbc138eaca8c60.jpg", desc: "Finas fatias de carne com molho especial" },
                                            { name: "Ceviche", img: "https://public.readdy.ai/ai/img_res/5d9928332f56a8facf90adeff2440d80.jpg", desc: "Peixe branco marinado com limão e temperos" }
                                          ].map((item) => (
                                            <label key={item.name} className="border rounded-lg overflow-hidden block cursor-pointer hover:border-primary transition-colors">
                                              <input 
                                                type="checkbox" 
                                                name="entradas"
                                                className="peer sr-only"
                                                onChange={(e) => {
                                                  const checked = document.querySelectorAll('input[name="entradas"]:checked');
                                                  if (checked.length > 2) {
                                                    e.preventDefault();
                                                    e.target.checked = false;
                                                  }
                                                }}
                                              />
                                              <div className="relative group">
                                                <img src={item.img} alt={item.name} className="w-full h-32 object-cover" />
                                                <div className="p-3">
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                    <div className="w-5 h-5 border-2 rounded border-primary flex items-center justify-center">
                                                      <div className="w-3 h-3 bg-primary rounded hidden peer-checked:block group-has-[input:checked]:block"></div>
                                                    </div>
                                                  </div>
                                                  <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                              </div>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-4 mt-8">
                                        <div className="flex justify-between items-center">
                                          <h3 className="font-medium text-gray-800">Pratos Principais</h3>
                                          <span className="text-sm text-primary">Selecione 3 itens</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          {[
                                            { name: "Filé Mignon", img: "https://public.readdy.ai/ai/img_res/119bf86bc268349ebaa6bf748eff47a3.jpg", desc: "Filé ao molho madeira com cogumelos" },
                                            { name: "Salmão Grelhado", img: "https://public.readdy.ai/ai/img_res/68a2ff7ee6f61f6c6b0f78ca78bc5f13.jpg", desc: "Salmão grelhado com ervas finas" },
                                            { name: "Risoto de Cogumelos", img: "https://public.readdy.ai/ai/img_res/c1248e0f61daa1c21adcdc44e06db716.jpg", desc: "Risoto cremoso com mix de cogumelos" },
                                            { name: "Ravioli", img: "https://public.readdy.ai/ai/img_res/6f8df1bd2a80878edaccbfb15a0a1a93.jpg", desc: "Ravioli recheado com queijo e espinafre" },
                                            { name: "Frango Supreme", img: "https://public.readdy.ai/ai/img_res/52df43839701833dcbd110152fb475a5.jpg", desc: "Peito de frango recheado com queijo" },
                                            { name: "Cordeiro", img: "https://public.readdy.ai/ai/img_res/af718d201988b5ac8c469609f522c959.jpg", desc: "Carré de cordeiro com crosta de ervas" }
                                          ].map((item) => (
                                            <label key={item.name} className="border rounded-lg overflow-hidden block cursor-pointer hover:border-primary transition-colors">
                                              <input 
                                                type="checkbox" 
                                                name="pratosPrincipais"
                                                className="sr-only"
                                                onChange={(e) => {
                                                  const checked = document.querySelectorAll('input[name="pratosPrincipais"]:checked');
                                                  if (checked.length > 3) e.target.checked = false;
                                                }}
                                              />
                                              <div className="relative">
                                                <img src={item.img} alt={item.name} className="w-full h-32 object-cover" />
                                                <div className="p-3">
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                    <div className="w-5 h-5 border-2 rounded border-primary flex items-center justify-center">
                                                      <div className="w-3 h-3 bg-primary rounded peer-checked:block hidden"></div>
                                                    </div>
                                                  </div>
                                                  <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                              </div>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-4 mt-8">
                                        <div className="flex justify-between items-center">
                                          <h3 className="font-medium text-gray-800">Sobremesas</h3>
                                          <span className="text-sm text-primary">Selecione 2 itens</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          {[
                                            { name: "Tiramisu", img: "https://public.readdy.ai/ai/img_res/e3ffc524b6e6a25406bbc138eaca8c60.jpg", desc: "Clássica sobremesa italiana com café" },
                                            { name: "Cheesecake", img: "https://public.readdy.ai/ai/img_res/5d9928332f56a8facf90adeff2440d80.jpg", desc: "Cheesecake com calda de frutas vermelhas" },
                                            { name: "Pudim", img: "https://public.readdy.ai/ai/img_res/119bf86bc268349ebaa6bf748eff47a3.jpg", desc: "Pudim de leite com calda de caramelo" },
                                            { name: "Mousse de Chocolate", img: "https://public.readdy.ai/ai/img_res/68a2ff7ee6f61f6c6b0f78ca78bc5f13.jpg", desc: "Mousse de chocolate belga" }
                                          ].map((item) => (
                                            <label key={item.name} className="border rounded-lg overflow-hidden block cursor-pointer hover:border-primary transition-colors">
                                              <input 
                                                type="checkbox" 
                                                name="sobremesas"
                                                className="peer sr-only"
                                                onChange={(e) => {
                                                  const checked = document.querySelectorAll('input[name="sobremesas"]:checked');
                                                  if (checked.length > 2) {
                                                    e.target.checked = false;
                                                    return;
                                                  }
                                                }}
                                              />
                                              <div className="relative">
                                                <img src={item.img} alt={item.name} className="w-full h-32 object-cover" />
                                                <div className="p-3">
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                    <div className="w-5 h-5 border-2 rounded border-primary flex items-center justify-center">
                                                      <div className="w-3 h-3 bg-primary rounded peer-checked:block hidden"></div>
                                                    </div>
                                                  </div>
                                                  <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                              </div>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                                      <Button 
                                        variant="outline"
                                        onClick={() => {
                                          setShowMenuOptions(false);
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button 
                                        className="bg-primary text-white"
                                        onClick={() => {
                                          setShowMenuOptions(false);
                                        }}
                                      >
                                        Confirmar Seleção
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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