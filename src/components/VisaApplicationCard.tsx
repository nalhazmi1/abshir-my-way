import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, AlertTriangle, Shield } from "lucide-react";


interface VisaApplicationCardProps {
  id: string;
  name: string;
  nationality: string;
  purpose: string;
  passportNumber: string;
  riskScore?: number | null;
}

const VisaApplicationCard = ({
  id,
  name,
  nationality,
  purpose,
  passportNumber,
  riskScore,
}: VisaApplicationCardProps) => {
  const isHighRisk = riskScore !== null && riskScore !== undefined && riskScore >= 60;
  const hasRiskScore = riskScore !== null && riskScore !== undefined;

  return (
    <Link to={`/visa-analysis/${id}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-saudi-green cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saudi-green to-saudi-green-dark flex items-center justify-center text-white text-xl font-bold">
                {name.split(" ")[0][0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground">{passportNumber}</p>
              </div>
            </div>
            {hasRiskScore && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isHighRisk ? "bg-red-500/10" : "bg-green-500/10"}`}>
                {isHighRisk ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <Shield className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm font-bold ${isHighRisk ? "text-red-500" : "text-green-500"}`}>
                  {riskScore}%
                </span>
              </div>
            )}
          </div>

          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">نوع التأشيرة:</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {purpose}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">الجنسية</p>
              <p className="font-semibold">{nationality}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VisaApplicationCard;
