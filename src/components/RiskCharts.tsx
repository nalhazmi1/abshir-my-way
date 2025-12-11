import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Applicant {
  nationality: string;
  visa_type: string;
  risk_score: number | null;
  gender?: string;
  birth_date?: string;
}

interface RiskChartsProps {
  applicants: Applicant[];
}

const RISK_COLORS = {
  high: "#ef4444",
  medium: "#f97316", 
  low: "#22c55e",
};

const getRiskLevel = (score: number | null): "high" | "medium" | "low" => {
  if (score === null) return "low";
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
};

const getAgeGroup = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  
  if (age < 25) return "أقل من 25";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  return "55+";
};

const RiskCharts = ({ applicants }: RiskChartsProps) => {
  const analyzedApplicants = applicants.filter((a) => a.risk_score !== null);
  
  if (analyzedApplicants.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            لا توجد بيانات للرسوم البيانية. قم بتحليل الوافدين أولاً للحصول على إحصائيات المخاطر.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Risk distribution by Gender
  const genderRiskData = analyzedApplicants.reduce((acc: Record<string, { low: number; medium: number; high: number }>, curr) => {
    const gender = curr.gender || "غير محدد";
    if (!acc[gender]) {
      acc[gender] = { low: 0, medium: 0, high: 0 };
    }
    const level = getRiskLevel(curr.risk_score);
    acc[gender][level]++;
    return acc;
  }, {});

  const genderChartData = Object.entries(genderRiskData).map(([name, data]) => ({
    name,
    منخفضة: data.low,
    متوسطة: data.medium,
    عالية: data.high,
  }));

  // Risk distribution by Age Group
  const ageRiskData = analyzedApplicants.reduce((acc: Record<string, { low: number; medium: number; high: number }>, curr) => {
    const ageGroup = curr.birth_date ? getAgeGroup(curr.birth_date) : "غير محدد";
    if (!acc[ageGroup]) {
      acc[ageGroup] = { low: 0, medium: 0, high: 0 };
    }
    const level = getRiskLevel(curr.risk_score);
    acc[ageGroup][level]++;
    return acc;
  }, {});

  const ageChartData = Object.entries(ageRiskData)
    .map(([name, data]) => ({
      name,
      منخفضة: data.low,
      متوسطة: data.medium,
      عالية: data.high,
    }))
    .sort((a, b) => {
      const order = ["أقل من 25", "25-34", "35-44", "45-54", "55+", "غير محدد"];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  // Risk distribution by Nationality
  const nationalityRiskData = analyzedApplicants.reduce((acc: Record<string, { low: number; medium: number; high: number; total: number }>, curr) => {
    if (!acc[curr.nationality]) {
      acc[curr.nationality] = { low: 0, medium: 0, high: 0, total: 0 };
    }
    const level = getRiskLevel(curr.risk_score);
    acc[curr.nationality][level]++;
    acc[curr.nationality].total++;
    return acc;
  }, {});

  const nationalityChartData = Object.entries(nationalityRiskData)
    .map(([name, data]) => ({
      name,
      منخفضة: data.low,
      متوسطة: data.medium,
      عالية: data.high,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Risk distribution by Visa Type
  const visaTypeRiskData = analyzedApplicants.reduce((acc: Record<string, { low: number; medium: number; high: number }>, curr) => {
    if (!acc[curr.visa_type]) {
      acc[curr.visa_type] = { low: 0, medium: 0, high: 0 };
    }
    const level = getRiskLevel(curr.risk_score);
    acc[curr.visa_type][level]++;
    return acc;
  }, {});

  const visaTypeChartData = Object.entries(visaTypeRiskData).map(([name, data]) => ({
    name,
    منخفضة: data.low,
    متوسطة: data.medium,
    عالية: data.high,
  }));

  const legendItems = [
    { name: "عالية", color: RISK_COLORS.high },
    { name: "متوسطة", color: RISK_COLORS.medium },
    { name: "منخفضة", color: RISK_COLORS.low },
  ];

  const CustomLegend = () => (
    <div className="flex justify-center gap-4 mb-4">
      {legendItems.map((item) => (
        <div key={item.name} className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Risk by Gender */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">توزيع المخاطر حسب الجنس</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomLegend />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={genderChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                tick={{ fontSize: 14, fill: "hsl(var(--foreground))", fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="منخفضة" stackId="a" fill={RISK_COLORS.low} />
              <Bar dataKey="متوسطة" stackId="a" fill={RISK_COLORS.medium} />
              <Bar dataKey="عالية" stackId="a" fill={RISK_COLORS.high} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk by Age Group */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">توزيع المخاطر حسب الفئة العمرية</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomLegend />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="منخفضة" stackId="a" fill={RISK_COLORS.low} radius={[0, 0, 0, 0]} />
              <Bar dataKey="متوسطة" stackId="a" fill={RISK_COLORS.medium} radius={[0, 0, 0, 0]} />
              <Bar dataKey="عالية" stackId="a" fill={RISK_COLORS.high} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk by Nationality */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">توزيع المخاطر حسب الجنسية</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomLegend />
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={nationalityChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="منخفضة" stackId="a" fill={RISK_COLORS.low} radius={[0, 0, 0, 0]} />
              <Bar dataKey="متوسطة" stackId="a" fill={RISK_COLORS.medium} radius={[0, 0, 0, 0]} />
              <Bar dataKey="عالية" stackId="a" fill={RISK_COLORS.high} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk by Visa Type */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">توزيع المخاطر حسب نوع التأشيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomLegend />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visaTypeChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 14, fill: "hsl(var(--foreground))", fontWeight: 500 }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="منخفضة" stackId="a" fill={RISK_COLORS.low} radius={[0, 0, 0, 0]} />
              <Bar dataKey="متوسطة" stackId="a" fill={RISK_COLORS.medium} radius={[0, 0, 0, 0]} />
              <Bar dataKey="عالية" stackId="a" fill={RISK_COLORS.high} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskCharts;