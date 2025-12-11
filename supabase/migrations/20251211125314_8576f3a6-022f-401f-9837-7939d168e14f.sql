-- Create table for visa applicants
CREATE TABLE public.visa_applicants (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  gender TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  entry_date TEXT NOT NULL,
  exit_date TEXT NOT NULL,
  sponsor TEXT NOT NULL,
  profession TEXT NOT NULL,
  employer TEXT,
  work_experience_years INTEGER DEFAULT 0,
  monthly_salary DECIMAL(10,2),
  has_violations BOOLEAN DEFAULT FALSE,
  violations JSONB DEFAULT '[]'::jsonb,
  education_level TEXT,
  previous_visits INTEGER DEFAULT 0,
  risk_score INTEGER,
  risk_analysis TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.visa_applicants ENABLE ROW LEVEL SECURITY;

-- Allow public read access (since this is an admin system)
CREATE POLICY "Allow public read access" ON public.visa_applicants
  FOR SELECT USING (true);

-- Allow public insert/update for the system
CREATE POLICY "Allow public insert" ON public.visa_applicants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.visa_applicants
  FOR UPDATE USING (true);

-- Insert sample data
INSERT INTO public.visa_applicants (id, full_name, nationality, passport_number, birth_date, gender, visa_type, entry_date, exit_date, sponsor, profession, employer, work_experience_years, monthly_salary, has_violations, violations, education_level, previous_visits, status)
VALUES 
('VSA-2024-1234', 'محمد أحمد الفارسي', 'إيراني', 'IR789456123', '1985-03-15', 'ذكر', 'زيارة عمل', '2024-01-15', '2024-02-15', 'شركة النور للمقاولات', 'مهندس مدني', 'شركة البناء الدولية', 8, 12000, true, '[{"type": "تأخر في المغادرة", "date": "2022-05-10", "severity": "متوسطة"}, {"type": "مخالفة عمل", "date": "2021-08-15", "severity": "خطيرة"}]', 'بكالوريوس', 3, 'pending'),

('VSA-2024-1235', 'فاطمة حسن النجار', 'مصري', 'EG123789456', '1990-07-22', 'أنثى', 'زيارة عائلية', '2024-02-01', '2024-03-01', 'أحمد محمد النجار', 'طبيبة', 'مستشفى القاهرة الدولي', 5, 15000, false, '[]', 'دكتوراه', 1, 'pending'),

('VSA-2024-1236', 'راجيش كومار سينغ', 'هندي', 'IN456123789', '1988-11-08', 'ذكر', 'عمل', '2024-01-20', '2025-01-20', 'مؤسسة الخليج التقنية', 'مبرمج', 'شركة تقنية المعلومات', 6, 8000, true, '[{"type": "عمل لدى غير الكفيل", "date": "2020-03-20", "severity": "خطيرة"}]', 'ماجستير', 2, 'pending'),

('VSA-2024-1237', 'عائشة محمود البلوشي', 'باكستاني', 'PK321654987', '1995-02-14', 'أنثى', 'دراسة', '2024-03-01', '2025-03-01', 'جامعة الملك سعود', 'طالبة', NULL, 0, 2500, false, '[]', 'ثانوية', 0, 'pending'),

('VSA-2024-1238', 'خالد عبدالله المنصوري', 'يمني', 'YE654987321', '1980-09-30', 'ذكر', 'زيارة تجارية', '2024-02-10', '2024-03-10', 'شركة التجارة العربية', 'تاجر', 'مؤسسة المنصوري للتجارة', 15, 25000, true, '[{"type": "تهريب بضائع", "date": "2019-11-05", "severity": "خطيرة جداً"}, {"type": "تزوير مستندات", "date": "2018-06-12", "severity": "خطيرة جداً"}]', 'ثانوية', 5, 'pending');