const fs = require('fs');
const path = require('path');

// Define the missing keys that need to be added to all language files
const missingKeys = {
  // Roadmap keys
  roadmap: {
    "yourRoadmapProgress": {
      "en": "Your Roadmap Progress",
      "ja": "あなたのロードマップ進捗",
      "ko": "당신의 로드맵 진행률",
      "zh": "您的路线图进度",
      "es": "Tu Progreso de Hoja de Ruta",
      "fr": "Votre Progrès de Feuille de Route",
      "de": "Ihr Roadmap-Fortschritt",
      "it": "Il Tuo Progresso della Mappa",
      "pt": "Seu Progresso da Rota",
      "ru": "Ваш Прогресс Дорожной Карты",
      "ar": "تقدم خريطتك"
    },
    "active": {
      "en": "Active",
      "ja": "アクティブ",
      "ko": "활성",
      "zh": "活跃",
      "es": "Activo",
      "fr": "Actif",
      "de": "Aktiv",
      "it": "Attivo",
      "pt": "Ativo",
      "ru": "Активный",
      "ar": "نشط"
    },
    "set": {
      "en": "Set",
      "ja": "設定",
      "ko": "설정",
      "zh": "设置",
      "es": "Establecer",
      "fr": "Définir",
      "de": "Festlegen",
      "it": "Imposta",
      "pt": "Definir",
      "ru": "Установить",
      "ar": "تعيين"
    },
    "targetSet": {
      "en": "Target Set",
      "ja": "目標設定済み",
      "ko": "목표 설정됨",
      "zh": "目标已设定",
      "es": "Objetivo Establecido",
      "fr": "Cible Définie",
      "de": "Ziel Gesetzt",
      "it": "Obiettivo Impostato",
      "pt": "Meta Definida",
      "ru": "Цель Установлена",
      "ar": "تم تعيين الهدف"
    }
  },
  
  // Assessment keys
  assessment: {
    "step1of4": {
      "en": "Step 1 of 4",
      "ja": "ステップ 1/4",
      "ko": "4단계 중 1단계",
      "zh": "第1步，共4步",
      "es": "Paso 1 de 4",
      "fr": "Étape 1 sur 4",
      "de": "Schritt 1 von 4",
      "it": "Passo 1 di 4",
      "pt": "Passo 1 de 4",
      "ru": "Шаг 1 из 4",
      "ar": "الخطوة 1 من 4"
    },
    "complete": {
      "en": "Complete",
      "ja": "完了",
      "ko": "완료",
      "zh": "完成",
      "es": "Completo",
      "fr": "Terminé",
      "de": "Abgeschlossen",
      "it": "Completo",
      "pt": "Completo",
      "ru": "Завершено",
      "ar": "مكتمل"
    },
    "skillsSelected": {
      "en": "Skills selected:",
      "ja": "選択されたスキル:",
      "ko": "선택된 기술:",
      "zh": "已选技能：",
      "es": "Habilidades seleccionadas:",
      "fr": "Compétences sélectionnées :",
      "de": "Ausgewählte Fähigkeiten:",
      "it": "Competenze selezionate:",
      "pt": "Habilidades selecionadas:",
      "ru": "Выбранные навыки:",
      "ar": "المهارات المحددة:"
    },
    "whatSkillsDoYouHave": {
      "en": "What skills do you currently have?",
      "ja": "現在どのようなスキルをお持ちですか？",
      "ko": "현재 어떤 기술을 보유하고 계신가요?",
      "zh": "您目前拥有哪些技能？",
      "es": "¿Qué habilidades tienes actualmente?",
      "fr": "Quelles compétences avez-vous actuellement ?",
      "de": "Welche Fähigkeiten haben Sie derzeit?",
      "it": "Quali competenze hai attualmente?",
      "pt": "Quais habilidades você tem atualmente?",
      "ru": "Какими навыками вы обладаете в настоящее время?",
      "ar": "ما هي المهارات التي تمتلكها حالياً؟"
    },
    "selectSkillsProficient": {
      "en": "Select the skills you're proficient in. You can add custom skills too",
      "ja": "得意なスキルを選択してください。カスタムスキルも追加できます",
      "ko": "숙련된 기술을 선택하세요. 사용자 정의 기술도 추가할 수 있습니다",
      "zh": "选择您精通的技能。您也可以添加自定义技能",
      "es": "Selecciona las habilidades en las que eres competente. También puedes agregar habilidades personalizadas",
      "fr": "Sélectionnez les compétences dans lesquelles vous êtes compétent. Vous pouvez également ajouter des compétences personnalisées",
      "de": "Wählen Sie die Fähigkeiten aus, in denen Sie kompetent sind. Sie können auch benutzerdefinierte Fähigkeiten hinzufügen",
      "it": "Seleziona le competenze in cui sei esperto. Puoi anche aggiungere competenze personalizzate",
      "pt": "Selecione as habilidades em que você é competente. Você também pode adicionar habilidades personalizadas",
      "ru": "Выберите навыки, в которых вы компетентны. Вы также можете добавить пользовательские навыки",
      "ar": "اختر المهارات التي تجيدها. يمكنك أيضاً إضافة مهارات مخصصة"
    },
    "technicalSkills": {
      "en": "Technical skills",
      "ja": "技術スキル",
      "ko": "기술적 기술",
      "zh": "技术技能",
      "es": "Habilidades técnicas",
      "fr": "Compétences techniques",
      "de": "Technische Fähigkeiten",
      "it": "Competenze tecniche",
      "pt": "Habilidades técnicas",
      "ru": "Технические навыки",
      "ar": "المهارات التقنية"
    },
    "creativeSkills": {
      "en": "Creative skills",
      "ja": "クリエイティブスキル",
      "ko": "창의적 기술",
      "zh": "创意技能",
      "es": "Habilidades creativas",
      "fr": "Compétences créatives",
      "de": "Kreative Fähigkeiten",
      "it": "Competenze creative",
      "pt": "Habilidades criativas",
      "ru": "Творческие навыки",
      "ar": "المهارات الإبداعية"
    },
    "analyticalSkills": {
      "en": "Analytical Skills",
      "ja": "分析スキル",
      "ko": "분석적 기술",
      "zh": "分析技能",
      "es": "Habilidades analíticas",
      "fr": "Compétences analytiques",
      "de": "Analytische Fähigkeiten",
      "it": "Competenze analitiche",
      "pt": "Habilidades analíticas",
      "ru": "Аналитические навыки",
      "ar": "المهارات التحليلية"
    },
    "communicationSkills": {
      "en": "Communication skills",
      "ja": "コミュニケーションスキル",
      "ko": "커뮤니케이션 기술",
      "zh": "沟通技能",
      "es": "Habilidades de comunicación",
      "fr": "Compétences de communication",
      "de": "Kommunikationsfähigkeiten",
      "it": "Competenze di comunicazione",
      "pt": "Habilidades de comunicação",
      "ru": "Навыки общения",
      "ar": "مهارات التواصل"
    },
    "businessSkills": {
      "en": "Business skills",
      "ja": "ビジネススキル",
      "ko": "비즈니스 기술",
      "zh": "商业技能",
      "es": "Habilidades empresariales",
      "fr": "Compétences commerciales",
      "de": "Geschäftsfähigkeiten",
      "it": "Competenze aziendali",
      "pt": "Habilidades empresariais",
      "ru": "Деловые навыки",
      "ar": "المهارات التجارية"
    },
    "languages": {
      "en": "Languages",
      "ja": "言語",
      "ko": "언어",
      "zh": "语言",
      "es": "Idiomas",
      "fr": "Langues",
      "de": "Sprachen",
      "it": "Lingue",
      "pt": "Idiomas",
      "ru": "Языки",
      "ar": "اللغات"
    },
    "addCustomSkills": {
      "en": "add custom skills",
      "ja": "カスタムスキルを追加",
      "ko": "사용자 정의 기술 추가",
      "zh": "添加自定义技能",
      "es": "agregar habilidades personalizadas",
      "fr": "ajouter des compétences personnalisées",
      "de": "benutzerdefinierte Fähigkeiten hinzufügen",
      "it": "aggiungi competenze personalizzate",
      "pt": "adicionar habilidades personalizadas",
      "ru": "добавить пользовательские навыки",
      "ar": "إضافة مهارات مخصصة"
    },
    "enterAdditionalSkills": {
      "en": "Enter any additional skills you have (comma-separated)",
      "ja": "追加のスキルを入力してください（カンマ区切り）",
      "ko": "추가 기술을 입력하세요 (쉼표로 구분)",
      "zh": "输入您拥有的任何其他技能（用逗号分隔）",
      "es": "Ingresa cualquier habilidad adicional que tengas (separadas por comas)",
      "fr": "Entrez toutes les compétences supplémentaires que vous avez (séparées par des virgules)",
      "de": "Geben Sie alle zusätzlichen Fähigkeiten ein, die Sie haben (durch Kommas getrennt)",
      "it": "Inserisci eventuali competenze aggiuntive che hai (separate da virgole)",
      "pt": "Digite quaisquer habilidades adicionais que você tem (separadas por vírgulas)",
      "ru": "Введите любые дополнительные навыки, которые у вас есть (через запятую)",
      "ar": "أدخل أي مهارات إضافية لديك (مفصولة بفواصل)"
    },
    "selectAtLeastOneSkill": {
      "en": "Please select at least one skill to continue",
      "ja": "続行するには少なくとも1つのスキルを選択してください",
      "ko": "계속하려면 최소 하나의 기술을 선택하세요",
      "zh": "请至少选择一项技能以继续",
      "es": "Por favor selecciona al menos una habilidad para continuar",
      "fr": "Veuillez sélectionner au moins une compétence pour continuer",
      "de": "Bitte wählen Sie mindestens eine Fähigkeit aus, um fortzufahren",
      "it": "Seleziona almeno una competenza per continuare",
      "pt": "Selecione pelo menos uma habilidade para continuar",
      "ru": "Пожалуйста, выберите хотя бы один навык для продолжения",
      "ar": "يرجى تحديد مهارة واحدة على الأقل للمتابعة"
    },
    "previous": {
      "en": "Previous",
      "ja": "前へ",
      "ko": "이전",
      "zh": "上一步",
      "es": "Anterior",
      "fr": "Précédent",
      "de": "Zurück",
      "it": "Precedente",
      "pt": "Anterior",
      "ru": "Назад",
      "ar": "السابق"
    },
    "next": {
      "en": "Next",
      "ja": "次へ",
      "ko": "다음",
      "zh": "下一步",
      "es": "Siguiente",
      "fr": "Suivant",
      "de": "Weiter",
      "it": "Successivo",
      "pt": "Próximo",
      "ru": "Далее",
      "ar": "التالي"
    }
  },
  
  // Career Paths keys
  careerPaths: {
    "myCareer": {
      "en": "My Career",
      "ja": "私のキャリア",
      "ko": "내 경력",
      "zh": "我的职业",
      "es": "Mi Carrera",
      "fr": "Ma Carrière",
      "de": "Meine Karriere",
      "it": "La Mia Carriera",
      "pt": "Minha Carreira",
      "ru": "Моя Карьера",
      "ar": "مسيرتي المهنية"
    },
    "bookmarks": {
      "en": "Bookmarks",
      "ja": "ブックマーク",
      "ko": "북마크",
      "zh": "书签",
      "es": "Marcadores",
      "fr": "Signets",
      "de": "Lesezeichen",
      "it": "Segnalibri",
      "pt": "Marcadores",
      "ru": "Закладки",
      "ar": "الإشارات المرجعية"
    },
    "assessments": {
      "en": "Assessments",
      "ja": "評価",
      "ko": "평가",
      "zh": "评估",
      "es": "Evaluaciones",
      "fr": "Évaluations",
      "de": "Bewertungen",
      "it": "Valutazioni",
      "pt": "Avaliações",
      "ru": "Оценки",
      "ar": "التقييمات"
    },
    "noAssessments": {
      "en": "No assessments",
      "ja": "評価なし",
      "ko": "평가 없음",
      "zh": "无评估",
      "es": "Sin evaluaciones",
      "fr": "Aucune évaluation",
      "de": "Keine Bewertungen",
      "it": "Nessuna valutazione",
      "pt": "Nenhuma avaliação",
      "ru": "Нет оценок",
      "ar": "لا توجد تقييمات"
    },
    "takeSkillsAssessment": {
      "en": "Take a skills assessment to get personalized recommendations",
      "ja": "スキル評価を受けてパーソナライズされた推奨事項を取得",
      "ko": "개인화된 추천을 받기 위해 기술 평가를 받으세요",
      "zh": "参加技能评估以获得个性化推荐",
      "es": "Realiza una evaluación de habilidades para obtener recomendaciones personalizadas",
      "fr": "Passez une évaluation des compétences pour obtenir des recommandations personnalisées",
      "de": "Machen Sie eine Fähigkeitsbewertung, um personalisierte Empfehlungen zu erhalten",
      "it": "Fai una valutazione delle competenze per ottenere raccomandazioni personalizzate",
      "pt": "Faça uma avaliação de habilidades para obter recomendações personalizadas",
      "ru": "Пройдите оценку навыков, чтобы получить персонализированные рекомендации",
      "ar": "قم بإجراء تقييم المهارات للحصول على توصيات مخصصة"
    },
    "takeAssessment": {
      "en": "Take Assessment",
      "ja": "評価を受ける",
      "ko": "평가 받기",
      "zh": "参加评估",
      "es": "Realizar Evaluación",
      "fr": "Passer l'Évaluation",
      "de": "Bewertung Durchführen",
      "it": "Fare Valutazione",
      "pt": "Fazer Avaliação",
      "ru": "Пройти Оценку",
      "ar": "إجراء التقييم"
    }
  },
  
  // Industries
  industries: {
    "technology": {
      "en": "Technology",
      "ja": "テクノロジー",
      "ko": "기술",
      "zh": "技术",
      "es": "Tecnología",
      "fr": "Technologie",
      "de": "Technologie",
      "it": "Tecnologia",
      "pt": "Tecnologia",
      "ru": "Технологии",
      "ar": "التكنولوجيا"
    },
    "healthcare": {
      "en": "Healthcare",
      "ja": "ヘルスケア",
      "ko": "의료",
      "zh": "医疗保健",
      "es": "Salud",
      "fr": "Santé",
      "de": "Gesundheitswesen",
      "it": "Sanità",
      "pt": "Saúde",
      "ru": "Здравоохранение",
      "ar": "الرعاية الصحية"
    },
    "finance": {
      "en": "Finance",
      "ja": "金融",
      "ko": "금융",
      "zh": "金融",
      "es": "Finanzas",
      "fr": "Finance",
      "de": "Finanzen",
      "it": "Finanza",
      "pt": "Finanças",
      "ru": "Финансы",
      "ar": "المالية"
    },
    "marketing": {
      "en": "Marketing",
      "ja": "マーケティング",
      "ko": "마케팅",
      "zh": "营销",
      "es": "Marketing",
      "fr": "Marketing",
      "de": "Marketing",
      "it": "Marketing",
      "pt": "Marketing",
      "ru": "Маркетинг",
      "ar": "التسويق"
    },
    "education": {
      "en": "Education",
      "ja": "教育",
      "ko": "교육",
      "zh": "教育",
      "es": "Educación",
      "fr": "Éducation",
      "de": "Bildung",
      "it": "Istruzione",
      "pt": "Educação",
      "ru": "Образование",
      "ar": "التعليم"
    },
    "creativeArts": {
      "en": "Creative Arts",
      "ja": "クリエイティブアーツ",
      "ko": "창의 예술",
      "zh": "创意艺术",
      "es": "Artes Creativas",
      "fr": "Arts Créatifs",
      "de": "Kreative Künste",
      "it": "Arti Creative",
      "pt": "Artes Criativas",
      "ru": "Творческие Искусства",
      "ar": "الفنون الإبداعية"
    },
    "engineering": {
      "en": "Engineering",
      "ja": "エンジニアリング",
      "ko": "엔지니어링",
      "zh": "工程",
      "es": "Ingeniería",
      "fr": "Ingénierie",
      "de": "Ingenieurwesen",
      "it": "Ingegneria",
      "pt": "Engenharia",
      "ru": "Инженерия",
      "ar": "الهندسة"
    },
    "consulting": {
      "en": "Consulting",
      "ja": "コンサルティング",
      "ko": "컨설팅",
      "zh": "咨询",
      "es": "Consultoría",
      "fr": "Conseil",
      "de": "Beratung",
      "it": "Consulenza",
      "pt": "Consultoria",
      "ru": "Консалтинг",
      "ar": "الاستشارات"
    },
    "retail": {
      "en": "Retail",
      "ja": "小売",
      "ko": "소매",
      "zh": "零售",
      "es": "Minorista",
      "fr": "Commerce de Détail",
      "de": "Einzelhandel",
      "it": "Vendita al Dettaglio",
      "pt": "Varejo",
      "ru": "Розничная Торговля",
      "ar": "التجزئة"
    },
    "manufacturing": {
      "en": "Manufacturing",
      "ja": "製造業",
      "ko": "제조업",
      "zh": "制造业",
      "es": "Manufactura",
      "fr": "Fabrication",
      "de": "Fertigung",
      "it": "Produzione",
      "pt": "Manufatura",
      "ru": "Производство",
      "ar": "التصنيع"
    },
    "government": {
      "en": "Government",
      "ja": "政府",
      "ko": "정부",
      "zh": "政府",
      "es": "Gobierno",
      "fr": "Gouvernement",
      "de": "Regierung",
      "it": "Governo",
      "pt": "Governo",
      "ru": "Правительство",
      "ar": "الحكومة"
    },
    "nonprofit": {
      "en": "Nonprofit",
      "ja": "非営利",
      "ko": "비영리",
      "zh": "非营利",
      "es": "Sin Fines de Lucro",
      "fr": "À But Non Lucratif",
      "de": "Gemeinnützig",
      "it": "Non Profit",
      "pt": "Sem Fins Lucrativos",
      "ru": "Некоммерческий",
      "ar": "غير ربحي"
    },
    "media": {
      "en": "Media",
      "ja": "メディア",
      "ko": "미디어",
      "zh": "媒体",
      "es": "Medios",
      "fr": "Médias",
      "de": "Medien",
      "it": "Media",
      "pt": "Mídia",
      "ru": "СМИ",
      "ar": "الإعلام"
    },
    "realEstate": {
      "en": "Real Estate",
      "ja": "不動産",
      "ko": "부동산",
      "zh": "房地产",
      "es": "Bienes Raíces",
      "fr": "Immobilier",
      "de": "Immobilien",
      "it": "Immobiliare",
      "pt": "Imóveis",
      "ru": "Недвижимость",
      "ar": "العقارات"
    },
    "transportation": {
      "en": "Transportation",
      "ja": "運輸",
      "ko": "운송",
      "zh": "运输",
      "es": "Transporte",
      "fr": "Transport",
      "de": "Transport",
      "it": "Trasporti",
      "pt": "Transporte",
      "ru": "Транспорт",
      "ar": "النقل"
    },
    "energy": {
      "en": "Energy",
      "ja": "エネルギー",
      "ko": "에너지",
      "zh": "能源",
      "es": "Energía",
      "fr": "Énergie",
      "de": "Energie",
      "it": "Energia",
      "pt": "Energia",
      "ru": "Энергетика",
      "ar": "الطاقة"
    },
    "agriculture": {
      "en": "Agriculture",
      "ja": "農業",
      "ko": "농업",
      "zh": "农业",
      "es": "Agricultura",
      "fr": "Agriculture",
      "de": "Landwirtschaft",
      "it": "Agricoltura",
      "pt": "Agricultura",
      "ru": "Сельское Хозяйство",
      "ar": "الزراعة"
    },
    "hospitality": {
      "en": "Hospitality",
      "ja": "ホスピタリティ",
      "ko": "환대",
      "zh": "酒店业",
      "es": "Hospitalidad",
      "fr": "Hospitalité",
      "de": "Gastfreundschaft",
      "it": "Ospitalità",
      "pt": "Hospitalidade",
      "ru": "Гостеприимство",
      "ar": "الضيافة"
    },
    "sports": {
      "en": "Sports",
      "ja": "スポーツ",
      "ko": "스포츠",
      "zh": "体育",
      "es": "Deportes",
      "fr": "Sports",
      "de": "Sport",
      "it": "Sport",
      "pt": "Esportes",
      "ru": "Спорт",
      "ar": "الرياضة"
    },
    "entertainment": {
      "en": "Entertainment",
      "ja": "エンターテイメント",
      "ko": "엔터테인먼트",
      "zh": "娱乐",
      "es": "Entretenimiento",
      "fr": "Divertissement",
      "de": "Unterhaltung",
      "it": "Intrattenimento",
      "pt": "Entretenimento",
      "ru": "Развлечения",
      "ar": "الترفيه"
    }
  }
};

