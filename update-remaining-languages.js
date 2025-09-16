import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Comprehensive translations for remaining languages
const remainingTranslations = {
  fr: {
    common: {
      unknown: "Inconnu",
      various: "Divers",
      salaryNotSpecified: "Salaire non spécifié"
    },
    skills: {
      problemSolving: "Résolution de Problèmes",
      technicalKnowledge: "Connaissances Techniques",
      analyticalThinking: "Pensée Analytique",
      productStrategy: "Stratégie Produit",
      userResearch: "Recherche Utilisateur",
      stakeholderManagement: "Gestion des Parties Prenantes",
      programming: "Programmation",
      mathematics: "Mathématiques",
      statistics: "Statistiques",
      machineLearning: "Apprentissage Automatique",
      dataVisualization: "Visualisation de Données",
      systemUnderstanding: "Compréhension des Systèmes",
      cloudPlatforms: "Plateformes Cloud",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "Surveillance",
      technicalSkills: "Compétences Techniques",
      communication: "Communication",
      teamLeadership: "Leadership d'Équipe",
      architectureDesign: "Conception d'Architecture",
      mentoring: "Mentorat",
      marketingStrategy: "Stratégie Marketing",
      analytics: "Analytique",
      productKnowledge: "Connaissance Produit",
      goToMarketStrategy: "Stratégie Go-to-Market",
      customerInsights: "Insights Client",
      abTesting: "Tests A/B",
      automation: "Automatisation",
      brandStrategy: "Stratégie de Marque",
      creativeDirection: "Direction Créative",
      dataAnalysis: "Analyse de Données",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "Design",
      copywriting: "Rédaction",
      photography: "Photographie",
      videoEditing: "Montage Vidéo",
      uiUx: "UI/UX",
      branding: "Branding",
      illustration: "Illustration",
      animation: "Animation",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "Prise de Parole",
      writing: "Écriture",
      presentation: "Présentation",
      negotiation: "Négociation",
      leadership: "Leadership",
      teamManagement: "Gestion d'Équipe",
      clientRelations: "Relations Client",
      training: "Formation",
      projectManagement: "Gestion de Projet",
      marketing: "Marketing",
      sales: "Ventes",
      finance: "Finance",
      strategy: "Stratégie",
      operations: "Opérations",
      hr: "RH",
      legal: "Juridique",
      english: "Anglais",
      spanish: "Espagnol",
      french: "Français",
      german: "Allemand",
      chinese: "Chinois",
      japanese: "Japonais",
      arabic: "Arabe",
      portuguese: "Portugais",
      creativity: "Créativité",
      deepLearning: "Apprentissage Profond",
      modelDeployment: "Déploiement de Modèles",
      businessAcumen: "Sens des Affaires",
      dataStrategy: "Stratégie Données",
      productMetrics: "Métriques Produit"
    },
    priority: {
      high: "Élevée",
      medium: "Moyenne",
      low: "Faible"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "Faites Évoluer Votre Carrière",
        advanceToNextLevel: "Passez au niveau professionnel suivant",
        leverageCurrentSkills: "Exploitez vos compétences actuelles dans de nouveaux domaines"
      }
    }
  },
  de: {
    common: {
      unknown: "Unbekannt",
      various: "Verschiedene",
      salaryNotSpecified: "Gehalt nicht angegeben"
    },
    skills: {
      problemSolving: "Problemlösung",
      technicalKnowledge: "Technisches Wissen",
      analyticalThinking: "Analytisches Denken",
      productStrategy: "Produktstrategie",
      userResearch: "Benutzerforschung",
      stakeholderManagement: "Stakeholder-Management",
      programming: "Programmierung",
      mathematics: "Mathematik",
      statistics: "Statistik",
      machineLearning: "Maschinelles Lernen",
      dataVisualization: "Datenvisualisierung",
      systemUnderstanding: "Systemverständnis",
      cloudPlatforms: "Cloud-Plattformen",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "Überwachung",
      technicalSkills: "Technische Fähigkeiten",
      communication: "Kommunikation",
      teamLeadership: "Teamführung",
      architectureDesign: "Architekturentwurf",
      mentoring: "Mentoring",
      marketingStrategy: "Marketingstrategie",
      analytics: "Analytik",
      productKnowledge: "Produktwissen",
      goToMarketStrategy: "Go-to-Market-Strategie",
      customerInsights: "Kundeninsights",
      abTesting: "A/B-Tests",
      automation: "Automatisierung",
      brandStrategy: "Markenstrategie",
      creativeDirection: "Kreative Leitung",
      dataAnalysis: "Datenanalyse",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "Design",
      copywriting: "Texterstellung",
      photography: "Fotografie",
      videoEditing: "Videobearbeitung",
      uiUx: "UI/UX",
      branding: "Branding",
      illustration: "Illustration",
      animation: "Animation",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "Öffentliches Sprechen",
      writing: "Schreiben",
      presentation: "Präsentation",
      negotiation: "Verhandlung",
      leadership: "Führung",
      teamManagement: "Teammanagement",
      clientRelations: "Kundenbeziehungen",
      training: "Schulung",
      projectManagement: "Projektmanagement",
      marketing: "Marketing",
      sales: "Vertrieb",
      finance: "Finanzen",
      strategy: "Strategie",
      operations: "Betrieb",
      hr: "Personalwesen",
      legal: "Recht",
      english: "Englisch",
      spanish: "Spanisch",
      french: "Französisch",
      german: "Deutsch",
      chinese: "Chinesisch",
      japanese: "Japanisch",
      arabic: "Arabisch",
      portuguese: "Portugiesisch",
      creativity: "Kreativität",
      deepLearning: "Deep Learning",
      modelDeployment: "Modell-Deployment",
      businessAcumen: "Geschäftssinn",
      dataStrategy: "Datenstrategie",
      productMetrics: "Produktmetriken"
    },
    priority: {
      high: "Hoch",
      medium: "Mittel",
      low: "Niedrig"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "Karriere-Level erhöhen",
        advanceToNextLevel: "Zum nächsten Karrierelevel vorrücken",
        leverageCurrentSkills: "Ihre aktuellen Fähigkeiten in neuen Bereichen nutzen"
      }
    }
  },
  pt: {
    common: {
      unknown: "Desconhecido",
      various: "Vários",
      salaryNotSpecified: "Salário não especificado"
    },
    skills: {
      problemSolving: "Resolução de Problemas",
      technicalKnowledge: "Conhecimento Técnico",
      analyticalThinking: "Pensamento Analítico",
      productStrategy: "Estratégia de Produto",
      userResearch: "Pesquisa de Usuário",
      stakeholderManagement: "Gestão de Stakeholders",
      programming: "Programação",
      mathematics: "Matemática",
      statistics: "Estatística",
      machineLearning: "Aprendizado de Máquina",
      dataVisualization: "Visualização de Dados",
      systemUnderstanding: "Compreensão de Sistemas",
      cloudPlatforms: "Plataformas em Nuvem",
      infrastructureAsCode: "Infraestrutura como Código",
      monitoring: "Monitoramento",
      technicalSkills: "Habilidades Técnicas",
      communication: "Comunicação",
      teamLeadership: "Liderança de Equipe",
      architectureDesign: "Design de Arquitetura",
      mentoring: "Mentoria",
      marketingStrategy: "Estratégia de Marketing",
      analytics: "Analytics",
      productKnowledge: "Conhecimento de Produto",
      goToMarketStrategy: "Estratégia Go-to-Market",
      customerInsights: "Insights do Cliente",
      abTesting: "Testes A/B",
      automation: "Automação",
      brandStrategy: "Estratégia de Marca",
      creativeDirection: "Direção Criativa",
      dataAnalysis: "Análise de Dados",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "Design",
      copywriting: "Redação Publicitária",
      photography: "Fotografia",
      videoEditing: "Edição de Vídeo",
      uiUx: "UI/UX",
      branding: "Branding",
      illustration: "Ilustração",
      animation: "Animação",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "Oratória",
      writing: "Escrita",
      presentation: "Apresentação",
      negotiation: "Negociação",
      leadership: "Liderança",
      teamManagement: "Gestão de Equipe",
      clientRelations: "Relações com Clientes",
      training: "Treinamento",
      projectManagement: "Gestão de Projetos",
      marketing: "Marketing",
      sales: "Vendas",
      finance: "Finanças",
      strategy: "Estratégia",
      operations: "Operações",
      hr: "RH",
      legal: "Jurídico",
      english: "Inglês",
      spanish: "Espanhol",
      french: "Francês",
      german: "Alemão",
      chinese: "Chinês",
      japanese: "Japonês",
      arabic: "Árabe",
      portuguese: "Português",
      creativity: "Criatividade",
      deepLearning: "Aprendizado Profundo",
      modelDeployment: "Deploy de Modelos",
      businessAcumen: "Conhecimento Empresarial",
      dataStrategy: "Estratégia de Dados",
      productMetrics: "Métricas de Produto"
    },
    priority: {
      high: "Alta",
      medium: "Média",
      low: "Baixa"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "Evolua Sua Carreira",
        advanceToNextLevel: "Avançar para o próximo nível profissional",
        leverageCurrentSkills: "Aproveite suas habilidades atuais em novas áreas"
      }
    }
  },
  it: {
    common: {
      unknown: "Sconosciuto",
      various: "Vari",
      salaryNotSpecified: "Stipendio non specificato"
    },
    skills: {
      problemSolving: "Risoluzione Problemi",
      technicalKnowledge: "Conoscenza Tecnica",
      analyticalThinking: "Pensiero Analitico",
      productStrategy: "Strategia Prodotto",
      userResearch: "Ricerca Utente",
      stakeholderManagement: "Gestione Stakeholder",
      programming: "Programmazione",
      mathematics: "Matematica",
      statistics: "Statistica",
      machineLearning: "Apprendimento Automatico",
      dataVisualization: "Visualizzazione Dati",
      systemUnderstanding: "Comprensione Sistemi",
      cloudPlatforms: "Piattaforme Cloud",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "Monitoraggio",
      technicalSkills: "Competenze Tecniche",
      communication: "Comunicazione",
      teamLeadership: "Leadership di Squadra",
      architectureDesign: "Progettazione Architettura",
      mentoring: "Mentoring",
      marketingStrategy: "Strategia Marketing",
      analytics: "Analytics",
      productKnowledge: "Conoscenza Prodotto",
      goToMarketStrategy: "Strategia Go-to-Market",
      customerInsights: "Insights Cliente",
      abTesting: "Test A/B",
      automation: "Automazione",
      brandStrategy: "Strategia Brand",
      creativeDirection: "Direzione Creativa",
      dataAnalysis: "Analisi Dati",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "Design",
      copywriting: "Copywriting",
      photography: "Fotografia",
      videoEditing: "Montaggio Video",
      uiUx: "UI/UX",
      branding: "Branding",
      illustration: "Illustrazione",
      animation: "Animazione",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "Parlare in Pubblico",
      writing: "Scrittura",
      presentation: "Presentazione",
      negotiation: "Negoziazione",
      leadership: "Leadership",
      teamManagement: "Gestione Squadra",
      clientRelations: "Relazioni Cliente",
      training: "Formazione",
      projectManagement: "Gestione Progetti",
      marketing: "Marketing",
      sales: "Vendite",
      finance: "Finanza",
      strategy: "Strategia",
      operations: "Operazioni",
      hr: "HR",
      legal: "Legale",
      english: "Inglese",
      spanish: "Spagnolo",
      french: "Francese",
      german: "Tedesco",
      chinese: "Cinese",
      japanese: "Giapponese",
      arabic: "Arabo",
      portuguese: "Portoghese",
      creativity: "Creatività",
      deepLearning: "Apprendimento Profondo",
      modelDeployment: "Deploy Modelli",
      businessAcumen: "Senso degli Affari",
      dataStrategy: "Strategia Dati",
      productMetrics: "Metriche Prodotto"
    },
    priority: {
      high: "Alta",
      medium: "Media",
      low: "Bassa"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "Fai Evolvere la Tua Carriera",
        advanceToNextLevel: "Avanza al prossimo livello professionale",
        leverageCurrentSkills: "Sfrutta le tue competenze attuali in nuove aree"
      }
    }
  },
  ko: {
    common: {
      unknown: "알 수 없음",
      various: "다양한",
      salaryNotSpecified: "급여 미지정"
    },
    skills: {
      problemSolving: "문제 해결",
      technicalKnowledge: "기술 지식",
      analyticalThinking: "분석적 사고",
      productStrategy: "제품 전략",
      userResearch: "사용자 연구",
      stakeholderManagement: "이해관계자 관리",
      programming: "프로그래밍",
      mathematics: "수학",
      statistics: "통계학",
      machineLearning: "머신러닝",
      dataVisualization: "데이터 시각화",
      systemUnderstanding: "시스템 이해",
      cloudPlatforms: "클라우드 플랫폼",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "모니터링",
      technicalSkills: "기술적 기술",
      communication: "커뮤니케이션",
      teamLeadership: "팀 리더십",
      architectureDesign: "아키텍처 설계",
      mentoring: "멘토링",
      marketingStrategy: "마케팅 전략",
      analytics: "애널리틱스",
      productKnowledge: "제품 지식",
      goToMarketStrategy: "Go-to-Market 전략",
      customerInsights: "고객 인사이트",
      abTesting: "A/B 테스트",
      automation: "자동화",
      brandStrategy: "브랜드 전략",
      creativeDirection: "크리에이티브 디렉션",
      dataAnalysis: "데이터 분석",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "디자인",
      copywriting: "카피라이팅",
      photography: "사진",
      videoEditing: "비디오 편집",
      uiUx: "UI/UX",
      branding: "브랜딩",
      illustration: "일러스트레이션",
      animation: "애니메이션",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "공개 연설",
      writing: "글쓰기",
      presentation: "프레젠테이션",
      negotiation: "협상",
      leadership: "리더십",
      teamManagement: "팀 관리",
      clientRelations: "클라이언트 관계",
      training: "교육",
      projectManagement: "프로젝트 관리",
      marketing: "마케팅",
      sales: "영업",
      finance: "금융",
      strategy: "전략",
      operations: "운영",
      hr: "인사",
      legal: "법무",
      english: "영어",
      spanish: "스페인어",
      french: "프랑스어",
      german: "독일어",
      chinese: "중국어",
      japanese: "일본어",
      arabic: "아랍어",
      portuguese: "포르투갈어",
      creativity: "창의성",
      deepLearning: "딥러닝",
      modelDeployment: "모델 배포",
      businessAcumen: "비즈니스 통찰력",
      dataStrategy: "데이터 전략",
      productMetrics: "제품 메트릭"
    },
    priority: {
      high: "높음",
      medium: "보통",
      low: "낮음"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "커리어 레벨업",
        advanceToNextLevel: "다음 커리어 레벨로 진급",
        leverageCurrentSkills: "현재 기술을 새로운 분야에서 활용"
      }
    }
  },
  zh: {
    common: {
      unknown: "未知",
      various: "各种",
      salaryNotSpecified: "薪资未指定"
    },
    skills: {
      problemSolving: "问题解决",
      technicalKnowledge: "技术知识",
      analyticalThinking: "分析思维",
      productStrategy: "产品策略",
      userResearch: "用户研究",
      stakeholderManagement: "利益相关者管理",
      programming: "编程",
      mathematics: "数学",
      statistics: "统计学",
      machineLearning: "机器学习",
      dataVisualization: "数据可视化",
      systemUnderstanding: "系统理解",
      cloudPlatforms: "云平台",
      infrastructureAsCode: "基础设施即代码",
      monitoring: "监控",
      technicalSkills: "技术技能",
      communication: "沟通",
      teamLeadership: "团队领导",
      architectureDesign: "架构设计",
      mentoring: "指导",
      marketingStrategy: "营销策略",
      analytics: "分析",
      productKnowledge: "产品知识",
      goToMarketStrategy: "市场进入策略",
      customerInsights: "客户洞察",
      abTesting: "A/B测试",
      automation: "自动化",
      brandStrategy: "品牌策略",
      creativeDirection: "创意指导",
      dataAnalysis: "数据分析",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "设计",
      copywriting: "文案写作",
      photography: "摄影",
      videoEditing: "视频编辑",
      uiUx: "UI/UX",
      branding: "品牌设计",
      illustration: "插画",
      animation: "动画",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "公开演讲",
      writing: "写作",
      presentation: "演示",
      negotiation: "谈判",
      leadership: "领导力",
      teamManagement: "团队管理",
      clientRelations: "客户关系",
      training: "培训",
      projectManagement: "项目管理",
      marketing: "营销",
      sales: "销售",
      finance: "财务",
      strategy: "策略",
      operations: "运营",
      hr: "人力资源",
      legal: "法律",
      english: "英语",
      spanish: "西班牙语",
      french: "法语",
      german: "德语",
      chinese: "中文",
      japanese: "日语",
      arabic: "阿拉伯语",
      portuguese: "葡萄牙语",
      creativity: "创造力",
      deepLearning: "深度学习",
      modelDeployment: "模型部署",
      businessAcumen: "商业洞察",
      dataStrategy: "数据策略",
      productMetrics: "产品指标"
    },
    priority: {
      high: "高",
      medium: "中",
      low: "低"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "职业升级",
        advanceToNextLevel: "晋升到下一个职业级别",
        leverageCurrentSkills: "在新领域利用你当前的技能"
      }
    }
  },
  ru: {
    common: {
      unknown: "Неизвестно",
      various: "Различные",
      salaryNotSpecified: "Зарплата не указана"
    },
    skills: {
      problemSolving: "Решение Проблем",
      technicalKnowledge: "Технические Знания",
      analyticalThinking: "Аналитическое Мышление",
      productStrategy: "Продуктовая Стратегия",
      userResearch: "Исследование Пользователей",
      stakeholderManagement: "Управление Заинтересованными Сторонами",
      programming: "Программирование",
      mathematics: "Математика",
      statistics: "Статистика",
      machineLearning: "Машинное Обучение",
      dataVisualization: "Визуализация Данных",
      systemUnderstanding: "Понимание Систем",
      cloudPlatforms: "Облачные Платформы",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "Мониторинг",
      technicalSkills: "Технические Навыки",
      communication: "Коммуникация",
      teamLeadership: "Лидерство Команды",
      architectureDesign: "Проектирование Архитектуры",
      mentoring: "Менторство",
      marketingStrategy: "Маркетинговая Стратегия",
      analytics: "Аналитика",
      productKnowledge: "Знание Продукта",
      goToMarketStrategy: "Go-to-Market Стратегия",
      customerInsights: "Инсайты Клиентов",
      abTesting: "A/B Тестирование",
      automation: "Автоматизация",
      brandStrategy: "Брендовая Стратегия",
      creativeDirection: "Креативное Направление",
      dataAnalysis: "Анализ Данных",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "Дизайн",
      copywriting: "Копирайтинг",
      photography: "Фотография",
      videoEditing: "Видеомонтаж",
      uiUx: "UI/UX",
      branding: "Брендинг",
      illustration: "Иллюстрация",
      animation: "Анимация",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "Публичные Выступления",
      writing: "Письмо",
      presentation: "Презентация",
      negotiation: "Переговоры",
      leadership: "Лидерство",
      teamManagement: "Управление Командой",
      clientRelations: "Отношения с Клиентами",
      training: "Обучение",
      projectManagement: "Управление Проектами",
      marketing: "Маркетинг",
      sales: "Продажи",
      finance: "Финансы",
      strategy: "Стратегия",
      operations: "Операции",
      hr: "HR",
      legal: "Юридический",
      english: "Английский",
      spanish: "Испанский",
      french: "Французский",
      german: "Немецкий",
      chinese: "Китайский",
      japanese: "Японский",
      arabic: "Арабский",
      portuguese: "Португальский",
      creativity: "Креативность",
      deepLearning: "Глубокое Обучение",
      modelDeployment: "Развертывание Моделей",
      businessAcumen: "Деловая Хватка",
      dataStrategy: "Стратегия Данных",
      productMetrics: "Продуктовые Метрики"
    },
    priority: {
      high: "Высокий",
      medium: "Средний",
      low: "Низкий"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "Повышение Карьеры",
        advanceToNextLevel: "Переход на следующий карьерный уровень",
        leverageCurrentSkills: "Используйте ваши текущие навыки в новых областях"
      }
    }
  },
  ar: {
    common: {
      unknown: "غير معروف",
      various: "متنوع",
      salaryNotSpecified: "الراتب غير محدد"
    },
    skills: {
      problemSolving: "حل المشاكل",
      technicalKnowledge: "المعرفة التقنية",
      analyticalThinking: "التفكير التحليلي",
      productStrategy: "استراتيجية المنتج",
      userResearch: "بحث المستخدم",
      stakeholderManagement: "إدارة أصحاب المصلحة",
      programming: "البرمجة",
      mathematics: "الرياضيات",
      statistics: "الإحصاء",
      machineLearning: "التعلم الآلي",
      dataVisualization: "تصور البيانات",
      systemUnderstanding: "فهم الأنظمة",
      cloudPlatforms: "منصات السحابة",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "المراقبة",
      technicalSkills: "المهارات التقنية",
      communication: "التواصل",
      teamLeadership: "قيادة الفريق",
      architectureDesign: "تصميم الهندسة المعمارية",
      mentoring: "الإرشاد",
      marketingStrategy: "استراتيجية التسويق",
      analytics: "التحليلات",
      productKnowledge: "معرفة المنتج",
      goToMarketStrategy: "استراتيجية دخول السوق",
      customerInsights: "رؤى العملاء",
      abTesting: "اختبار A/B",
      automation: "الأتمتة",
      brandStrategy: "استراتيجية العلامة التجارية",
      creativeDirection: "الاتجاه الإبداعي",
      dataAnalysis: "تحليل البيانات",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "التصميم",
      copywriting: "كتابة المحتوى",
      photography: "التصوير",
      videoEditing: "تحرير الفيديو",
      uiUx: "UI/UX",
      branding: "العلامة التجارية",
      illustration: "الرسم التوضيحي",
      animation: "الرسوم المتحركة",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "التحدث أمام الجمهور",
      writing: "الكتابة",
      presentation: "العرض التقديمي",
      negotiation: "التفاوض",
      leadership: "القيادة",
      teamManagement: "إدارة الفريق",
      clientRelations: "علاقات العملاء",
      training: "التدريب",
      projectManagement: "إدارة المشاريع",
      marketing: "التسويق",
      sales: "المبيعات",
      finance: "المالية",
      strategy: "الاستراتيجية",
      operations: "العمليات",
      hr: "الموارد البشرية",
      legal: "القانوني",
      english: "الإنجليزية",
      spanish: "الإسبانية",
      french: "الفرنسية",
      german: "الألمانية",
      chinese: "الصينية",
      japanese: "اليابانية",
      arabic: "العربية",
      portuguese: "البرتغالية",
      creativity: "الإبداع",
      deepLearning: "التعلم العميق",
      modelDeployment: "نشر النماذج",
      businessAcumen: "البصيرة التجارية",
      dataStrategy: "استراتيجية البيانات",
      productMetrics: "مقاييس المنتج"
    },
    priority: {
      high: "عالي",
      medium: "متوسط",
      low: "منخفض"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "تطوير مسيرتك المهنية",
        advanceToNextLevel: "التقدم إلى المستوى المهني التالي",
        leverageCurrentSkills: "استفد من مهاراتك الحالية في مجالات جديدة"
      }
    }
  }
};

