import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface LocationCardProps {
  title: string;
  days: string;
  hours: string;
}

const LocationCard = ({ title, days, hours }: LocationCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-1">{days}</p>
          <p className="text-sm text-muted-foreground">{hours}</p>
          <Button variant="link" className="text-saudi-green mt-2 p-0 h-auto font-semibold">
            التوجه للموقع
          </Button>
        </div>
        <div className="w-10 h-10 rounded-full bg-saudi-green-lighter flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-saudi-green" />
        </div>
      </div>
    </Card>
  );
};

export default LocationCard;
