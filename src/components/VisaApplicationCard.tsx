import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { User, Calendar, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisaApplicationCardProps {
  id: string;
  name: string;
  nationality: string;
  applicationDate: string;
  purpose: string;
  status: "pending" | "low-risk" | "high-risk";
  passportNumber: string;
}

const VisaApplicationCard = ({
  id,
  name,
  nationality,
  applicationDate,
  purpose,
  status,
  passportNumber,
}: VisaApplicationCardProps) => {
  const statusConfig = {
    pending: {
      label: "قيد المراجعة",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    "low-risk": {
      label: "مخاطر منخفضة",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    "high-risk": {
      label: "مخاطر عالية",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: <AlertCircle className="w-4 h-4" />,
    },
  };

  return (
    <Link to={`/visa-analysis/${id}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-saudi-green cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saudi-green to-saudi-green-dark flex items-center justify-center text-white text-xl font-bold">
                {name.split(" ")[0][0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground">{passportNumber}</p>
              </div>
            </div>
            <Badge
              className={cn(
                "flex items-center gap-1 border",
                statusConfig[status].color
              )}
            >
              {statusConfig[status].icon}
              {statusConfig[status].label}
            </Badge>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">نوع التأشيرة:</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {purpose}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">الجنسية</p>
                <p className="font-semibold">{nationality}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">تاريخ التقديم</p>
                <p className="font-semibold">{applicationDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VisaApplicationCard;
