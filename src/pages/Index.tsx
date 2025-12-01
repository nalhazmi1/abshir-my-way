import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import LocationCard from "@/components/LocationCard";
import SaudiMap from "@/components/SaudiMap";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const locations = [
    {
      title: "الاحساء، فرع مدينة الحفر",
      days: "السبت - الخميس (23:00-09:00)",
      hours: "الجمعة (23:00-16:00)",
    },
    {
      title: "الاحساء، فرع الشعبية، الهفوف",
      days: "السبت - الخميس (23:00-09:00)",
      hours: "الجمعة (23:00-16:00)",
    },
    {
      title: "الاحساء، فرع الفيصلية الثاني، الفاضلية",
      days: "السبت - الخميس (23:00-09:00)",
      hours: "الجمعة (23:00-16:00)",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Right Side - Locations List */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="اختر المنطقة" />
                  <ChevronDown className="mr-2 h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riyadh">الرياض</SelectItem>
                  <SelectItem value="eastern">المنطقة الشرقية</SelectItem>
                  <SelectItem value="makkah">مكة المكرمة</SelectItem>
                  <SelectItem value="madinah">المدينة المنورة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="اختر المدينة" />
                  <ChevronDown className="mr-2 h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riyadh-city">الرياض</SelectItem>
                  <SelectItem value="jeddah">جدة</SelectItem>
                  <SelectItem value="dammam">الدمام</SelectItem>
                  <SelectItem value="hofuf">الهفوف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              {locations.map((location, index) => (
                <LocationCard key={index} {...location} />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <Link to="/visa-analysis" className="w-full">
                <Button
                  className="w-full px-8 py-6 bg-saudi-green hover:bg-saudi-green-dark text-white"
                >
                  <span className="font-bold text-lg">واجهة تحليل التأشيرات</span>
                </Button>
              </Link>
              
              <Button
                variant="outline"
                className="px-8 py-6 text-saudi-green border-saudi-green hover:bg-saudi-green-lighter"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-saudi-green fill-current">
                      <rect x="10" y="10" width="12" height="80" />
                      <rect x="28" y="10" width="12" height="80" />
                      <rect x="46" y="10" width="12" height="80" />
                      <rect x="64" y="10" width="12" height="80" />
                      <rect x="82" y="10" width="12" height="80" />
                    </svg>
                  </div>
                  <span className="font-bold text-lg">تسجيل الدخول ل</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Left Side - Map */}
          <div className="lg:sticky lg:top-8 h-fit">
            <SaudiMap />
          </div>
        </div>
      </main>

      <FloatingButtons />
    </div>
  );
};

export default Index;
