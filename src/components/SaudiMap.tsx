const SaudiMap = () => {
  return (
    <div className="relative w-full h-full bg-muted/30 rounded-lg p-8">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full"
        style={{ maxHeight: '600px' }}
      >
        {/* Saudi Arabia Map Outline */}
        <path
          d="M 150 100 L 250 80 L 350 90 L 450 100 L 550 120 L 600 150 L 650 200 L 680 280 L 700 350 L 690 420 L 650 480 L 580 520 L 500 540 L 400 550 L 300 540 L 200 520 L 150 480 L 120 420 L 100 350 L 110 280 L 130 200 L 150 100 Z"
          fill="#E8F5E9"
          stroke="#1A7F5B"
          strokeWidth="2"
        />

        {/* Regions */}
        <g className="regions">
          {/* الحدود الشمالية */}
          <text x="300" y="140" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            الحدود الشمالية
          </text>
          
          {/* الجوف */}
          <text x="180" y="180" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            الجوف
          </text>

          {/* تبوك */}
          <text x="140" y="250" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            تبوك
          </text>

          {/* حائل */}
          <text x="250" y="240" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            حائل
          </text>

          {/* القصيم */}
          <text x="310" y="290" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            القصيم
          </text>

          {/* المنطقة الشرقية */}
          <text x="550" y="320" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            المنطقة الشرقية
          </text>

          {/* الرياض */}
          <text x="410" y="360" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            الرياض
          </text>

          {/* المدينة المنورة */}
          <text x="220" y="330" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            المدينة المنورة
          </text>

          {/* مكة المكرمة */}
          <text x="240" y="410" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            مكة المكرمة
          </text>

          {/* الباحة */}
          <text x="260" y="480" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            الباحة
          </text>

          {/* عسير */}
          <text x="300" y="520" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            عسير
          </text>

          {/* جازان */}
          <text x="260" y="540" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            جازان
          </text>

          {/* نجران */}
          <text x="400" y="510" className="fill-saudi-green font-bold text-sm" textAnchor="middle">
            نجران
          </text>
        </g>

        {/* Interactive regions circles */}
        <circle cx="300" cy="140" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="180" cy="180" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="140" cy="250" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="250" cy="240" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="310" cy="290" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="550" cy="320" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="410" cy="360" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="220" cy="330" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="240" cy="410" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="260" cy="480" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="300" cy="520" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="260" cy="540" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
        <circle cx="400" cy="510" r="4" className="fill-saudi-green hover:r-6 cursor-pointer transition-all" />
      </svg>
    </div>
  );
};

export default SaudiMap;
