
import { type Event } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Menu } from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group bg-white rounded-lg"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {event.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Menu className="w-4 h-4 mr-2" />
            <span>{event.menuOptions || 2} opções de menu</span>
          </div>

          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
            Disponível
          </span>
        </div>
      </div>
    </Card>
  );
}
