import { AlertTriangle, X, ChevronLeft, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {highRiskApplicants.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {highRiskApplicants.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h4 className="font-semibold flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            تنبيهات المخاطر العالية
          </h4>
        </div>
        {highRiskApplicants.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            لا توجد تنبيهات
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="p-2 space-y-1">
              {highRiskApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  onClick={() => handleViewApplicant(applicant.id)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{applicant.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {applicant.nationality} • {applicant.risk_score}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDismiss(applicant.id, e)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default HighRiskNotifications;