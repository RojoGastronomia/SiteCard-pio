import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { LucideIcon, ArrowUp } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  change: number;
  iconBgColor?: string;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatsCardProps) {
  // Format number value with thousands separator
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') {
      return val;
    }
    
    if (val >= 1000) {
      return val.toLocaleString('pt-BR');
    }
    
    return val;
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className={`w-10 h-10 flex items-center justify-center ${iconBgColor} rounded-full`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>
        <p className="text-3xl font-semibold text-gray-900">{formatValue(value)}</p>
        <div className="flex items-center mt-2">
          <span className="text-success flex items-center text-sm">
            <ArrowUp className="mr-1" size={14} />
            {change}%
          </span>
          <span className="text-gray-500 text-sm ml-2">desde o último mês</span>
        </div>
      </CardContent>
    </Card>
  );
}
