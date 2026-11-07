const fs = require("fs");
const path = require("path");

const file = path.join("content", "runtime.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

data.content.ar.footer.admin = "دخول الإدارة";
data.content.en.footer.admin = "Admin login";

data.content.ar.hidden = {
  work: {
    label: "أعمالنا",
    title: "أعمال نروي بها الأثر",
    text: "مختارات من مشاريعنا في الهوية والمحتوى والإنتاج والحملات.",
  },
  clients: {
    label: "عملاؤنا",
    title: "شركاء يثقون بنا",
    text: "علامات تجارية رافقناها من الفكرة الأولى إلى التنفيذ.",
  },
  team: {
    label: "فريقنا",
    title: "أشخاص يصنعون الفرق",
    text: "فريق متكامل من الاستراتيجية والتصميم إلى الإنتاج.",
  },
  journal: {
    label: "المدونة",
    title: "أفكار من غرفة الإنتاج",
    text: "ملاحظات ورؤى عن التسويق والمحتوى والإعلام.",
  },
};

data.content.en.hidden = {
  work: {
    label: "Our work",
    title: "Selected work",
    text: "A selection of projects across branding, content, production and campaigns.",
  },
  clients: {
    label: "Clients",
    title: "Trusted by brands",
    text: "Brands we have supported from the first idea to delivery.",
  },
  team: {
    label: "Team",
    title: "The people behind the work",
    text: "A full team spanning strategy, design and production.",
  },
  journal: {
    label: "Journal",
    title: "Notes from the studio",
    text: "Perspectives on marketing, content and media.",
  },
};

data.hidden = {
  work: [
    {
      id: "seed-work-1",
      titleAr: "لوحة أداء تسويقي",
      titleEn: "Marketing performance dashboard",
      categoryAr: "التسويق الرقمي",
      categoryEn: "Digital marketing",
      descriptionAr:
        "لوحة تجمع مؤشرات الحملات في مكان واحد لاتخاذ قرارات أسرع وأدق.",
      descriptionEn:
        "A dashboard that brings campaign indicators together for faster, sharper decisions.",
      image: "/images/photos/work-1.webp",
      href: "",
      year: "2026",
    },
    {
      id: "seed-work-2",
      titleAr: "حملة إطلاق منتج جديد",
      titleEn: "Product launch campaign",
      categoryAr: "الحملات الإعلانية",
      categoryEn: "Advertising campaigns",
      descriptionAr:
        "فكرة إعلانية واحدة امتدت عبر الوسائط الرقمية والخارجية لصناعة لحظة إطلاق مميزة.",
      descriptionEn:
        "One campaign idea carried across digital and outdoor media to create a memorable launch moment.",
      image: "/images/photos/work-2.webp",
      href: "",
      year: "2026",
    },
    {
      id: "seed-work-3",
      titleAr: "فيلم تعريفي لشركة",
      titleEn: "Corporate brand film",
      categoryAr: "الإنتاج الإعلامي",
      categoryEn: "Media production",
      descriptionAr:
        "من كتابة المعالجة إلى المونتاج والتلوين، فيلم يقدّم الشركة بصوتها الحقيقي.",
      descriptionEn:
        "From treatment to edit and colour, a film that presents the company in its own voice.",
      image: "/images/photos/work-3.webp",
      href: "",
      year: "2025",
    },
    {
      id: "seed-work-4",
      titleAr: "تحسين أداء المحتوى",
      titleEn: "Content performance program",
      categoryAr: "المحتوى الرقمي",
      categoryEn: "Digital content",
      descriptionAr:
        "قراءة أرقام المحتوى وتحويلها إلى خطة تحسين شهرية واضحة.",
      descriptionEn:
        "Reading content numbers and turning them into a clear monthly improvement plan.",
      image: "/images/photos/work-4.webp",
      href: "",
      year: "2025",
    },
    {
      id: "seed-work-5",
      titleAr: "تغطية فعالية موسمية",
      titleEn: "Seasonal event coverage",
      categoryAr: "الإنتاج الإعلامي",
      categoryEn: "Media production",
      descriptionAr:
        "تغطية بصرية كاملة لفعالية جماهيرية من التخطيط إلى المونتاج.",
      descriptionEn:
        "Full visual coverage of a live event, from planning to final edit.",
      image: "/images/photos/work-5.webp",
      href: "",
      year: "2025",
    },
    {
      id: "seed-work-6",
      titleAr: "كواليس إنتاج إعلاني",
      titleEn: "Behind the scenes of a campaign",
      categoryAr: "الإنتاج الإعلامي",
      categoryEn: "Media production",
      descriptionAr:
        "يوم تصوير كامل يوثّق صناعة الإعلان من أول لقطة إلى آخرها.",
      descriptionEn:
        "A full shoot day documenting how an ad is made, from first take to last.",
      image: "/images/photos/work-6.webp",
      href: "",
      year: "2024",
    },
  ],
  clients: [
    { id: "seed-client-1", name: "بيت الريف", logo: "", url: "" },
    { id: "seed-client-2", name: "نُخبة", logo: "", url: "" },
    { id: "seed-client-3", name: "مسار", logo: "", url: "" },
    { id: "seed-client-4", name: "أفق", logo: "", url: "" },
    { id: "seed-client-5", name: "رواق", logo: "", url: "" },
    { id: "seed-client-6", name: "سِمة", logo: "", url: "" },
    { id: "seed-client-7", name: "واحة", logo: "", url: "" },
    { id: "seed-client-8", name: "مدار", logo: "", url: "" },
  ],
  team: [
    {
      id: "seed-team-1",
      nameAr: "سارة العتيبي",
      nameEn: "Sara Alotaibi",
      roleAr: "مديرة الاستراتيجية",
      roleEn: "Strategy Director",
      bioAr: "تبني خطط العلامات وتربط الفكرة بالجمهور والنتيجة.",
      bioEn: "Builds brand plans and connects the idea to audience and outcome.",
      image: "/images/photos/team-1.webp",
    },
    {
      id: "seed-team-2",
      nameAr: "خالد الحربي",
      nameEn: "Khalid Alharbi",
      roleAr: "المدير الإبداعي",
      roleEn: "Creative Director",
      bioAr: "يشرف على اللغة البصرية والفكرة الإبداعية في كل مشروع.",
      bioEn: "Leads the visual language and creative idea across every project.",
      image: "/images/photos/team-2.webp",
    },
    {
      id: "seed-team-3",
      nameAr: "ليان القحطاني",
      nameEn: "Layan Alqahtani",
      roleAr: "مديرة الإنتاج",
      roleEn: "Production Manager",
      bioAr: "تحوّل الخطط إلى أيام تصوير منظمة ونتائج في موعدها.",
      bioEn: "Turns plans into organised shoot days and on-time delivery.",
      image: "/images/photos/team-3.webp",
    },
    {
      id: "seed-team-4",
      nameAr: "عمر الشهري",
      nameEn: "Omar Alshehri",
      roleAr: "أخصائي تسويق رقمي",
      roleEn: "Digital Marketing Specialist",
      bioAr: "يدير الحملات الرقمية ويقرأ الأرقام لتحسين الأداء.",
      bioEn: "Runs digital campaigns and reads the numbers to improve performance.",
      image: "/images/photos/team-4.webp",
    },
  ],
  journal: [
    {
      id: "seed-journal-1",
      titleAr: "كيف تبني حملة تبدأ من فكرة واضحة؟",
      titleEn: "How to build a campaign that starts with a clear idea",
      excerptAr:
        "الفكرة الجيدة ليست شعارًا لامعًا، بل جملة واحدة يفهمها الجمهور وتصلح لكل قناة.",
      excerptEn:
        "A good idea is not a shiny slogan, but one sentence the audience understands and that works across every channel.",
      bodyAr: "",
      bodyEn: "",
      image: "/images/photos/journal-1.webp",
      date: "2026-09-12",
      href: "",
    },
    {
      id: "seed-journal-2",
      titleAr: "المحتوى الذي يبقى: من الترند إلى الأثر",
      titleEn: "Content that lasts: from trend to impact",
      excerptAr:
        "كيف تحوّل المحتوى السريع إلى أصل تراكمي يخدم العلامة على المدى الطويل.",
      excerptEn:
        "How to turn fast content into a cumulative asset that serves the brand over time.",
      bodyAr: "",
      bodyEn: "",
      image: "/images/photos/journal-2.webp",
      date: "2026-08-24",
      href: "",
    },
    {
      id: "seed-journal-3",
      titleAr: "خمس خطوات لاختيار هوية بصرية تعيش طويلًا",
      titleEn: "Five steps to a visual identity that lasts",
      excerptAr:
        "الهوية الناجحة ليست ما يعجبك اليوم، بل ما يظل صالحًا بعد عشر سنوات.",
      excerptEn:
        "A successful identity is not what you like today, but what still works ten years from now.",
      bodyAr: "",
      bodyEn: "",
      image: "/images/photos/journal-3.webp",
      date: "2026-07-30",
      href: "",
    },
    {
      id: "seed-journal-4",
      titleAr: "ما الذي يجعل الفيلم التعريفي فعّالًا؟",
      titleEn: "What makes a brand film effective?",
      excerptAr:
        "من أول ثانية إلى آخر لقطة: عناصر تصنع فيلمًا يشرح الشركة دون أن يبدو إعلانًا.",
      excerptEn:
        "From the first second to the last shot: the elements that make a film explain a company without feeling like an ad.",
      bodyAr: "",
      bodyEn: "",
      image: "/images/photos/journal-4.webp",
      date: "2026-06-18",
      href: "",
    },
  ],
};

fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("seeded runtime:", Object.fromEntries(Object.entries(data.hidden).map(([k, v]) => [k, v.length])));
