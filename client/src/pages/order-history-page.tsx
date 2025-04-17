import { useQuery } from "@tanstack/react-query";
import { Order, Event } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShoppingBag,
  Check,
  Clock4,
  XCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function OrderHistoryPage() {
  const { toast } = useToast();

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    onError: (error: Error) => {
      toast({
        title: "Error loading orders",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const getEventDetails = (eventId: number) => {
    return events?.find(event => event.id === eventId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Confirmado
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock4 className="w-3 h-3 mr-1" />
            Pendente
          </div>
        );
      case "cancelled":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </div>
        );
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Meus Pedidos</h1>

      {ordersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-px w-full my-4" />
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </Card>
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const eventDetails = getEventDetails(order.eventId);
            return (
              <Card key={order.id} className="overflow-hidden hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id}</h3>
                      <p className="text-sm text-gray-500">Realizado em {formatDate(order.createdAt)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Evento: {eventDetails?.title || `ID #${order.eventId}`}</span>
                    </div>
                    {eventDetails?.location && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Local: {eventDetails.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Data: {formatDate(order.date)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tipo de menu</span>
                      <span className="font-medium">{order.menuSelection}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Número de convidados</span>
                      <span className="font-medium">{order.guestCount}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-3">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-3">
                    <Button variant="outline">
                      Detalhes
                    </Button>
                    {order.status === "pending" ? (
                      <Button>
                        Efetuar Pagamento
                      </Button>
                    ) : (
                      <Button>
                        Acompanhar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum pedido encontrado</h3>
          <p className="text-gray-500 mb-6">
            Você ainda não fez nenhum pedido.
          </p>
          <Button onClick={() => window.location.href = "/events"}>
            Ver Eventos Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </main>
  );
}
