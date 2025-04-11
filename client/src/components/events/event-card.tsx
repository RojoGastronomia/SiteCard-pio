import { type Event } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card 
      className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover object-top"
        />
      </div>
      <CardContent className="p-5">
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
    </Card>
  );
}
