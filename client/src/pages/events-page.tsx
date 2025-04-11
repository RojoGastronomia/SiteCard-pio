import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import EventCard from "@/components/events/event-card";
import EventDetailsModal from "@/components/events/event-details-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EventsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    onError: (error: Error) => {
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const filteredEvents = events?.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = eventType ? event.eventType === eventType : true;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Eventos Disponíveis</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  {eventType ? `Tipo: ${eventType}` : "Filtrar por tipo"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEventType(null)}>
                  Todos os tipos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventType("corporate")}>
                  Eventos Corporativos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventType("wedding")}>
                  Casamentos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventType("birthday")}>
                  Aniversários
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventType("coffee")}>
                  Coffee Breaks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventType("kids")}>
                  Festas Infantis
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">Nenhum evento encontrado</h3>
            <p className="text-gray-500 mt-2">
              Tente ajustar seus filtros ou busque por outros termos.
            </p>
          </div>
        )}
      </main>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </>
  );
}
