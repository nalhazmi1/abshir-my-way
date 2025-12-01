import { Search, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo on the right (RTL) */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-saudi-green rounded-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16 text-white fill-current">
                <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground">رؤية</div>
              <div className="text-2xl font-bold text-foreground">2030</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                الرئيسية
              </Button>
            </Link>
            <Link to="/visa-analysis">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                تحليل التأشيرات
              </Button>
            </Link>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              عن ابشر
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              المشاركة الإلكترونية
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              دليل الخدمات
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary flex items-center gap-2">
              منصات ابشر الأخرى
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary flex items-center gap-2">
              <Globe className="w-4 h-4" />
              English
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
          </nav>

          {/* Brand Logo on the left (RTL) */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-saudi-green">ابشر</div>
            </div>
            <div className="w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full text-saudi-green fill-current">
                <rect x="10" y="10" width="15" height="80" />
                <rect x="30" y="10" width="15" height="80" />
                <rect x="50" y="10" width="15" height="80" />
                <rect x="70" y="10" width="15" height="80" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
