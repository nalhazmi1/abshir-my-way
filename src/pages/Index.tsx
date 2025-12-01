import { useState } from "react";
import { ChevronDown, Search, Filter } from "lucide-react";
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

const Index = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedNationality, setSelectedNationality] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const applications = [
    {
      id: "VSA-2024-1234",
      name: "محمد أحمد",
      nationality: "مصري",
      applicationDate: "2024-11-28",
      purpose: "عمل",
      status: "low-risk" as const,
      passportNumber: "A12345678",
    },
    {
      id: "VSA-2024-1235",
      name: "فاطمة علي",
      nationality: "سوري",
      applicationDate: "2024-11-29",
      purpose: "سياحة",
      status: "pending" as const,
      passportNumber: "B23456789",
    },
    {
      id: "VSA-2024-1236",
      name: "أحمد حسن",
      nationality: "يمني",
      applicationDate: "2024-11-27",
      purpose: "عمرة",
      status: "low-risk" as const,
      passportNumber: "C34567890",
    },
    {
      id: "VSA-2024-1237",
      name: "خالد محمود",
      nationality: "لبناني",
      applicationDate: "2024-11-26",
      purpose: "عمل",
      status: "high-risk" as const,
      passportNumber: "D45678901",
    },
    {
      id: "VSA-2024-1238",
      name: "مريم سعيد",
      nationality: "أردني",
      applicationDate: "2024-11-30",
      purpose: "زيارة عائلية",
      status: "pending" as const,
      passportNumber: "E56789012",
    },
    {
      id: "VSA-2024-1239",
      name: "سعيد عبدالله",
      nationality: "مغربي",
      applicationDate: "2024-11-25",
      purpose: "استثمار",
      status: "low-risk" as const,
      passportNumber: "F67890123",
    },
  ];

  const stats = [
    { label: "إجمالي الطلبات", value: "156", color: "bg-blue-500" },
    { label: "قيد المراجعة", value: "45", color: "bg-yellow-500" },
    { label: "مخاطر منخفضة", value: "98", color: "bg-green-500" },
    { label: "مخاطر عالية", value: "13", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            طلبات التأشيرات
          </h1>
          <p className="text-muted-foreground">
            مراجعة وتحليل طلبات التأشيرات المقدمة
          </p>
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
                placeholder="البحث عن طلب (الاسم، رقم الجواز، رقم الطلب)"
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
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              فلاتر متقدمة
            </Button>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((application) => (
            <VisaApplicationCard key={application.id} {...application} />
          ))}
        </div>
      </main>

      <FloatingButtons />
    </div>
  );
};

export default Index;
