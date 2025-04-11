import { type Event } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onMenuOptionsClick?: (e: React.MouseEvent, event: Event) => void;
}

export default function EventCard({ event, onClick, onMenuOptionsClick }: EventCardProps) {
  const handleCardClick = () => {
    if (onClick) onClick();
  };
  
  const handleMenuOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no botão acione também o onClick do card
    if (onMenuOptionsClick) onMenuOptionsClick(e, event);
  };
  
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      <div 
        className="h-48 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover object-top"
        />
      </div>
      <CardContent className="p-5 cursor-pointer" onClick={handleCardClick}>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="mr-2" size={16} />
            <span>{event.menuOptions} opções de menu</span>
          </div>
          <span className="bg-primary text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
            {event.status === "available" ? "Disponível" : event.status}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 mt-auto">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleMenuOptionsClick}
        >
          Ver Opções do Menu
        </Button>
      </CardFooter>
    </Card>
  );
}
