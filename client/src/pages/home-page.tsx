import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Footer } from "@/components/layout/footer";
import EventCard from "@/components/events/event-card";
import EventDetailsModal from "@/components/events/event-details-modal";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn } from "@/lib/queryClient";

export default function HomePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getQueryFn({ on401: "throw" }),
    gcTime: 0,
    staleTime: 0,
    retry: 1,
  });
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleMenuOptionsClick = (e: React.MouseEvent, event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">        
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Eventos Gastronômicos</h1>
        <p className="text-lg text-gray-600">
          Explore nossos serviços de catering para todos os tipos de eventos
        </p>
      </div>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10"></div>
        <img
          src="https://public.readdy.ai/ai/img_res/b8905632f9218145207ecce49d4cdfb3.jpg"
          alt="Eventos Gastronômicos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 z-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gastronomia de alta qualidade para seu evento
          </h2>
          <p className="text-white text-lg mb-6 max-w-xl">
            Oferecemos serviços completos de catering para todos os tipos de eventos, 
            desde casamentos a eventos corporativos.
          </p>
          <button 
            onClick={() => navigate("/events")}
            className="bg-white text-primary px-6 py-3 rounded-button font-medium hover:bg-white/90 transition-colors">
            Ver Eventos Disponíveis
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8">Eventos Disponíveis</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="h-48 w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events && events.map((event: Event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={() => handleEventClick(event)}
              onMenuOptionsClick={handleMenuOptionsClick}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      )}
      
    </main>
  );
}
