import { useState, useEffect } from "react";
import { ChevronDown, Search, Filter, Download } from "lucide-react";
import Header from "@/components/Header";
import VisaApplicationCard from "@/components/VisaApplicationCard";
import FloatingButtons from "@/components/FloatingButtons";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VisaApplicant {
  id: string;
  full_name: string;
  nationality: string;
  passport_number: string;
  visa_type: string;
  status: string;
  created_at: string;
  risk_score: number | null;
}

const Index = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedNationality, setSelectedNationality] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [applications, setApplications] = useState<VisaApplicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("visa_applicants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const getStatusFromRisk = (riskScore: number | null, status: string): "pending" | "low-risk" | "high-risk" => {
    if (status === "pending" || riskScore === null) return "pending";
    if (riskScore >= 60) return "high-risk";
    return "low-risk";
  };

  const exportToCSV = async () => {
    const { data, error } = await supabase
      .from("visa_applicants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في تصدير البيانات",
        variant: "destructive",
      });
      return;
    }

    if (!data || data.length === 0) {
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
      "نوع التأشيرة",
      "الحالة",
      "درجة المخاطرة",
      "المهنة",
      "جهة العمل",
      "تاريخ الدخول",
      "تاريخ الخروج",
      "الكفيل",
      "تاريخ الميلاد",
      "الجنس",
      "المستوى التعليمي",
      "الراتب الشهري",
      "سنوات الخبرة",
      "الزيارات السابقة",
      "وجود مخالفات"
    ];

    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.id,
        row.full_name,
        row.nationality,
        row.passport_number,
        row.visa_type,
        row.status,
        row.risk_score || "",
        row.profession,
        row.employer || "",
        row.entry_date,
        row.exit_date,
        row.sponsor,
        row.birth_date,
        row.gender,
        row.education_level || "",
        row.monthly_salary || "",
        row.work_experience_years || "",
        row.previous_visits || "",
        row.has_violations ? "نعم" : "لا"
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

  const stats = [
    { label: "إجمالي الطلبات", value: applications.length.toString(), color: "bg-blue-500" },
    { label: "قيد المراجعة", value: applications.filter(a => a.status === "pending").length.toString(), color: "bg-yellow-500" },
    { label: "مخاطر منخفضة", value: applications.filter(a => a.risk_score !== null && a.risk_score < 60).length.toString(), color: "bg-green-500" },
    { label: "مخاطر عالية", value: applications.filter(a => a.risk_score !== null && a.risk_score >= 60).length.toString(), color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            تحليل المخاطر
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="حالة الطلب" />
                <ChevronDown className="mr-2 h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="low-risk">مخاطر منخفضة</SelectItem>
                <SelectItem value="high-risk">مخاطر عالية</SelectItem>
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
                <SelectItem value="egyptian">مصري</SelectItem>
                <SelectItem value="syrian">سوري</SelectItem>
                <SelectItem value="yemeni">يمني</SelectItem>
                <SelectItem value="lebanese">لبناني</SelectItem>
                <SelectItem value="jordanian">أردني</SelectItem>
                <SelectItem value="moroccan">مغربي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              عرض {applications.length} من أصل {applications.length} طلب
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
            {applications.map((application) => (
              <VisaApplicationCard
                key={application.id}
                id={application.id}
                name={application.full_name}
                nationality={application.nationality}
                applicationDate={application.created_at.split("T")[0]}
                purpose={application.visa_type}
                status={getStatusFromRisk(application.risk_score, application.status)}
                passportNumber={application.passport_number}
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
