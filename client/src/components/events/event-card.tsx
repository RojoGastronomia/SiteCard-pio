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
      className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 text-sm">
            <Menu className="w-4 h-4 mr-2" />
            <span>{event.menuOptions || 2} opções de menu</span>
          </div>

          <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 font-medium">
            Disponível
          </span>
        </div>
      </div>
    </Card>
  );
}