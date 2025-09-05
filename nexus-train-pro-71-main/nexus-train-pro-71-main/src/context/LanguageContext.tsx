import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "en" | "ar";

type Dictionary = Record<string, Record<Lang, string>>;

const dictionary: Dictionary = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.courses": { en: "Courses", ar: "الدورات" },
  "nav.trainers": { en: "Trainers", ar: "المدربون" },
  "nav.verify": { en: "Verify Certificate", ar: "تحقق من الشهادة" },
  "nav.verifyShort": { en: "Verify", ar: "تحقق" },
  "nav.about": { en: "About", ar: "من نحن" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا" },
  "nav.becomeTrainer": { en: "Become Trainer", ar: "كن مدرباً" },
  "nav.admin": { en: "Admin Panel", ar: "لوحة الإدارة" },
  "nav.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "nav.terms": { en: "Terms of Service", ar: "شروط الخدمة" },
  "nav.cookies": { en: "Cookie Policy", ar: "سياسة ملفات تعريف الارتباط" },

  // CTAs and Actions
  "cta.enroll": { en: "Enroll Now", ar: "سجل الآن" },
  "cta.explore": { en: "Explore All Courses", ar: "استكشف جميع الدورات" },
  "cta.whatsapp": { en: "WhatsApp", ar: "واتساب" },
  "cta.getFreeConsultation": { en: "Get Free Consultation", ar: "احصل على استشارة مجانية" },
  "cta.browseAllCourses": { en: "Browse All Courses", ar: "تصفح جميع الدورات" },
  "cta.scheduleCall": { en: "Schedule Call", ar: "احجز مكالمة" },
  "cta.enrollNow": { en: "Enroll Now", ar: "سجل الآن" },
  
  "actions.viewDetails": { en: "View Details", ar: "عرض التفاصيل" },
  "actions.viewDetailsEnroll": { en: "View Details & Enroll", ar: "عرض التفاصيل والتسجيل" },
  "actions.addWishlist": { en: "Add to Wishlist", ar: "أضف إلى المفضلة" },
  "actions.removeWishlist": { en: "Remove from Wishlist", ar: "إزالة من المفضلة" },
  "actions.wishlist": { en: "Wishlist", ar: "المفضلة" },
  "actions.share": { en: "Share", ar: "مشاركة" },
  "actions.backToCourses": { en: "Back to Courses", ar: "العودة إلى الدورات" },
  "actions.learnMore": { en: "Learn More", ar: "اعرف المزيد" },

  // Forms and Fields
  "form.name": { en: "Full Name", ar: "الاسم الكامل" },
  "form.email": { en: "Email", ar: "البريد الإلكتروني" },
  "form.phone": { en: "Phone", ar: "الهاتف" },
  "form.message": { en: "Message", ar: "الرسالة" },
  "form.company": { en: "Company", ar: "الشركة" },
  "form.submit": { en: "Submit", ar: "إرسال" },
  "form.cancel": { en: "Cancel", ar: "إلغاء" },
  "form.required": { en: "Required", ar: "مطلوب" },

  // Pages
  "page.courses": { en: "Our Courses", ar: "دوراتنا" },
  "page.trainers": { en: "Our Trainers", ar: "مدربونا" },
  "page.about": { en: "About Us", ar: "من نحن" },
  "page.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "page.wishlist": { en: "My Wishlist", ar: "مفضلتي" },
  "page.admin": { en: "Admin Panel", ar: "لوحة الإدارة" },

  // Course Details
  "course.instructor": { en: "Instructor", ar: "المدرب" },
  "course.duration": { en: "Duration", ar: "المدة" },
  "course.format": { en: "Format", ar: "النوع" },
  "course.schedule": { en: "Schedule", ar: "الجدول" },
  "course.language": { en: "Language", ar: "اللغة" },
  "course.price": { en: "Price", ar: "السعر" },
  "course.level": { en: "Level", ar: "المستوى" },
  "course.certificate": { en: "Certificate", ar: "الشهادة" },
  "course.included": { en: "What's Included", ar: "ما يشمله" },
  "course.notFound.title": { en: "Course Not Found", ar: "الدورة غير موجودة" },
  "course.notFound.desc": { en: "The course you are looking for does not exist or was removed.", ar: "الدورة التي تبحث عنها غير موجودة أو تم حذفها." },
  "course.back": { en: "Back", ar: "رجوع" },
  "course.category": { en: "Category", ar: "الفئة" },
  "course.students": { en: "Students", ar: "الطلاب" },
  "course.rating": { en: "Rating", ar: "التقييم" },
  "course.duration.label": { en: "Duration", ar: "المدة" },
  "course.format.label": { en: "Format", ar: "الشكل" },
  "course.schedule.label": { en: "Schedule", ar: "الجدول" },
  "course.instructor.label": { en: "Instructor", ar: "المدرب" },
  "course.plan.standard": { en: "Standard", ar: "قياسي" },
  "course.plan.premium": { en: "Premium", ar: "مميز" },
  "course.plan.perPerson": { en: "per person", ar: "للشخص" },
  "course.plan.customPricing": { en: "Custom Pricing", ar: "سعر مخصص" },
  "course.features.title": { en: "Key Features", ar: "الميزات الرئيسية" },
  "course.highlights.title": { en: "Highlights", ar: "أبرز النقاط" },
  "course.curriculum.title": { en: "Curriculum Preview", ar: "معاينة المنهج" },
  "course.curriculum.soon": { en: "Detailed curriculum coming soon.", ar: "سيتم إضافة المنهج التفصيلي قريباً." },
  "course.instructor.title": { en: "Instructor", ar: "المدرب" },
  "course.instructor.moreSoon": { en: "More instructor details coming soon.", ar: "المزيد من تفاصيل المدرب قريباً." },
  "course.reviews.title": { en: "Reviews", ar: "التقييمات" },
  "course.reviews.soon": { en: "Reviews section will be added later.", ar: "قسم التقييمات سيُضاف لاحقاً." },
  "course.quickActions": { en: "Quick Actions", ar: "إجراءات سريعة" },
  "course.whatsappSupport": { en: "WhatsApp Support", ar: "دعم واتساب" },
  "course.downloadBrochure": { en: "Download Brochure", ar: "تحميل الكتيب" },
  "course.related": { en: "Related Courses", ar: "دورات ذات صلة" },
  "course.chatCustomPlans": { en: "Chat for Custom Plans", ar: "تواصل لخطط مخصصة" },
  "course.share": { en: "Share", ar: "مشاركة" },
  "course.processing": { en: "Processing...", ar: "جاري المعالجة..." },
  "course.enrollNow": { en: "Enroll Now", ar: "سجل الآن" },
  "toast.brochure.title": { en: "Brochure coming soon", ar: "الكتيب قريباً" },
  "toast.brochure.desc": { en: "PDF generation not implemented yet.", ar: "لم يتم تنفيذ إنشاء ملف PDF بعد." },
  "toast.share.copied": { en: "Link copied", ar: "تم نسخ الرابط" },
  "toast.share.desc": { en: "Course URL copied to clipboard.", ar: "تم نسخ رابط الدورة إلى الحافظة." },

  // Admin Panel
  "admin.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "admin.payments": { en: "Payments", ar: "المدفوعات" },
  "admin.consultations": { en: "Consultations", ar: "الاستشارات" },
  "admin.students": { en: "Students", ar: "الطلاب" },
  "admin.trainers": { en: "Trainers", ar: "المدربون" },
  "admin.certificates": { en: "Certificates", ar: "الشهادات" },
  "admin.applications": { en: "Applications", ar: "الطلبات" },
  "admin.approve": { en: "Approve", ar: "موافقة" },
  "admin.reject": { en: "Reject", ar: "رفض" },
  "admin.pending": { en: "Pending", ar: "في الانتظار" },
  "admin.completed": { en: "Completed", ar: "مكتمل" },
  "admin.generate": { en: "Generate", ar: "إنشاء" },
  "admin.bulk": { en: "Bulk Actions", ar: "إجراءات مجمعة" },

  // Hero Section
  "hero.badge": { en: "International Training Excellence", ar: "التميز في التدريب الدولي" },
  "hero.title": { en: "Transform Your", ar: "حوّل" },
  "hero.titleAccent": { en: "Potential", ar: "إمكاناتك" },
  "hero.subtitle": { en: "With Expert Training", ar: "مع التدريب المتخصص" },
  "hero.description": { en: "Join thousands of professionals across UAE, Kerala, and worldwide in our transformative training programs. Expert mentorship for personal, professional, and relationship excellence.", ar: "انضم إلى آلاف المهنيين في دولة الإمارات وكيرالا وحول العالم في برامجنا التدريبية التحويلية. إرشاد خبير للتميز الشخصي والمهني والعلائقي." },
  "hero.joinPrpProgram": { en: "Join PRP Program - ₹7,000", ar: "انضم لبرنامج PRP - ₹7,000" },

  // Stats
  "stats.studentsTrained": { en: "Students Trained", ar: "طلاب مدربون" },
  "stats.certificatesIssued": { en: "Certificates Issued", ar: "شهادات صادرة" },
  "stats.countriesReached": { en: "Countries Reached", ar: "دول مغطاة" },
  "stats.averageRating": { en: "Average Rating", ar: "التقييم المتوسط" },
  "stats.happyStudents": { en: "Happy Students", ar: "طلاب راضون" },

  // Common
  "common.loading": { en: "Loading...", ar: "جاري التحميل..." },
  "common.processing": { en: "Processing...", ar: "جاري المعالجة..." },
  "common.search": { en: "Search...", ar: "البحث..." },
  "common.all": { en: "All", ar: "الكل" },
  "common.showing": { en: "Showing", ar: "عرض" },
  "common.courses": { en: "courses", ar: "دورات" },
  "common.perPerson": { en: "per person", ar: "للشخص الواحد" },
  "common.custom": { en: "Custom", ar: "مخصص" },
  "common.instructor": { en: "Instructor", ar: "المدرب" },
  "common.duration": { en: "Duration", ar: "المدة" },
  "common.format": { en: "Format", ar: "الشكل" },
  "common.schedule": { en: "Schedule", ar: "الجدول" },
  "common.language": { en: "Language", ar: "اللغة" },
  "common.featuredProgram": { en: "Featured Program", ar: "البرنامج المميز" },

  // PRP Program
  "prp.title": { en: "PRP Mentoring Program", ar: "برنامج الإرشاد PRP" },
  "prp.subtitle": { en: "Personal | Professional | Relationship", ar: "شخصي | مهني | علائقي" },
  "prp.description": { en: "Transform your Personal, Professional, and Relationship dimensions with Dr. Rashid Gazzali's comprehensive 10-week mentoring program.", ar: "حوّل أبعادك الشخصية والمهنية والعلائقية مع برنامج الإرشاد الشامل لمدة 10 أسابيع للدكتور رشيد غزالي." },
  "prp.programDetails": { en: "Program Details", ar: "تفاصيل البرنامج" },
  "prp.ledBy": { en: "Led by Dr. Rashid Gazzali, renowned international trainer with 15+ years of experience in personal growth and professional excellence.", ar: "بقيادة الدكتور رشيد غزالي، المدرب الدولي المشهور بخبرة تزيد عن 15 عاماً في النمو الشخصي والتميز المهني." },

  // Features
  "features.whyChoose": { en: "Why Choose Kaisan Associates?", ar: "لماذا تختار كايسان أسوشييتس؟" },
  "features.experienceDescription": { en: "Experience world-class training with our comprehensive approach to personal and professional development.", ar: "اختبر التدريب عالمي المستوى مع نهجنا الشامل للتطوير الشخصي والمهني." },

  // Testimonials
  "testimonials.title": { en: "What Our Students Say", ar: "ماذا يقول طلابنا" },
  "testimonials.subtitle": { en: "Real transformations from professionals worldwide", ar: "تحولات حقيقية من مهنيين حول العالم" },

  // Footer CTA
  "footerCta.title": { en: "Ready to Transform Your Future?", ar: "مستعد لتحويل مستقبلك؟" },
  "footerCta.description": { en: "Join thousands of professionals who have accelerated their growth with Kaisan Associates. Start your journey today.", ar: "انضم إلى آلاف المهنيين الذين سرّعوا نموهم مع كايسان أسوشييتس. ابدأ رحلتك اليوم." },
  "footerCta.freeConsultation": { en: "Free Consultation", ar: "استشارة مجانية" },
  "footerCta.certifiedPrograms": { en: "Certified Programs", ar: "برامج معتمدة" },
  "footerCta.globalAccess": { en: "Global Access", ar: "وصول عالمي" },

  // Cookie Consent
  "cookie.banner": { en: "We use essential cookies to operate this site & optional ones to improve it.", ar: "نستخدم ملفات أساسية لتشغيل الموقع وأخرى اختيارية لتحسينه." },
  "cookie.policy": { en: "policy", ar: "السياسة" },
  "cookie.acceptAll": { en: "Accept All", ar: "قبول الكل" },
  "cookie.essentialOnly": { en: "Essential Only", ar: "الأساسية فقط" },
  "cookie.preferences": { en: "Preferences", ar: "التفضيلات" },
  "cookie.save": { en: "Save", ar: "حفظ" },
  "cookie.preferencesTitle": { en: "Cookie Preferences", ar: "تفضيلات الكوكيز" },
  "cookie.preferencesDesc": { en: "Enable only what you are comfortable with.", ar: "فعّل ما يناسبك فقط." },
  "cookie.cat.essential": { en: "Essential", ar: "أساسية" },
  "cookie.cat.analytics": { en: "Analytics", ar: "تحليلات" },
  "cookie.cat.functionality": { en: "Functionality", ar: "الوظائف" },
  "cookie.cat.marketing": { en: "Marketing", ar: "تسويق" },
  "cookie.cat.required": { en: "Required for core features", ar: "مطلوبة للوظائف الأساسية" },
  "cookie.cat.analyticsDesc": { en: "Usage insights (anonymous)", ar: "رؤى الاستخدام (مجهولة)" },
  "cookie.cat.functionalityDesc": { en: "Remember preferences", ar: "تذكر التفضيلات" },
  "cookie.cat.marketingDesc": { en: "Personalized content", ar: "محتوى مخصص" },

  // Footer
  "footer.companyTagline": { en: "Training Excellence", ar: "التميز في التدريب" },
  "footer.companyDescription": { en: "Empowering individuals and organizations through transformative training programs across multiple domains. Excellence in personal, professional, and relationship development.", ar: "نُمكّن الأفراد والمنظمات من خلال برامج تدريبية تحويلية في مجالات متعددة. تميّز في التطور الشخصي والمهني والعَلائقي." },
  "footer.quickLinks": { en: "Quick Links", ar: "روابط سريعة" },
  "footer.popularCourses": { en: "Popular Courses", ar: "دورات شائعة" },
  "footer.contactUs": { en: "Contact Us", ar: "اتصل بنا" },
  "footer.chatWhatsapp": { en: "Chat on WhatsApp", ar: "الدردشة عبر واتساب" },
  "footer.newsletter.heading": { en: "Stay Updated with Our Latest Training Programs", ar: "ابقَ على اطلاع بآخر برامجنا التدريبية" },
  "footer.newsletter.text": { en: "Subscribe to receive updates about new courses, certification programs, and exclusive training opportunities.", ar: "اشترك لتصلك التحديثات حول الدورات الجديدة وبرامج الشهادات وفرص التدريب الحصرية." },
  "footer.newsletter.placeholder": { en: "Enter your email", ar: "أدخل بريدك الإلكتروني" },
  "footer.newsletter.subscribe": { en: "Subscribe", ar: "اشترك" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  "footer.tagline": { en: "Transforming lives through excellence in training and mentorship", ar: "نحوِّل الحياة من خلال التميز في التدريب والإرشاد" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.terms": { en: "Terms of Service", ar: "شروط الخدمة" },
  "footer.iso": { en: "ISO Certified Training", ar: "تدريب معتمد ISO" },

  // Courses Page and Details (Newly Added)
  "courses.hero.badge": { en: "Our Training Programs", ar: "برامجنا التدريبية" },
  "courses.hero.title1": { en: "Transform Your Potential", ar: "حوّل إمكاناتك" },
  "courses.hero.title2": { en: "Choose Your Path", ar: "اختر مسارك" },
  "courses.hero.desc": { en: "Discover world-class training programs designed to elevate your personal growth, professional skills, and relationship mastery.", ar: "اكتشف برامج تدريب عالمية مصممة لرفع نموك الشخصي ومهاراتك المهنية وإتقان علاقاتك." },
  "courses.search.placeholder": { en: "Search courses, instructors...", ar: "ابحث في الدورات، المدربين..." },
  "courses.filter.all": { en: "All", ar: "الكل" },
  "courses.showing": { en: "Showing", ar: "عرض" },
  "courses.course": { en: "course", ar: "دورة" },
  "courses.courses": { en: "courses", ar: "دورات" },
  "courses.instructor": { en: "Instructor", ar: "المدرب" },
  "courses.duration": { en: "Duration", ar: "المدة" },
  "courses.format": { en: "Format", ar: "الشكل" },
  "courses.schedule": { en: "Schedule", ar: "الجدول" },
  "courses.viewDetailsEnroll": { en: "View Details & Enroll", ar: "عرض التفاصيل والتسجيل" },
  "courses.why.title": { en: "Why Choose Our Courses?", ar: "لماذا تختار دوراتنا؟" },
  "courses.why.desc": { en: "Experience the difference with our comprehensive approach to learning and development", ar: "اختبر الفرق مع نهجنا الشامل للتعلم والتطوير" },
  "courses.feature.certified": { en: "Certified Programs", ar: "برامج معتمدة" },
  "courses.feature.certified.desc": { en: "Industry-recognized certificates with verification", ar: "شهادات معترف بها مع إمكانية التحقق" },
  "courses.feature.expert": { en: "Expert Instructors", ar: "مدربون خبراء" },
  "courses.feature.expert.desc": { en: "Learn from internationally acclaimed trainers", ar: "تعلم من مدربين دوليين معترف بهم" },
  "courses.feature.global": { en: "Global Access", ar: "وصول عالمي" },
  "courses.feature.global.desc": { en: "Access courses from anywhere in the world", ar: "الوصول إلى الدورات من أي مكان في العالم" },
  "courses.feature.support": { en: "Lifetime Support", ar: "دعم مدى الحياة" },
  "courses.feature.support.desc": { en: "Ongoing mentorship and community access", ar: "إرشاد مستمر ووصول للمجتمع" },
  "courses.perPerson": { en: "per person", ar: "للشخص" },

  // Index Page (Newly Added)
  "index.features.multiDomain.title": { en: "Multi-Domain Training", ar: "تدريب متعدد المجالات" },
  "index.features.multiDomain.desc": { en: "Comprehensive training across personal development, professional skills, and relationship management", ar: "تدريب شامل في التطوير الشخصي والمهارات المهنية وإدارة العلاقات" },
  "index.features.globalAccessibility.title": { en: "Global Accessibility", ar: "وصول عالمي" },
  "index.features.globalAccessibility.desc": { en: "Online and offline training programs accessible worldwide with multi-language support", ar: "برامج تدريب حضورية وعبر الإنترنت متاحة عالمياً مع دعم متعدد اللغات" },
  "index.features.verifiedCertificates.title": { en: "Verified Certificates", ar: "شهادات موثقة" },
  "index.features.verifiedCertificates.desc": { en: "Industry-recognized certificates with blockchain-based verification system", ar: "شهادات معترف بها مع نظام تحقق قائم على البلوك تشين" },
  "index.features.expertTrainers.title": { en: "Expert Trainers", ar: "مدربون خبراء" },
  "index.features.expertTrainers.desc": { en: "Learn from internationally acclaimed trainers with 15+ years of experience", ar: "تعلم من مدربين ذوي شهرة دولية بخبرة تتجاوز 15 عاماً" },
  "index.features.personalizedLearning.title": { en: "Personalized Learning", ar: "تعلم مخصص" },
  "index.features.personalizedLearning.desc": { en: "Customized training paths for individuals and corporate clients", ar: "مسارات تدريب مخصصة للأفراد والشركات" },
  "index.features.instantSupport.title": { en: "Instant Support", ar: "دعم فوري" },
  "index.features.instantSupport.desc": { en: "24/7 WhatsApp support and dedicated mentorship throughout your journey", ar: "دعم واتساب على مدار الساعة وإرشاد مخصص طوال رحلتك" },
  "index.highlights.item1": { en: "10-week comprehensive mentoring program", ar: "برنامج إرشاد شامل لمدة 10 أسابيع" },
  "index.highlights.item2": { en: "Live sessions every Friday 6:30-8:00 AM UAE", ar: "جلسات مباشرة كل جمعة 6:30-8:00 صباحاً بتوقيت الإمارات" },
  "index.highlights.item3": { en: "Personal, Professional & Relationship focus", ar: "تركيز على الجوانب الشخصية والمهنية والعلاقات" },
  "index.highlights.item4": { en: "Guided meditation sessions", ar: "جلسات تأمل موجهة" },
  "index.highlights.item5": { en: "WhatsApp community support", ar: "دعم مجتمع واتساب" },
  "index.highlights.item6": { en: "Certificate upon completion", ar: "شهادة عند الإكمال" },
  "index.cards.personalGrowth.title": { en: "Personal Growth", ar: "النمو الشخصي" },
  "index.cards.personalGrowth.desc": { en: "Cultivate self-awareness, resilience, and emotional intelligence through guided meditation and reflection.", ar: "نمِّ الوعي الذاتي والمرونة والذكاء العاطفي عبر التأمل والتأمل الموجه." },
  "index.cards.professionalEmpowerment.title": { en: "Professional Empowerment", ar: "تمكين مهني" },
  "index.cards.professionalEmpowerment.desc": { en: "Enhance leadership, communication, and productivity to excel in your career.", ar: "عزِّز القيادة والتواصل والإنتاجية للتفوق في مسيرتك المهنية." },
  "index.cards.relationshipEnrichment.title": { en: "Relationship Enrichment", ar: "إثراء العلاقات" },
  "index.cards.relationshipEnrichment.desc": { en: "Build deeper, healthier, and more meaningful connections in all areas of life.", ar: "ابنِ روابط أعمق وأكثر صحة ومعنى في جميع مجالات الحياة." },
  "index.contact.locations": { en: "UAE • Kerala • Worldwide", ar: "الإمارات • كيرالا • عالمي" },
  "index.testimonials.name1": { en: "Ahmed Al-Mahmoud", ar: "أحمد المحمود" },
  "index.testimonials.role1": { en: "Senior Manager, Dubai", ar: "مدير أول، دبي" },
  "index.testimonials.content1": { en: "The PRP Mentoring Program transformed my approach to leadership and personal growth. Dr. Rashid's guidance was invaluable.", ar: "حوّل برنامج PRP للإرشاد أسلوبي في القيادة والنمو الشخصي. كان توجيه الدكتور رشيد لا يقدر بثمن." },
  "index.testimonials.name2": { en: "Priya Nair", ar: "بريا ناير" },
  "index.testimonials.role2": { en: "HR Director, Kochi", ar: "مديرة الموارد البشرية، كوتشي" },
  "index.testimonials.content2": { en: "Kaisan Associates' corporate training helped our team achieve unprecedented collaboration and productivity.", ar: "ساعد التدريب المؤسسي لكايسان أسوشييتس فريقنا على تحقيق تعاون وإنتاجية غير مسبوقين." },
  "index.testimonials.name3": { en: "Sarah Johnson", ar: "سارة جونسون" },
  "index.testimonials.role3": { en: "Entrepreneur, London", ar: "رائدة أعمال، لندن" },
  "index.testimonials.content3": { en: "The international reach and quality of training exceeded my expectations. Highly recommend for professionals worldwide.", ar: "تجاوز الانتشار الدولي وجودة التدريب توقعاتي. أنصح به بشدة للمهنيين حول العالم." },

  // About Page (Newly Added)
  "about.hero.badge": { en: "About Kaisan Associates", ar: "عن كايسان أسوشييتس" },
  "about.hero.title1": { en: "Empowering Excellence", ar: "تمكين التميز" },
  "about.hero.title2": { en: "Since 2008", ar: "منذ 2008" },
  "about.hero.desc": { en: "Transforming lives through world-class training programs across personal development, professional excellence, and relationship mastery.", ar: "نحوّل الحياة من خلال برامج تدريب عالمية في التطور الشخصي والتميز المهني وإتقان العلاقات." },
  "about.mission.title": { en: "Our Mission", ar: "مهمتنا" },
  "about.mission.text": { en: "To empower individuals and organizations worldwide through transformative training programs that foster personal growth, professional excellence, and meaningful relationships.", ar: "تمكين الأفراد والمنظمات حول العالم عبر برامج تدريب تحويلية تعزز النمو الشخصي والتميز المهني والعلاقات ذات المعنى." },
  "about.vision.title": { en: "Our Vision", ar: "رؤيتنا" },
  "about.vision.text": { en: "To be the leading global platform for holistic development training, recognized for our innovative approaches, expert faculty, and transformative impact.", ar: "أن نكون المنصة العالمية الرائدة في التدريب التنموي الشامل، المعروفة بأساليبنا المبتكرة وهيئتنا الخبيرة وتأثيرنا التحويلي." },
  "about.values.title": { en: "Our Core Values", ar: "قيمنا الأساسية" },
  "about.values.desc": { en: "The principles that guide everything we do at Kaisan Associates", ar: "المبادئ التي توجه كل ما نقوم به في كايسان أسوشييتس" },
  "about.value.excellence.title": { en: "Excellence", ar: "التميّز" },
  "about.value.excellence.desc": { en: "We strive for excellence in every training program and mentorship session", ar: "نسعى للتميّز في كل برنامج تدريبي وجلسة إرشاد" },
  "about.value.empathy.title": { en: "Empathy", ar: "التعاطف" },
  "about.value.empathy.desc": { en: "Understanding and connecting with each learner's unique journey", ar: "فهم والتواصل مع رحلة كل متعلم الفريدة" },
  "about.value.globalReach.title": { en: "Global Reach", ar: "الانتشار العالمي" },
  "about.value.globalReach.desc": { en: "Bringing world-class training to learners across continents", ar: "تقديم تدريب عالمي المستوى للمتعلمين عبر القارات" },
  "about.value.growth.title": { en: "Growth", ar: "النمو" },
  "about.value.growth.desc": { en: "Committed to continuous improvement and innovation in training", ar: "ملتزمون بالتحسين المستمر والابتكار في التدريب" },
  "about.story.title": { en: "Our Story", ar: "قصتنا" },
  "about.story.p1": { en: "Founded in 2008, Kaisan Associates began as a vision to bridge the gap between traditional education and real-world application.", ar: "تأسست كايسان أسوشييتس في عام 2008 كرؤية لسد الفجوة بين التعليم التقليدي والتطبيق العملي." },
  "about.story.p2": { en: "Our founder brought together a unique approach combining personal development, professional skills, and relationship mastery.", ar: "جمع مؤسسنا نهجاً فريداً يجمع بين التطور الشخصي والمهارات المهنية وإتقان العلاقات." },
  "about.story.p3": { en: "Today, we serve thousands globally while maintaining our commitment to personalized, transformative learning experiences.", ar: "اليوم نخدم الآلاف حول العالم مع الحفاظ على التزامنا بالتعلم التحويلي المخصص." },
  "about.achievements.title": { en: "Key Achievements", ar: "إنجازات رئيسية" },
  "about.achievement.1": { en: "15+ Years of Training Excellence", ar: "أكثر من 15 سنة من التميز التدريبي" },
  "about.achievement.2": { en: "10,000+ Professionals Trained", ar: "تدريب أكثر من 10,000 مهني" },
  "about.achievement.3": { en: "25+ Countries Reached", ar: "أكثر من 25 دولة" },
  "about.achievement.4": { en: "ISO Certified Training Programs", ar: "برامج تدريب معتمدة ISO" },
  "about.achievement.5": { en: "96% Student Satisfaction Rate", ar: "معدل رضا 96%" },
  "about.achievement.6": { en: "Expert Faculty from Multiple Domains", ar: "هيئة خبراء من مجالات متعددة" },
  "about.global.title": { en: "Global Presence", ar: "الحضور العالمي" },
  "about.global.desc": { en: "Serving learners across multiple continents with localized expertise", ar: "نخدم المتعلمين عبر قارات متعددة بخبرة محلية" },
  "about.global.uae": { en: "UAE Headquarters", ar: "المقر الرئيسي بالإمارات" },
  "about.global.uae.desc": { en: "Dubai Business Bay serves as our primary hub for Middle East operations", ar: "يعد الخليج التجاري في دبي مركزنا الرئيسي لعمليات الشرق الأوسط" },
  "about.global.kerala": { en: "Kerala Operations", ar: "عمليات كيرالا" },
  "about.global.kerala.desc": { en: "Deep roots in Kerala, India, serving the South Asian market", ar: "جذور عميقة في كيرالا بالهند لخدمة سوق جنوب آسيا" },
  "about.global.online": { en: "Global Online", ar: "عبر الإنترنت عالمياً" },
  "about.global.online.desc": { en: "Reaching learners worldwide through our digital training platform", ar: "نصل للمتعلمين عالمياً عبر منصتنا الرقمية" },
  "about.cta.title": { en: "Ready to Start Your Journey?", ar: "جاهز لبدء رحلتك؟" },
  "about.cta.desc": { en: "Join thousands of professionals who have transformed their lives with Kaisan Associates", ar: "انضم إلى آلاف المهنيين الذين غيّروا حياتهم مع كايسان أسوشييتس" },
  "about.cta.explore": { en: "Explore Courses", ar: "استكشف الدورات" },
  "about.cta.contact": { en: "Get in Touch", ar: "تواصل معنا" },
};

interface LanguageContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dictionary) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("kaisan_lang") as Lang) || "en");

  useEffect(() => {
    localStorage.setItem("kaisan_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.body.style.fontFamily = lang === "ar" ? "'Noto Sans Arabic', 'Cairo', sans-serif" : "'Inter', 'Playfair Display', sans-serif";
  }, [lang]);

  const t = (key: keyof typeof dictionary) => {
    const entry = dictionary[key];
    return entry ? entry[lang] : String(key);
  };

  const value: LanguageContextValue = useMemo(
    () => ({ lang, dir: (lang === "ar" ? "rtl" : "ltr"), setLang, t }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
