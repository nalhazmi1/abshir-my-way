import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, User, Calendar, Shield, ArrowRight, Briefcase, GraduationCap, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Violation {
  type: string;
  date: string;
  severity: string;
}

interface ApplicantData {
  id: string;
  full_name: string;
  nationality: string;
  passport_number: string;
  birth_date: string;
  gender: string;
  visa_type: string;
  entry_date: string;
  exit_date: string;
  sponsor: string;
  profession: string;
  employer: string | null;
  work_experience_years: number;
  monthly_salary: number | null;
  has_violations: boolean;
  violations: Violation[];
  education_level: string;
  previous_visits: number;
  risk_score: number | null;
  risk_analysis: string | null;
  status: string;
}

interface AIAnalysis {
  risk_score: number;
  risk_level: string;
  analysis: string;
  factors: string[];
  recommendation: string;
}


const VisaAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchApplicant();
    }
  }, [id]);

  const fetchApplicant = async () => {
    try {
      const response = await fetch("/data/visa_applicants.json");
      const applicants: ApplicantData[] = await response.json();
      const applicant = applicants.find(a => a.id === id);
      
      if (applicant) {
        setApplicantData(applicant);
        
        // Load saved AI analysis if exists
        if (applicant.risk_analysis) {
          try {
            const savedAnalysis = JSON.parse(applicant.risk_analysis);
            if (savedAnalysis.risk_score !== undefined) {
              setAiAnalysis(savedAnalysis);
            }
          } catch {
            // If not JSON, it's just text analysis from before
          }
        }
      }
    } catch (error) {
      console.error("Error fetching applicant:", error);
    }
    setLoading(false);
  };

  const analyzeRisk = async () => {
    if (!applicantData) return;
    
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-risk", {
        body: { applicant: applicantData },
      });

      if (error) {
        throw error;
      }

      setAiAnalysis(data);

      toast({
        title: "تم التحليل بنجاح",
        description: `درجة الخطورة: ${data.risk_score}%`,
      });
    } catch (error) {
      console.error("Error analyzing risk:", error);
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل المخاطر",
        variant: "destructive",
      });
    }
    setAnalyzing(false);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </main>
      </div>
    );
  }

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

  const riskScore = aiAnalysis?.risk_score ?? applicantData.risk_score ?? 0;
  const isHighRisk = riskScore >= 60;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                رجوع
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">تحليل المخاطر</h1>
          </div>
          <Badge variant="outline" className="text-sm">
            رقم التأشيرة: {id}
          </Badge>
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
                    {applicantData.full_name.split(" ")[0][0]}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span className="font-semibold">{applicantData.full_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">الجنسية:</span>
                    <span className="font-semibold">{applicantData.nationality}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">رقم الجواز:</span>
                    <span className="font-semibold">{applicantData.passport_number}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">تاريخ الميلاد:</span>
                    <span className="font-semibold">{applicantData.birth_date}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">الجنس:</span>
                    <span className="font-semibold">{applicantData.gender}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">نوع التأشيرة:</span>
                    <span className="font-semibold">{applicantData.visa_type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">الكفيل:</span>
                    <span className="font-semibold">{applicantData.sponsor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="w-4 h-4" />
                  معلومات العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">المهنة:</span>
                  <span className="font-semibold">{applicantData.profession}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">جهة العمل:</span>
                  <span className="font-semibold">{applicantData.employer || "غير محدد"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">سنوات الخبرة:</span>
                  <span className="font-semibold">{applicantData.work_experience_years} سنة</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">الراتب الشهري:</span>
                  <span className="font-semibold">{applicantData.monthly_salary ? `${applicantData.monthly_salary} ريال` : "غير محدد"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    المستوى التعليمي:
                  </span>
                  <span className="font-semibold">{applicantData.education_level}</span>
                </div>
              </CardContent>
            </Card>

            {applicantData.has_violations && applicantData.violations.length > 0 && (
              <Card className="border-red-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    سجل المخالفات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applicantData.violations.map((violation, index) => (
                    <div key={index} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm">{violation.type}</span>
                        <Badge variant="destructive" className="text-xs">{violation.severity}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{violation.date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Left Side - Analysis Dashboard */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Analysis Button */}
            {!aiAnalysis && !applicantData.risk_analysis && (
              <Card className="border-2 border-dashed border-primary/30">
                <CardContent className="p-8 text-center">
                  <Shield className="w-16 h-16 mx-auto text-primary/50 mb-4" />
                  <h3 className="text-xl font-bold mb-2">تحليل المخاطر بالذكاء الاصطناعي</h3>
                  <p className="text-muted-foreground mb-6">
                    اضغط لتحليل بيانات المتقدم والتنبؤ بدرجة الخطورة
                  </p>
                  <Button onClick={analyzeRisk} disabled={analyzing} size="lg">
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري التحليل...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 ml-2" />
                        بدء التحليل
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* AI Prediction Card */}
            {(aiAnalysis || applicantData.risk_analysis) && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      التحليل التنبؤي بالذكاء الاصطناعي
                    </span>
                    <Button variant="ghost" size="sm" onClick={analyzeRisk} disabled={analyzing}>
                      {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "إعادة التحليل"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gradient-to-br from-background to-muted">
                      <div className={`mb-2 ${isHighRisk ? "text-red-500" : "text-green-500"}`}>
                        {isHighRisk ? (
                          <AlertTriangle className="w-20 h-20" />
                        ) : (
                          <CheckCircle className="w-20 h-20" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">درجة الخطورة</p>
                        <p className={`text-4xl font-bold ${isHighRisk ? "text-red-500" : "text-green-500"}`}>
                          {riskScore}%
                        </p>
                        <p className={`text-lg font-semibold mt-2 ${isHighRisk ? "text-red-500" : "text-green-500"}`}>
                          {aiAnalysis?.risk_level || (isHighRisk ? "مخاطر عالية" : "مخاطر منخفضة")}
                        </p>
                      </div>
                    </div>

                    {aiAnalysis?.factors && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">عوامل التقييم:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {aiAnalysis.factors.map((factor, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {(aiAnalysis?.analysis || applicantData.risk_analysis) && (
                    <div className="mt-6 p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">التحليل المفصل:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {aiAnalysis?.analysis || applicantData.risk_analysis}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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
                    <div className="text-2xl font-bold text-primary">{applicantData.previous_visits}</div>
                    <div className="text-xs text-muted-foreground mt-1">عدد الزيارات</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">{applicantData.violations.length}</div>
                    <div className="text-xs text-muted-foreground mt-1">المخالفات</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">{applicantData.work_experience_years}</div>
                    <div className="text-xs text-muted-foreground mt-1">سنوات الخبرة</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">{applicantData.education_level}</div>
                    <div className="text-xs text-muted-foreground mt-1">المستوى التعليمي</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default VisaAnalysis;
