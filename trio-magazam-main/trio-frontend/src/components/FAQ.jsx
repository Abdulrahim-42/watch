import { useState } from "react";
// Lucide ikonlarının importu
import { ChevronDown, Search, HelpCircle, Phone, Mail, MessageCircle, Star } from "lucide-react";

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Əsas FAQ siyahısı üçün state
  const [openItem, setOpenItem] = useState(null); 
  
  // Populyar suallar (ikinci hissə) üçün YENİ state
  const [openPopularItem, setOpenPopularItem] = useState(null); 

  // Əsas FAQ listini idarə edir
  const toggleItem = (id) => {
    setOpenItem(prev => prev === id ? null : id); 
    setOpenPopularItem(null); // Müstəqillik üçün
  };

  // Populyar FAQ-u idarə edən funksiya
  const togglePopularItem = (id) => {
    setOpenPopularItem(prev => prev === id ? null : id);
    setOpenItem(null); // Müstəqillik üçün
  };

  const categories = [
    { id: "all", name: "Hamısı", count: 12 },
    { id: "shipping", name: "Çatdırılma", count: 4 },
    { id: "payment", name: "Ödəniş", count: 3 },
    { id: "returns", name: "Qaytarma", count: 3 },
    { id: "account", name: "Hesab", count: 2 },
  ];

  const faqData = [
    {
      id: 1,
      question: "Sifarişlərimi necə izləyə bilərəm?",
      answer: "Sifarişlərinizi izləmək üçün hesabınıza daxil olun və 'Sifarişlərim' bölməsinə keçin. Hər sifarişin yanında izləmə nömrəsi və kuryer şirkətinin məlumatları olacaq. Həmçinin, sifariş statusunuzu e-poçt və SMS vasitəsilə də izləyə bilərsiniz.",
      category: "shipping",
      popular: true
    },
    {
      id: 2,
      question: "Çatdırılma müddəti nə qədərdir?",
      answer: "Bakı daxilində sifarişlər 1-2 iş günü ərzində çatdırılır. Regionlar üçün bu müddət 3-5 iş günü arasında dəyişir. Sürətli çatdırılma xidməti ilə Bakı daxilində eyni gün çatdırılma mümkündür.",
      category: "shipping",
      popular: true
    },
    {
      id: 3,
      question: "Ödəniş üsulları hansılardır?",
      answer: "Nağd çatdırılmada ödəniş, kartla ödəniş (onlayn və çatdırılmada), bank köçürməsi və hissə-hissə ödəniş (3, 6, 9, 12 ay) kimi müxtəlif ödəniş üsulları mövcuddur. Bütün kart ödənişləri SSL şifrələməsi ilə qorunur.",
      category: "payment",
      popular: true
    },
    {
      id: 4,
      question: "Məhsulu necə qaytara bilərəm?",
      answer: "Məhsulu 14 gün ərzində heç bir səbəb göstərmədən qaytara bilərsiniz. Məhsul orijinal qablaşdırmasında və istifadə edilməmiş halda olmalıdır. Qaytarma prosesi üçün bizimlə əlaqə saxlayın və ya onlayn qaytarma formunu doldurun.",
      category: "returns"
    },
    {
      id: 5,
      question: "Zəmanət müddəti nə qədərdir?",
      answer: "Bütün məhsullarımız rəsmi zəmanət altındadır. Zəmanət müddəti məhsul növündən asılı olaraq 1 ildən 3 ilə qədər dəyişir. Zəmanət şərtləri məhsul səhifəsində və qablaşdırmada göstərilir.",
      category: "returns"
    },
    {
      id: 6,
      question: "Hesabımı necə yarada bilərəm?",
      answer: "Saytın yuxarı sağ küncündəki 'Qeydiyyat' düyməsini klikləyin, e-poçt ünvanınızı və şifrənizi daxil edin. Təsdiq linki e-poçtunuza göndəriləcək. Linki kliklədikdən sonra hesabınız aktiv olacaq.",
      category: "account"
    },
    {
      id: 7,
      question: "Pulsuz çatdırılma şərtləri nələrdir?",
      answer: "100 AZN və yuxarı dəyəri olan bütün sifarişlər üçün pulsuz çatdırılma xidməti mövcuddur. Bu xidmət Bakı daxili və seçilmiş regionlar üçün etibarlıdır. Xüsusi təkliflər zamanı minimum məbləğ dəyişə bilər.",
      category: "shipping"
    },
    {
      id: 8,
      question: "Kart məlumatlarım təhlükəsizdirmi?",
      answer: "Bəli, bütün ödəniş əməliyyatları 128-bit SSL şifrələməsi ilə qorunur. Kart məlumatlarınız serverlərimizdə saxlanmır. Ödənişlər bank tərəfindən təsdiq edilmiş təhlükəsiz ödəniş şlüzü vasitəsilə həyata keçirilir.",
      category: "payment",
      popular: true
    },
    {
      id: 9,
      question: "Məhsul stokda olmadıqda nə etməliyəm?",
      answer: "Stokda olmayan məhsullar üçün 'Məhsul gəldikdə xəbərdar et' seçimindən istifadə edə bilərsiniz. Məhsul stoka gəldikdə sizə e-poçt və ya SMS vasitəsilə məlumat veriləcək. Bu xidmət tamamilə pulsuzdur.",
      category: "account"
    },
    {
      id: 10,
      question: "Endirim kodlarını necə istifadə edə bilərəm?",
      answer: "Endirim kodlarınızı səbət səhifəsində 'Endirim kodu' bölməsində daxil edə bilərsiniz. Kod etibarlı olduqda, ümumi məbləğ avtomatik olaraq yenilənəcək. Hər bir endirim kodu üçün xüsusi şərtlər ola bilər.",
      category: "payment"
    },
    {
      id: 11,
      question: "Qüsurlu məhsul aldıqda nə etməliyəm?",
      answer: "Qüsurlu məhsul aldığınız təqdirdə, 48 saat ərzində müştəri xidmətləri ilə əlaqə saxlayın. Məhsulu fotoşəkilləri ilə birliktdə qaytara bilərsiniz. Zəmanət çərçivəsində məhsulu dəyişdirə və ya pulunuzu geri ala bilərsiniz.",
      category: "returns"
    },
    {
      id: 12,
      question: "Beynəlxalq çatdırılma xidmətiniz varmı?",
      answer: "Hələlik beynəlxalq çatdırılma xidməti təqdim etmirik. Xidmətimiz yalnız Azərbaycan daxilində mövcuddur. Beynəlxalq çatdırılma xidmətləri ilə bağlı gələcək planlarımızı sosial media hesablarımızdan izləyə bilərsiniz.",
      category: "shipping"
    }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFaqs = faqData.filter(faq => faq.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#5C4977] rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tez-tez verilən suallar</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sizin üçün ən vacib suallara cavablar. Tapmadığınız sualınız varsa, bizimlə əlaqə saxlayın.
          </p>
        </div>

        {/* Search Bar */}
       <div className="max-w-2xl mx-auto mb-12">
  <div className="relative">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5c4977] w-5 h-5" />
    <input
      type="text"
      placeholder="Suallarında axtar..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-4 py-3 pl-12 bg-white rounded-full text-base text-[#5c4977] placeholder-[#5c4977]/50 focus:outline-none focus:ring-2 focus:ring-[#5c4977] focus:bg-white transition-colors border border-[#5c4977]/30 shadow-sm"
    />
  </div>

  {searchTerm && filteredFaqs.length === 0 && (
    <p className="text-center text-red-500 mt-3">
      Axtarış nəticəsi tapılmadı. Zəhmət olmasa başqa sözlə axtarın.
    </p>
  )}
</div>


        {/* Popular Questions (ƏSAS FİKS HİSSƏSİ) */}
        {activeCategory === "all" && searchTerm === "" && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Populyar Suallar</h2>
            </div>
            
            {/* DƏYİŞİKLİK: Grid yerinə columns-2 (iki sütunlu sənəd tərzi) istifadə olunur */}
            <div className="md:columns-2 gap-6">
              {popularFaqs.map((faq) => (
                <div
                  key={faq.id}
                  // break-inside-avoid sinfi kartın sütun sərhədini keçməsinin qarşısını alır
                  className="mb-6 break-inside-avoid" 
                >
                    <div 
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                        onClick={() => togglePopularItem(faq.id)}
                    >
                        {/* Sual başlığı və ikonu (hündürlüyü dəyişməyən hissə) */}
                        <div className="flex items-start justify-between flex-shrink-0">
                            <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                            {/* openPopularItem state istifadə olunur */}
                            <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openPopularItem === faq.id ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Cavab məzmunu (Max-height ilə açılıb-bağlanır) */}
                        <div className={`overflow-hidden transition-all duration-300 ${openPopularItem === faq.id ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
                            <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content (Əsas siyahı grid olaraq qalır, çünki yanaşı kart yoxdur) */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 top-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Kateqoriyalar</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenItem(null); 
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-[#5C4977] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      activeCategory === category.id
                        ? 'bg-white text-[#5C4977]'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-[#5C4977] to-[#6D5B8E] rounded-2xl p-6 text-white mt-6 shadow-lg">
              <h3 className="font-bold text-lg mb-3">Kömək lazımdır?</h3>
              <p className="text-white/80 text-sm mb-4">Sualınızı tapmadınız? Bizimlə birbaşa əlaqə saxlayın.</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+994 12 345 67 89</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">destek@magazam.az</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">Onlayn söhbət</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-white text-[#5C4977] py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Əlaqə Saxlayın
              </button>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Heç bir nəticə tapılmadı</h3>
                  <p className="text-gray-600">Axtarış şərtlərinizə uyğun sual tapılmadı.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleItem(faq.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                            {faq.popular && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                Populyar
                              </span>
                            )}
                          </div>
                          {/* Açılıb-bağlanma məntiqi eynidir */}
                          {openItem === faq.id && (
                            <p className="text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                          )}
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform ${
                            openItem === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Still Have Questions */}
            <div className="bg-gradient-to-r from-[#5C4977] to-[#6D5B8E] rounded-2xl p-8 text-white mt-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Hələ də sualınız var?</h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Mütəxəssislərimiz sizə kömək etmək üçün həmişə hazırdır. Bizimlə əlaqə saxlayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#5C4977] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Onlayn Söhbə
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#5C4977] transition-colors">
                  Zəng Edin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;