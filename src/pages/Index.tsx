import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, Filter, Download, Sparkles, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import VisaApplicationCard from "@/components/VisaApplicationCard";
import FloatingButtons from "@/components/FloatingButtons";
import RiskCharts from "@/components/RiskCharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VisaApplicant {
  id: string;
  full_name: string;
  nationality: string;
  passport_number: string;
  visa_type: string;
  status: string;
  risk_score: number | null;
  profession?: string;
  employer?: string;
  has_violations?: boolean;
  violations?: any;
  monthly_salary?: number;
  work_experience_years?: number;
  previous_visits?: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedVisaType, setSelectedVisaType] = useState<string>("");
  const [selectedNationality, setSelectedNationality] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [applications, setApplications] = useState<VisaApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);

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

  const analyzeAllApplicants = async () => {
    const notAnalyzed = applications.filter(a => a.risk_score === null);
    if (notAnalyzed.length === 0) {
      toast({
        title: "تنبيه",
        description: "تم تحليل جميع الوافدين مسبقاً",
      });
      return;
    }

    setAnalyzing(true);
    setAnalyzingProgress(0);

    const updatedApplications = [...applications];
    
    for (let i = 0; i < notAnalyzed.length; i++) {
      const applicant = notAnalyzed[i];
      try {
        const { data, error } = await supabase.functions.invoke('analyze-risk', {
          body: {
            applicantData: {
              profession: applicant.profession || 'غير محدد',
              employer: applicant.employer || 'غير محدد',
              has_violations: applicant.has_violations || false,
              violations: applicant.violations || [],
              monthly_salary: applicant.monthly_salary || 0,
              work_experience_years: applicant.work_experience_years || 0,
              previous_visits: applicant.previous_visits || 0,
              nationality: applicant.nationality,
              visa_type: applicant.visa_type,
            }
          }
        });

        if (!error && data) {
          const index = updatedApplications.findIndex(a => a.id === applicant.id);
          if (index !== -1) {
            updatedApplications[index] = {
              ...updatedApplications[index],
              risk_score: data.riskScore
            };
          }
        }
      } catch (error) {
        console.error(`Error analyzing applicant ${applicant.id}:`, error);
      }
      
      setAnalyzingProgress(Math.round(((i + 1) / notAnalyzed.length) * 100));
      setApplications([...updatedApplications]);
    }

    setAnalyzing(false);
    toast({
      title: "تم التحليل",
      description: `تم تحليل ${notAnalyzed.length} وافد بنجاح`,
    });
  };


  const exportToCSV = () => {
    if (applications.length === 0) {
      toast({
        title: "تنبيه",
        description: "لا توجد بيانات للتصدير",
      });
      return;
    }

    // CSV Headers in Arabic
    const headers = [
      "رقم الطلب",
      "الاسم الكامل",
      "الجنسية",
      "رقم الجواز",
      "تاريخ الميلاد",
      "الجنس",
      "نوع التأشيرة",
      "تاريخ الدخول",
      "تاريخ الخروج",
      "الكفيل",
      "المهنة",
      "جهة العمل",
      "المستوى التعليمي",
      "الراتب الشهري",
      "سنوات الخبرة",
      "عدد الزيارات السابقة",
      "يوجد مخالفات",
      "درجة المخاطرة",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredApplications.map((row: any) => [
        row.id,
        row.full_name,
        row.nationality,
        row.passport_number,
        row.birth_date || "",
        row.gender || "",
        row.visa_type,
        row.entry_date || "",
        row.exit_date || "",
        row.sponsor || "",
        row.profession || "",
        row.employer || "",
        row.education_level || "",
        row.monthly_salary || "",
        row.work_experience_years || "",
        row.previous_visits || 1,
        row.has_violations ? "نعم" : "لا",
        row.risk_score || "",
      ].map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Add BOM for Excel Arabic support
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visa_applicants_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "تم التصدير",
      description: "تم تصدير البيانات بنجاح",
    });
  };

  // Get unique nationalities from data
  const nationalities = [...new Set(applications.map(a => a.nationality))];

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchQuery === "" || 
      app.full_name.includes(searchQuery) || 
      app.passport_number.includes(searchQuery) ||
      app.id.includes(searchQuery);
    
    const matchesVisaType = selectedVisaType === "" || selectedVisaType === "all" || app.visa_type === selectedVisaType;
    
    const matchesNationality = selectedNationality === "" || selectedNationality === "all" || app.nationality === selectedNationality;
    
    return matchesSearch && matchesVisaType && matchesNationality;
  });

  const analyzedApplicants = applications.filter(a => a.risk_score !== null);
  const highRiskCount = analyzedApplicants.filter(a => a.risk_score! >= 60).length;
  const lowRiskCount = analyzedApplicants.filter(a => a.risk_score! < 60).length;
  const notAnalyzedCount = applications.filter(a => a.risk_score === null).length;

  const stats = [
    { label: "مخاطر منخفضة", value: lowRiskCount.toString(), color: "bg-green-500", route: "/risk-applicants/low" },
    { label: "مخاطر عالية", value: highRiskCount.toString(), color: "bg-red-500", route: "/risk-applicants/high" },
  ];

  const showAnalyzeButton = notAnalyzedCount > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            تحليل المخاطر
          </h1>
        </div>

        {/* Analyze All Button */}
        {showAnalyzeButton && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">تحليل الوافدين بالذكاء الاصطناعي</h3>
                  <p className="text-sm text-muted-foreground">
                    {notAnalyzedCount} وافد لم يتم تحليلهم بعد
                  </p>
                  {analyzing && (
                    <p className="text-sm text-primary mt-1">جاري التحليل... {analyzingProgress}%</p>
                  )}
                </div>
                <Button 
                  onClick={analyzeAllApplicants} 
                  disabled={analyzing}
                  className="gap-2"
                >
                  {analyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {analyzing ? 'جاري التحليل...' : 'تحليل الجميع'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden ${stat.route ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}
              onClick={() => stat.route && navigate(stat.route)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-16 rounded-full ${stat.color}`}></div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Charts */}
        <RiskCharts applicants={applications} />

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="البحث عن الاسم، رقم الإقامة، التأشيرة"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-card"
              />
            </div>

            <Select value={selectedVisaType} onValueChange={setSelectedVisaType}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="نوع التأشيرة" />
                <ChevronDown className="mr-2 h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="عمل">عمل</SelectItem>
                <SelectItem value="سياحة">سياحة</SelectItem>
                <SelectItem value="زيارة">زيارة</SelectItem>
                <SelectItem value="حج وعمرة">حج وعمرة</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedNationality}
              onValueChange={setSelectedNationality}
            >
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="الجنسية" />
                <ChevronDown className="mr-2 h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الجنسيات</SelectItem>
                {nationalities.map(nationality => (
                  <SelectItem key={nationality} value={nationality}>{nationality}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              عرض {filteredApplications.length} من أصل {applications.length} طلب
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={exportToCSV}>
                <Download className="w-4 h-4" />
                تصدير Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                فلاتر متقدمة
              </Button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApplications.map((application) => (
              <VisaApplicationCard
                key={application.id}
                id={application.id}
                name={application.full_name}
                nationality={application.nationality}
                purpose={application.visa_type}
                passportNumber={application.passport_number}
                riskScore={application.risk_score}
              />
            ))}
          </div>
        )}
      </main>

      <FloatingButtons />
    </div>
  );
};

export default Index;