async function updateRemainingLanguages() {
  console.log('🌍 Updating remaining languages with comprehensive translations...');

  try {
    for (const [languageCode, translations] of Object.entries(remainingTranslations)) {
      console.log(`\n📝 Updating ${languageCode} translations...`);
      
      // Get existing translation data
      const { data: existingData, error: fetchError } = await supabase
        .from('translations')
        .select('translation_data')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`❌ Error fetching existing ${languageCode} data:`, fetchError);
        continue;
      }

      // Merge with existing data
      const existingTranslations = existingData?.translation_data || {};
      const mergedTranslations = {
        ...existingTranslations,
        ...translations
      };

      // First try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('translations')
        .update({
          translation_data: mergedTranslations,
          version: Date.now().toString(),
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('language_code', languageCode)
        .select();

      if (updateError || !updateData || updateData.length === 0) {
        // If update failed, try to insert new record
        console.log(`📝 No existing record found for ${languageCode}, inserting new record...`);
        
        const { error: insertError } = await supabase
          .from('translations')
          .insert({
            language_code: languageCode,
            translation_data: mergedTranslations,
            version: Date.now().toString(),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`❌ Error inserting ${languageCode}:`, insertError);
        } else {
          console.log(`✅ Successfully inserted ${languageCode} with ${Object.keys(translations).length} new sections`);
        }
      } else {
        console.log(`✅ Successfully updated ${languageCode} with ${Object.keys(translations).length} new sections`);
      }
    }

    console.log('\n✅ All remaining language updates completed!');

  } catch (error) {
    console.error('❌ Error during language updates:', error);
  }
}

// Run the update
updateRemainingLanguages();
