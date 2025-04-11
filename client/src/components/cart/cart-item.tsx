import { useCart } from "@/context/cart-context";
import { CartItem as CartItemType } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItemQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateCartItemQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="flex items-start border-b border-gray-100 pb-4">
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
          <Button variant="ghost" size="icon" onClick={handleRemove} className="h-6 w-6">
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">{formatDate(item.date)} • {item.guestCount} convidados</p>
        <p className="text-xs text-gray-500 mt-1">Menu: {item.menuSelection}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 text-sm">{item.quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