// Language mapping
const languageMap = {
  'japanese': 'ja',
  'korean': 'ko',
  'chinese': 'zh',
  'spanish': 'es',
  'french': 'fr',
  'german': 'de',
  'italian': 'it',
  'portuguese': 'pt',
  'russian': 'ru',
  'arabic': 'ar'
};

// Function to update a translation file
function updateTranslationFile(filename, languageCode) {
  try {
    const filePath = path.join(__dirname, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Add roadmap keys
    if (!data.pages.roadmap.yourRoadmapProgress) {
      data.pages.roadmap.yourRoadmapProgress = missingKeys.roadmap.yourRoadmapProgress[languageCode];
    }
    if (!data.pages.roadmap.active) {
      data.pages.roadmap.active = missingKeys.roadmap.active[languageCode];
    }
    if (!data.pages.roadmap.set) {
      data.pages.roadmap.set = missingKeys.roadmap.set[languageCode];
    }
    if (!data.pages.roadmap.targetSet) {
      data.pages.roadmap.targetSet = missingKeys.roadmap.targetSet[languageCode];
    }
    
    // Add assessment keys
    if (!data.pages.assessment.step1of4) {
      data.pages.assessment.step1of4 = missingKeys.assessment.step1of4[languageCode];
    }
    if (!data.pages.assessment.complete) {
      data.pages.assessment.complete = missingKeys.assessment.complete[languageCode];
    }
    if (!data.pages.assessment.skillsSelected) {
      data.pages.assessment.skillsSelected = missingKeys.assessment.skillsSelected[languageCode];
    }
    if (!data.pages.assessment.whatSkillsDoYouHave) {
      data.pages.assessment.whatSkillsDoYouHave = missingKeys.assessment.whatSkillsDoYouHave[languageCode];
    }
    if (!data.pages.assessment.selectSkillsProficient) {
      data.pages.assessment.selectSkillsProficient = missingKeys.assessment.selectSkillsProficient[languageCode];
    }
    if (!data.pages.assessment.technicalSkills) {
      data.pages.assessment.technicalSkills = missingKeys.assessment.technicalSkills[languageCode];
    }
    if (!data.pages.assessment.creativeSkills) {
      data.pages.assessment.creativeSkills = missingKeys.assessment.creativeSkills[languageCode];
    }
    if (!data.pages.assessment.analyticalSkills) {
      data.pages.assessment.analyticalSkills = missingKeys.assessment.analyticalSkills[languageCode];
    }
    if (!data.pages.assessment.communicationSkills) {
      data.pages.assessment.communicationSkills = missingKeys.assessment.communicationSkills[languageCode];
    }
    if (!data.pages.assessment.businessSkills) {
      data.pages.assessment.businessSkills = missingKeys.assessment.businessSkills[languageCode];
    }
    if (!data.pages.assessment.languages) {
      data.pages.assessment.languages = missingKeys.assessment.languages[languageCode];
    }
    if (!data.pages.assessment.addCustomSkills) {
      data.pages.assessment.addCustomSkills = missingKeys.assessment.addCustomSkills[languageCode];
    }
    if (!data.pages.assessment.enterAdditionalSkills) {
      data.pages.assessment.enterAdditionalSkills = missingKeys.assessment.enterAdditionalSkills[languageCode];
    }
    if (!data.pages.assessment.selectAtLeastOneSkill) {
      data.pages.assessment.selectAtLeastOneSkill = missingKeys.assessment.selectAtLeastOneSkill[languageCode];
    }
    if (!data.pages.assessment.previous) {
      data.pages.assessment.previous = missingKeys.assessment.previous[languageCode];
    }
    if (!data.pages.assessment.next) {
      data.pages.assessment.next = missingKeys.assessment.next[languageCode];
    }
    
    // Add career paths section
    if (!data.careerPaths) {
      data.careerPaths = {};
    }
    if (!data.careerPaths.myCareer) {
      data.careerPaths.myCareer = missingKeys.careerPaths.myCareer[languageCode];
    }
    if (!data.careerPaths.bookmarks) {
      data.careerPaths.bookmarks = missingKeys.careerPaths.bookmarks[languageCode];
    }
    if (!data.careerPaths.assessments) {
      data.careerPaths.assessments = missingKeys.careerPaths.assessments[languageCode];
    }
    if (!data.careerPaths.noAssessments) {
      data.careerPaths.noAssessments = missingKeys.careerPaths.noAssessments[languageCode];
    }
    if (!data.careerPaths.takeSkillsAssessment) {
      data.careerPaths.takeSkillsAssessment = missingKeys.careerPaths.takeSkillsAssessment[languageCode];
    }
    if (!data.careerPaths.takeAssessment) {
      data.careerPaths.takeAssessment = missingKeys.careerPaths.takeAssessment[languageCode];
    }
    
    // Add industries section
    if (!data.industries) {
      data.industries = {};
    }
    Object.keys(missingKeys.industries).forEach(industryKey => {
      if (!data.industries[industryKey]) {
        data.industries[industryKey] = missingKeys.industries[industryKey][languageCode];
      }
    });
    
    // Write back to file with proper formatting
    const formattedContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, formattedContent, 'utf8');
    
    console.log(`✅ Updated ${filename} with missing keys`);
  } catch (error) {
    console.error(`❌ Error updating ${filename}:`, error.message);
  }
}

// Update all translation files
console.log('🔄 Updating all translation files with missing keys...\n');

Object.keys(languageMap).forEach(languageName => {
  const languageCode = languageMap[languageName];
  const filename = `${languageName}-translations-complete.json`;
  updateTranslationFile(filename, languageCode);
});

console.log('\n✅ All translation files updated successfully!');
console.log('\n📋 Summary of added keys:');
console.log('   • Roadmap: yourRoadmapProgress, active, set, targetSet');
console.log('   • Assessment: step1of4, complete, skillsSelected, whatSkillsDoYouHave, selectSkillsProficient, technicalSkills, creativeSkills, analyticalSkills, communicationSkills, businessSkills, languages, addCustomSkills, enterAdditionalSkills, selectAtLeastOneSkill, previous, next');
console.log('   • Career Paths: myCareer, bookmarks, assessments, noAssessments, takeSkillsAssessment, takeAssessment');
console.log('   • Industries: technology, healthcare, finance, marketing, education, creativeArts, engineering, consulting, retail, manufacturing, government, nonprofit, media, realEstate, transportation, energy, agriculture, hospitality, sports, entertainment');
