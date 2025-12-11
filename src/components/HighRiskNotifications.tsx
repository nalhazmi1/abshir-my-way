import { AlertTriangle, X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface HighRiskApplicant {
  id: string;
  full_name: string;
  nationality: string;
  risk_score: number | null;
  visa_type: string;
}

interface HighRiskNotificationsProps {
  applicants: HighRiskApplicant[];
}

const HighRiskNotifications = ({ applicants }: HighRiskNotificationsProps) => {
  const navigate = useNavigate();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const highRiskApplicants = applicants.filter(
    (a) => a.risk_score !== null && a.risk_score >= 60 && !dismissedIds.includes(a.id)
  );

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleViewApplicant = (id: string) => {
    navigate(`/visa-analysis/${id}`);
  };

  if (highRiskApplicants.length === 0) {
    return null;
  }

  return (
    <Card className="border-destructive/50 bg-destructive/5 mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <span>تنبيهات المخاطر العالية</span>
          <Badge variant="destructive" className="mr-2">
            {highRiskApplicants.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[200px]">
          <div className="space-y-2">
            {highRiskApplicants.map((applicant) => (
              <div
                key={applicant.id}
                onClick={() => handleViewApplicant(applicant.id)}
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-destructive/20 hover:border-destructive/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{applicant.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.nationality} • {applicant.visa_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="text-sm">
                    درجة الخطورة: {applicant.risk_score}%
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDismiss(applicant.id, e)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HighRiskNotifications;
