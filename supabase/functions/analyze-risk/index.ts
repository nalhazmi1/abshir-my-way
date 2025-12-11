import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicant } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `أنت محلل مخاطر متخصص في تحليل طلبات التأشيرات. مهمتك هي تقييم درجة خطورة المتقدم بناءً على بياناته الشخصية والمهنية وسجل المخالفات.

قم بتحليل البيانات المقدمة وأعط:
1. درجة الخطورة (من 0 إلى 100)
2. تحليل مفصل للعوامل التي أثرت على التقييم
3. توصية بالقرار (منح الإذن / مراجعة إضافية / رفض)

العوامل المؤثرة في التقييم:
- سجل المخالفات السابقة (نوعها وخطورتها)
- نوع المهنة والدخل
- مستوى التعليم
- عدد الزيارات السابقة
- نوع التأشيرة المطلوبة
- وجود كفيل موثوق

أجب بصيغة JSON فقط بالشكل التالي:
{
  "risk_score": رقم,
  "risk_level": "منخفض" | "متوسط" | "مرتفع" | "مرتفع جداً",
  "analysis": "تحليل مفصل",
  "factors": ["عامل 1", "عامل 2", ...],
  "recommendation": "منح الإذن" | "مراجعة إضافية" | "رفض"
}`;

    const userPrompt = `قم بتحليل طلب التأشيرة التالي:

الاسم: ${applicant.full_name}
الجنسية: ${applicant.nationality}
الجنس: ${applicant.gender}
تاريخ الميلاد: ${applicant.birth_date}
المهنة: ${applicant.profession}
جهة العمل: ${applicant.employer || "غير محدد"}
سنوات الخبرة: ${applicant.work_experience_years}
الراتب الشهري: ${applicant.monthly_salary || "غير محدد"} ريال
المستوى التعليمي: ${applicant.education_level}
نوع التأشيرة: ${applicant.visa_type}
الكفيل: ${applicant.sponsor}
عدد الزيارات السابقة: ${applicant.previous_visits}
وجود مخالفات: ${applicant.has_violations ? "نعم" : "لا"}
${applicant.has_violations ? `سجل المخالفات: ${JSON.stringify(applicant.violations, null, 2)}` : ""}`;

    console.log("Sending request to AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إضافة رصيد لاستخدام خدمة الذكاء الاصطناعي" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI response:", content);

    // Parse the JSON response from AI
    let analysis;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback response
      analysis = {
        risk_score: 50,
        risk_level: "متوسط",
        analysis: content || "لم يتم التحليل بعد",
        factors: ["بيانات غير كافية"],
        recommendation: "مراجعة إضافية"
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-risk function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
