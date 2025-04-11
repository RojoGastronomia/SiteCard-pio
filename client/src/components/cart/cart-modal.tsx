import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import CartItem from "./cart-item";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package2, X } from "lucide-react";
import { useLocation } from "wouter";

export default function CartModal() {
  const { cartItems, cartOpen, closeCart, clearCart, calculateSubtotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [processing, setProcessing] = useState(false);

  const subtotal = calculateSubtotal();
  const serviceCharge = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceCharge;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setProcessing(false);
      clearCart();
      closeCart();
      toast({
        title: "Pedido realizado com sucesso",
        description: "Seu pedido foi enviado e está sendo processado.",
      });
      navigate("/orders");
    },
    onError: (error: Error) => {
      setProcessing(false);
      toast({
        title: "Erro ao processar o pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (!user) {
      closeCart();
      navigate("/auth");
      return;
    }

    if (cartItems.length === 0) return;

    setProcessing(true);

    // For each cart item, create an order
    cartItems.forEach(item => {
      const orderData = {
        userId: user.id,
        eventId: item.eventId,
        status: "pending",
        date: new Date(item.date),
        guestCount: item.guestCount,
        menuSelection: item.menuSelection,
        totalAmount: item.price,
        additionalInfo: `Quantity: ${item.quantity}`
      };

      createOrderMutation.mutate(orderData);
    });
  };

  return (
    <Dialog open={cartOpen} onOpenChange={closeCart}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex justify-between items-center flex-row">
          <DialogTitle className="flex items-center">
            <ShoppingCart className="mr-2" size={18} />
            Seu Carrinho
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X size={18} />
          </Button>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-grow p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Package2 className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Seu carrinho está vazio</h3>
              <p className="text-gray-500 text-center mb-6">
                Adicione eventos ao seu carrinho para continuar.
              </p>
              <Button onClick={closeCart}>Continuar Comprando</Button>
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Taxa de serviço (10%)</span>
              <span className="font-medium">{formatCurrency(serviceCharge)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-lg font-medium">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={closeCart}
              >
                Continuar Comprando
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? "Processando..." : "Finalizar Pedido"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
