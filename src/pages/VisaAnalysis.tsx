import { useState } from "react";
import { CheckCircle, AlertTriangle, User, Calendar, MapPin, Phone, Mail, Shield, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const applicantsData: Record<string, {
  name: string;
  nationality: string;
  passportNumber: string;
  purpose: string;
  duration: string;
  previousVisits: number;
  phone: string;
  email: string;
  status: "low" | "high";
}> = {
  "VSA-2024-1234": {
    name: "محمد أحمد",
    nationality: "مصري",
    passportNumber: "A12345678",
    purpose: "سياحة",
    duration: "90 يوم",
    previousVisits: 3,
    phone: "+20 123 456 7890",
    email: "mohamed.ahmed@email.com",
    status: "low"
  },
  "VSA-2024-1235": {
    name: "فاطمة علي",
    nationality: "سوري",
    passportNumber: "B23456789",
    purpose: "سياحة",
    duration: "30 يوم",
    previousVisits: 0,
    phone: "+963 912 345 678",
    email: "fatima.ali@email.com",
    status: "low"
  },
  "VSA-2024-1236": {
    name: "أحمد حسن",
    nationality: "يمني",
    passportNumber: "C34567890",
    purpose: "عمرة",
    duration: "14 يوم",
    previousVisits: 5,
    phone: "+967 771 234 567",
    email: "ahmed.hassan@email.com",
    status: "low"
  },
  "VSA-2024-1237": {
    name: "خالد محمود",
    nationality: "لبناني",
    passportNumber: "D45678901",
    purpose: "عمل",
    duration: "180 يوم",
    previousVisits: 1,
    phone: "+961 3 456 789",
    email: "khaled.mahmoud@email.com",
    status: "high"
  },
  "VSA-2024-1238": {
    name: "مريم سعيد",
    nationality: "أردني",
    passportNumber: "E56789012",
    purpose: "زيارة عائلية",
    duration: "60 يوم",
    previousVisits: 2,
    phone: "+962 79 123 4567",
    email: "maryam.saeed@email.com",
    status: "low"
  },
  "VSA-2024-1239": {
    name: "سعيد عبدالله",
    nationality: "مغربي",
    passportNumber: "F67890123",
    purpose: "استثمار",
    duration: "365 يوم",
    previousVisits: 4,
    phone: "+212 6 12 34 56 78",
    email: "saeed.abdullah@email.com",
    status: "low"
  }
};

const VisaAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const applicantData = id ? applicantsData[id] : null;
  const [riskLevel, setRiskLevel] = useState<"low" | "high">(applicantData?.status || "low");
  const { toast } = useToast();

  if (!applicantData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">لم يتم العثور على الطلب</h1>
          <Link to="/">
            <Button>العودة للصفحة الرئيسية</Button>
          </Link>
        </main>
      </div>
    );
  }

  const analysisMetrics = [
    { label: "تحليل السلوك", score: 92, status: "آمن" },
    { label: "التحليل السلوكي", score: 88, status: "آمن" },
    { label: "الامتثال", score: 95, status: "ممتاز" },
    { label: "المصداقية", score: riskLevel === "low" ? 90 : 45, status: riskLevel === "low" ? "عالية" : "منخفضة" }
  ];

  const handleGrantEntry = () => {
    toast({
      title: "تم منح الإذن بالدخول",
      description: "تم الموافقة على طلب التأشيرة بنجاح",
      duration: 3000,
    });
  };

  const handleFurtherReview = () => {
    toast({
      title: "تم إرسال للمراجعة الإضافية",
      description: "سيتم فحص الطلب من قبل المختصين",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                رجوع
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">تحليل طلب التأشيرة</h1>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm">
              رقم الطلب: {id}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Right Side - Applicant Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  بيانات المقدم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-saudi-green to-saudi-green-dark flex items-center justify-center text-white text-3xl font-bold">
                    {applicantData.name.split(" ")[0][0]}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span className="font-semibold">{applicantData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">الجنسية:</span>
                    <span className="font-semibold">{applicantData.nationality}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">رقم الجواز:</span>
                    <span className="font-semibold">{applicantData.passportNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">غرض الزيارة:</span>
                    <span className="font-semibold">{applicantData.purpose}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">مدة الإقامة:</span>
                    <span className="font-semibold">{applicantData.duration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">الزيارات السابقة:</span>
                    <span className="font-semibold">{applicantData.previousVisits}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-4 h-4" />
                  معلومات الاتصال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{applicantData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{applicantData.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Left Side - Analysis Dashboard */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Prediction Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    التحليل التنبؤي بالذكاء الاصطناعي
                  </span>
                  <button 
                    onClick={() => setRiskLevel(prev => prev === "low" ? "high" : "low")}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    تبديل المخاطر
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gradient-to-br from-background to-muted">
                    <div className={`text-6xl font-bold mb-2 ${riskLevel === "low" ? "text-green-500" : "text-red-500"}`}>
                      {riskLevel === "low" ? (
                        <CheckCircle className="w-20 h-20" />
                      ) : (
                        <AlertTriangle className="w-20 h-20" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">التنبؤ</p>
                      <p className={`text-2xl font-bold ${riskLevel === "low" ? "text-green-500" : "text-red-500"}`}>
                        {riskLevel === "low" ? "مخاطر منخفضة" : "مخاطر عالية"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="font-semibold">{metric.score}%</span>
                        </div>
                        <Progress value={metric.score} className="h-2" />
                        <p className="text-xs text-muted-foreground">{metric.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  المقاييس التاريخية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-xs text-muted-foreground mt-1">عدد الزيارات</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-xs text-muted-foreground mt-1">المخالفات</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-xs text-muted-foreground mt-1">نسبة الامتثال</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">ممتاز</div>
                    <div className="text-xs text-muted-foreground mt-1">التقييم العام</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decision Support */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5">
              <CardHeader>
                <CardTitle>دعم القرار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="w-full h-16 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleGrantEntry}
                  >
                    <CheckCircle className="w-6 h-6 ml-2" />
                    منح الإذن بالدخول
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-16 text-lg font-bold border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                    onClick={handleFurtherReview}
                  >
                    <AlertTriangle className="w-6 h-6 ml-2" />
                    مراجعة إضافية
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  القرار النهائي يعتمد على تقييم المسؤول المختص
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisaAnalysis;
