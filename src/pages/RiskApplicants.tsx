import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, AlertTriangle, Shield } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface VisaApplicant {
  id: string;
  full_name: string;
  nationality: string;
  passport_number: string;
  visa_type: string;
  status: string;
  risk_score: number | null;
}

const RiskApplicants = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<VisaApplicant[]>([]);
  const [loading, setLoading] = useState(true);

  const isHighRisk = level === "high";
  const title = isHighRisk ? "مخاطر عالية" : "مخاطر منخفضة";

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/data/visa_applicants.json");
      const data: VisaApplicant[] = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const filteredApplicants = applications.filter((app) => {
    if (app.risk_score === null) return false;
    return isHighRisk ? app.risk_score >= 60 : app.risk_score < 60;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button and Title */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Button>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isHighRisk ? "bg-red-500/10" : "bg-green-500/10"
              }`}
            >
              {isHighRisk ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <Shield className="w-6 h-6 text-green-500" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground">
                {filteredApplicants.length} متقدم
              </p>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            جاري التحميل...
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا يوجد متقدمين في هذه الفئة
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredApplicants.map((applicant) => (
              <Card
                key={applicant.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/visa-analysis/${applicant.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isHighRisk ? "bg-red-500/10" : "bg-green-500/10"
                        }`}
                      >
                        {isHighRisk ? (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Shield className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {applicant.full_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {applicant.nationality} • {applicant.visa_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={isHighRisk ? "destructive" : "secondary"}
                        className={!isHighRisk ? "bg-green-500/10 text-green-600" : ""}
                      >
                        درجة الخطورة: {applicant.risk_score}%
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground rotate-180" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RiskApplicants;
