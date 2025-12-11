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
}

interface RiskChartsProps {
  applicants: Applicant[];
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

const RiskCharts = ({ applicants }: RiskChartsProps) => {
  // Calculate high-risk count by nationality
  const nationalityRiskData = applicants
    .filter((a) => a.risk_score !== null && a.risk_score >= 60)
    .reduce((acc: Record<string, number>, curr) => {
      acc[curr.nationality] = (acc[curr.nationality] || 0) + 1;
      return acc;
    }, {});

  const nationalityChartData = Object.entries(nationalityRiskData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Calculate risk distribution by visa type
  const visaTypeRiskData = applicants
    .filter((a) => a.risk_score !== null && a.risk_score >= 60)
    .reduce((acc: Record<string, number>, curr) => {
      acc[curr.visa_type] = (acc[curr.visa_type] || 0) + 1;
      return acc;
    }, {});

  const visaTypeChartData = Object.entries(visaTypeRiskData).map(
    ([name, value]) => ({ name, value })
  );

  // Calculate average risk score by nationality
  const avgRiskByNationality = applicants
    .filter((a) => a.risk_score !== null)
    .reduce((acc: Record<string, { total: number; count: number }>, curr) => {
      if (!acc[curr.nationality]) {
        acc[curr.nationality] = { total: 0, count: 0 };
      }
      acc[curr.nationality].total += curr.risk_score!;
      acc[curr.nationality].count += 1;
      return acc;
    }, {});

  const avgRiskChartData = Object.entries(avgRiskByNationality)
    .map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (applicants.length === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* High Risk by Nationality Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">الجنسيات الأكثر خطورة</CardTitle>
        </CardHeader>
        <CardContent>
          {nationalityChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={nationalityChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 14, fill: "hsl(var(--foreground))", fontWeight: 500 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} متقدم`, "العدد"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              لا توجد بيانات
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk by Visa Type Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">توزيع المخاطر حسب نوع التأشيرة</CardTitle>
        </CardHeader>
        <CardContent>
          {visaTypeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={visaTypeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {visaTypeChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} متقدم`, "العدد"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              لا توجد بيانات
            </div>
          )}
        </CardContent>
      </Card>

      {/* Average Risk Score by Nationality */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">متوسط درجة الخطورة حسب الجنسية</CardTitle>
        </CardHeader>
        <CardContent>
          {avgRiskChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={avgRiskChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 14, fill: "hsl(var(--foreground))", fontWeight: 500 }} />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 14, fill: "hsl(var(--foreground))", fontWeight: 500 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "متوسط الخطورة"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {avgRiskChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 60 ? "#ef4444" : entry.value >= 40 ? "#f97316" : "#22c55e"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              لا توجد بيانات
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskCharts;
