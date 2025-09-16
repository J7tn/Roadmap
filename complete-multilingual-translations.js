import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Comprehensive translations for ALL supported languages
const allLanguageTranslations = {
  // French translations
  fr: {
    careers: {
      "ai-engineer": { title: "Ingénieur IA", description: "Développe des systèmes d'intelligence artificielle et d'apprentissage automatique." },
      "data-scientist": { title: "Scientifique des Données", description: "Analyse des données complexes pour extraire des insights et créer des modèles prédictifs." },
      "software-engineer": { title: "Ingénieur Logiciel", description: "Conçoit, développe et maintient des applications et systèmes logiciels." },
      "devops-engineer": { title: "Ingénieur DevOps", description: "Automatise les processus de développement et de déploiement de logiciels." },
      "cloud-engineer": { title: "Ingénieur Cloud", description: "Conçoit et implémente des solutions de cloud computing." },
      "cybersecurity-analyst": { title: "Analyste Cybersécurité", description: "Protège les systèmes informatiques contre les menaces et vulnérabilités." },
      "blockchain-developer": { title: "Développeur Blockchain", description: "Crée des applications décentralisées utilisant la technologie blockchain." },
      "business-analyst": { title: "Analyste Métier", description: "Analyse les processus métier et recommande des améliorations." },
      "project-manager": { title: "Chef de Projet", description: "Planifie et exécute des projets pour atteindre les objectifs d'entreprise." },
      "marketing-manager": { title: "Responsable Marketing", description: "Développe des stratégies de marketing et de promotion." },
      "graphic-designer": { title: "Graphiste", description: "Crée des éléments visuels pour la communication et le marketing." },
      "video-editor": { title: "Monteur Vidéo", description: "Monte et produit du contenu vidéo professionnel." },
      "photographer": { title: "Photographe", description: "Capture des images pour divers usages." },
      "civil-engineer": { title: "Ingénieur Civil", description: "Conçoit et supervise des projets d'infrastructure." },
      "mechanical-engineer": { title: "Ingénieur Mécanique", description: "Conçoit des systèmes et machines mécaniques." },
      "electrical-engineer": { title: "Ingénieur Électrique", description: "Conçoit des systèmes électriques et électroniques." },
      "police-officer": { title: "Agent de Police", description: "Maintient l'ordre public et la sécurité des citoyens." }
    },
    skills: {
      'Communication': 'Communication',
      'Leadership': 'Leadership',
      'Problem Solving': 'Résolution de Problèmes',
      'Teamwork': 'Travail d\'Équipe',
      'Analytical Thinking': 'Pensée Analytique',
      'Creativity': 'Créativité',
      'Adaptability': 'Adaptabilité',
      'Time Management': 'Gestion du Temps',
      'Project Management': 'Gestion de Projet',
      'Critical Thinking': 'Pensée Critique',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': 'Apprentissage Automatique',
      'Data Analysis': 'Analyse de Données',
      'UI/UX Design': 'Conception UI/UX',
      'Agile Development': 'Développement Agile',
      'DevOps': 'DevOps'
    }
  },
  
  // German translations
  de: {
    careers: {
      "ai-engineer": { title: "KI-Ingenieur", description: "Entwickelt Systeme für künstliche Intelligenz und maschinelles Lernen." },
      "data-scientist": { title: "Datenwissenschaftler", description: "Analysiert komplexe Daten, um Erkenntnisse zu gewinnen und Vorhersagemodelle zu erstellen." },
      "software-engineer": { title: "Software-Ingenieur", description: "Entwirft, entwickelt und wartet Softwareanwendungen und -systeme." },
      "devops-engineer": { title: "DevOps-Ingenieur", description: "Automatisiert Softwareentwicklungs- und Bereitstellungsprozesse." },
      "cloud-engineer": { title: "Cloud-Ingenieur", description: "Entwirft und implementiert Cloud-Computing-Lösungen." },
      "cybersecurity-analyst": { title: "Cybersicherheits-Analyst", description: "Schützt Computersysteme vor Bedrohungen und Schwachstellen." },
      "blockchain-developer": { title: "Blockchain-Entwickler", description: "Erstellt dezentrale Anwendungen mit Blockchain-Technologie." },
      "business-analyst": { title: "Business-Analyst", description: "Analysiert Geschäftsprozesse und empfiehlt Verbesserungen." },
      "project-manager": { title: "Projektmanager", description: "Plant und führt Projekte zur Erreichung von Unternehmenszielen durch." },
      "marketing-manager": { title: "Marketing-Manager", description: "Entwickelt Marketing- und Werbestrategien." },
      "graphic-designer": { title: "Grafikdesigner", description: "Erstellt visuelle Elemente für Kommunikation und Marketing." },
      "video-editor": { title: "Video-Editor", description: "Schneidet und produziert professionelle Videoinhalte." },
      "photographer": { title: "Fotograf", description: "Erfasst Bilder für verschiedene Zwecke." },
      "civil-engineer": { title: "Bauingenieur", description: "Entwirft und überwacht Infrastrukturprojekte." },
      "mechanical-engineer": { title: "Maschinenbauingenieur", description: "Entwirft mechanische Systeme und Maschinen." },
      "electrical-engineer": { title: "Elektroingenieur", description: "Entwirft elektrische und elektronische Systeme." },
      "police-officer": { title: "Polizist", description: "Erhält öffentliche Ordnung und Bürgersicherheit aufrecht." }
    },
    skills: {
      'Communication': 'Kommunikation',
      'Leadership': 'Führung',
      'Problem Solving': 'Problemlösung',
      'Teamwork': 'Teamarbeit',
      'Analytical Thinking': 'Analytisches Denken',
      'Creativity': 'Kreativität',
      'Adaptability': 'Anpassungsfähigkeit',
      'Time Management': 'Zeitmanagement',
      'Project Management': 'Projektmanagement',
      'Critical Thinking': 'Kritisches Denken',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': 'Maschinelles Lernen',
      'Data Analysis': 'Datenanalyse',
      'UI/UX Design': 'UI/UX-Design',
      'Agile Development': 'Agile Entwicklung',
      'DevOps': 'DevOps'
    }
  },

  // Portuguese translations
  pt: {
    careers: {
      "ai-engineer": { title: "Engenheiro de IA", description: "Desenvolve sistemas de inteligência artificial e aprendizado de máquina." },
      "data-scientist": { title: "Cientista de Dados", description: "Analisa dados complexos para extrair insights e criar modelos preditivos." },
      "software-engineer": { title: "Engenheiro de Software", description: "Projeta, desenvolve e mantém aplicações e sistemas de software." },
      "devops-engineer": { title: "Engenheiro DevOps", description: "Automatiza processos de desenvolvimento e implantação de software." },
      "cloud-engineer": { title: "Engenheiro de Nuvem", description: "Projeta e implementa soluções de computação em nuvem." },
      "cybersecurity-analyst": { title: "Analista de Cibersegurança", description: "Protege sistemas de computador contra ameaças e vulnerabilidades." },
      "blockchain-developer": { title: "Desenvolvedor Blockchain", description: "Cria aplicações descentralizadas usando tecnologia blockchain." },
      "business-analyst": { title: "Analista de Negócios", description: "Analisa processos de negócios e recomenda melhorias." },
      "project-manager": { title: "Gerente de Projetos", description: "Planeja e executa projetos para alcançar objetivos empresariais." },
      "marketing-manager": { title: "Gerente de Marketing", description: "Desenvolve estratégias de marketing e promoção." },
      "graphic-designer": { title: "Designer Gráfico", description: "Cria elementos visuais para comunicação e marketing." },
      "video-editor": { title: "Editor de Vídeo", description: "Edita e produz conteúdo de vídeo profissional." },
      "photographer": { title: "Fotógrafo", description: "Captura imagens para diversos propósitos." },
      "civil-engineer": { title: "Engenheiro Civil", description: "Projeta e supervisiona projetos de infraestrutura." },
      "mechanical-engineer": { title: "Engenheiro Mecânico", description: "Projeta sistemas e máquinas mecânicas." },
      "electrical-engineer": { title: "Engenheiro Elétrico", description: "Projeta sistemas elétricos e eletrônicos." },
      "police-officer": { title: "Policial", description: "Mantém a ordem pública e a segurança dos cidadãos." }
    },
    skills: {
      'Communication': 'Comunicação',
      'Leadership': 'Liderança',
      'Problem Solving': 'Resolução de Problemas',
      'Teamwork': 'Trabalho em Equipe',
      'Analytical Thinking': 'Pensamento Analítico',
      'Creativity': 'Criatividade',
      'Adaptability': 'Adaptabilidade',
      'Time Management': 'Gestão do Tempo',
      'Project Management': 'Gestão de Projetos',
      'Critical Thinking': 'Pensamento Crítico',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': 'Aprendizado de Máquina',
      'Data Analysis': 'Análise de Dados',
      'UI/UX Design': 'Design UI/UX',
      'Agile Development': 'Desenvolvimento Ágil',
      'DevOps': 'DevOps'
    }
  },

  // Korean translations
  ko: {
    careers: {
      "ai-engineer": { title: "AI 엔지니어", description: "인공지능 시스템과 머신러닝을 개발합니다." },
      "data-scientist": { title: "데이터 사이언티스트", description: "복잡한 데이터를 분석하여 인사이트를 추출하고 예측 모델을 만듭니다." },
      "software-engineer": { title: "소프트웨어 엔지니어", description: "소프트웨어 애플리케이션과 시스템을 설계, 개발, 유지보수합니다." },
      "devops-engineer": { title: "DevOps 엔지니어", description: "소프트웨어 개발 및 배포 프로세스를 자동화합니다." },
      "cloud-engineer": { title: "클라우드 엔지니어", description: "클라우드 컴퓨팅 솔루션을 설계하고 구현합니다." },
      "cybersecurity-analyst": { title: "사이버보안 분석가", description: "컴퓨터 시스템을 위협과 취약점으로부터 보호합니다." },
      "blockchain-developer": { title: "블록체인 개발자", description: "블록체인 기술을 사용하여 분산 애플리케이션을 만듭니다." },
      "business-analyst": { title: "비즈니스 분석가", description: "비즈니스 프로세스를 분석하고 개선사항을 권장합니다." },
      "project-manager": { title: "프로젝트 매니저", description: "기업 목표 달성을 위한 프로젝트를 계획하고 실행합니다." },
      "marketing-manager": { title: "마케팅 매니저", description: "마케팅 및 홍보 전략을 개발합니다." },
      "graphic-designer": { title: "그래픽 디자이너", description: "커뮤니케이션과 마케팅을 위한 시각적 요소를 만듭니다." },
      "video-editor": { title: "비디오 에디터", description: "전문 비디오 콘텐츠를 편집하고 제작합니다." },
      "photographer": { title: "사진작가", description: "다양한 목적으로 이미지를 촬영합니다." },
      "civil-engineer": { title: "토목 엔지니어", description: "인프라 프로젝트를 설계하고 감독합니다." },
      "mechanical-engineer": { title: "기계 엔지니어", description: "기계 시스템과 기계를 설계합니다." },
      "electrical-engineer": { title: "전기 엔지니어", description: "전기 및 전자 시스템을 설계합니다." },
      "police-officer": { title: "경찰관", description: "공공 질서와 시민 안전을 유지합니다." }
    },
    skills: {
      'Communication': '커뮤니케이션',
      'Leadership': '리더십',
      'Problem Solving': '문제 해결',
      'Teamwork': '팀워크',
      'Analytical Thinking': '분석적 사고',
      'Creativity': '창의성',
      'Adaptability': '적응성',
      'Time Management': '시간 관리',
      'Project Management': '프로젝트 관리',
      'Critical Thinking': '비판적 사고',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': '머신러닝',
      'Data Analysis': '데이터 분석',
      'UI/UX Design': 'UI/UX 디자인',
      'Agile Development': '애자일 개발',
      'DevOps': 'DevOps'
    }
  },

  // Chinese (Simplified) translations
  zh: {
    careers: {
      "ai-engineer": { title: "AI工程师", description: "开发人工智能系统和机器学习。" },
      "data-scientist": { title: "数据科学家", description: "分析复杂数据以提取洞察并创建预测模型。" },
      "software-engineer": { title: "软件工程师", description: "设计、开发和维护软件应用程序和系统。" },
      "devops-engineer": { title: "DevOps工程师", description: "自动化软件开发和部署流程。" },
      "cloud-engineer": { title: "云工程师", description: "设计和实施云计算解决方案。" },
      "cybersecurity-analyst": { title: "网络安全分析师", description: "保护计算机系统免受威胁和漏洞。" },
      "blockchain-developer": { title: "区块链开发者", description: "使用区块链技术创建去中心化应用程序。" },
      "business-analyst": { title: "业务分析师", description: "分析业务流程并推荐改进。" },
      "project-manager": { title: "项目经理", description: "规划和执行项目以实现企业目标。" },
      "marketing-manager": { title: "营销经理", description: "制定营销和推广策略。" },
      "graphic-designer": { title: "平面设计师", description: "为沟通和营销创建视觉元素。" },
      "video-editor": { title: "视频编辑", description: "编辑和制作专业视频内容。" },
      "photographer": { title: "摄影师", description: "为各种目的拍摄图像。" },
      "civil-engineer": { title: "土木工程师", description: "设计和监督基础设施项目。" },
      "mechanical-engineer": { title: "机械工程师", description: "设计机械系统和机器。" },
      "electrical-engineer": { title: "电气工程师", description: "设计电气和电子系统。" },
      "police-officer": { title: "警察", description: "维护公共秩序和公民安全。" }
    },
    skills: {
      'Communication': '沟通',
      'Leadership': '领导力',
      'Problem Solving': '问题解决',
      'Teamwork': '团队合作',
      'Analytical Thinking': '分析思维',
      'Creativity': '创造力',
      'Adaptability': '适应性',
      'Time Management': '时间管理',
      'Project Management': '项目管理',
      'Critical Thinking': '批判性思维',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': '机器学习',
      'Data Analysis': '数据分析',
      'UI/UX Design': 'UI/UX设计',
      'Agile Development': '敏捷开发',
      'DevOps': 'DevOps'
    }
  },

  // Russian translations
  ru: {
    careers: {
      "ai-engineer": { title: "Инженер ИИ", description: "Разрабатывает системы искусственного интеллекта и машинного обучения." },
      "data-scientist": { title: "Специалист по данным", description: "Анализирует сложные данные для извлечения инсайтов и создания прогнозных моделей." },
      "software-engineer": { title: "Инженер-программист", description: "Проектирует, разрабатывает и поддерживает программные приложения и системы." },
      "devops-engineer": { title: "DevOps-инженер", description: "Автоматизирует процессы разработки и развертывания программного обеспечения." },
      "cloud-engineer": { title: "Облачный инженер", description: "Проектирует и внедряет решения облачных вычислений." },
      "cybersecurity-analyst": { title: "Аналитик кибербезопасности", description: "Защищает компьютерные системы от угроз и уязвимостей." },
      "blockchain-developer": { title: "Разработчик блокчейна", description: "Создает децентрализованные приложения с использованием технологии блокчейна." },
      "business-analyst": { title: "Бизнес-аналитик", description: "Анализирует бизнес-процессы и рекомендует улучшения." },
      "project-manager": { title: "Менеджер проектов", description: "Планирует и выполняет проекты для достижения корпоративных целей." },
      "marketing-manager": { title: "Маркетинг-менеджер", description: "Разрабатывает стратегии маркетинга и продвижения." },
      "graphic-designer": { title: "Графический дизайнер", description: "Создает визуальные элементы для коммуникации и маркетинга." },
      "video-editor": { title: "Видеомонтажер", description: "Редактирует и производит профессиональный видеоконтент." },
      "photographer": { title: "Фотограф", description: "Снимает изображения для различных целей." },
      "civil-engineer": { title: "Инженер-строитель", description: "Проектирует и контролирует инфраструктурные проекты." },
      "mechanical-engineer": { title: "Инженер-механик", description: "Проектирует механические системы и машины." },
      "electrical-engineer": { title: "Инженер-электрик", description: "Проектирует электрические и электронные системы." },
      "police-officer": { title: "Полицейский", description: "Поддерживает общественный порядок и безопасность граждан." }
    },
    skills: {
      'Communication': 'Коммуникация',
      'Leadership': 'Лидерство',
      'Problem Solving': 'Решение проблем',
      'Teamwork': 'Командная работа',
      'Analytical Thinking': 'Аналитическое мышление',
      'Creativity': 'Креативность',
      'Adaptability': 'Адаптивность',
      'Time Management': 'Управление временем',
      'Project Management': 'Управление проектами',
      'Critical Thinking': 'Критическое мышление',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': 'Машинное обучение',
      'Data Analysis': 'Анализ данных',
      'UI/UX Design': 'UI/UX дизайн',
      'Agile Development': 'Гибкая разработка',
      'DevOps': 'DevOps'
    }
  },

  // Arabic translations
  ar: {
    careers: {
      "ai-engineer": { title: "مهندس الذكاء الاصطناعي", description: "يطور أنظمة الذكاء الاصطناعي والتعلم الآلي." },
      "data-scientist": { title: "عالم البيانات", description: "يحلل البيانات المعقدة لاستخراج الرؤى وإنشاء النماذج التنبؤية." },
      "software-engineer": { title: "مهندس البرمجيات", description: "يصمم ويطور ويحافظ على تطبيقات وأنظمة البرمجيات." },
      "devops-engineer": { title: "مهندس DevOps", description: "يؤتمت عمليات تطوير ونشر البرمجيات." },
      "cloud-engineer": { title: "مهندس السحابة", description: "يصمم وينفذ حلول الحوسبة السحابية." },
      "cybersecurity-analyst": { title: "محلل الأمن السيبراني", description: "يحمي أنظمة الكمبيوتر من التهديدات والثغرات الأمنية." },
      "blockchain-developer": { title: "مطور البلوك تشين", description: "ينشئ تطبيقات لامركزية باستخدام تقنية البلوك تشين." },
      "business-analyst": { title: "محلل الأعمال", description: "يحلل عمليات الأعمال ويوصي بالتحسينات." },
      "project-manager": { title: "مدير المشاريع", description: "يخطط وينفذ المشاريع لتحقيق الأهداف المؤسسية." },
      "marketing-manager": { title: "مدير التسويق", description: "يطور استراتيجيات التسويق والترويج." },
      "graphic-designer": { title: "مصمم جرافيك", description: "ينشئ عناصر بصرية للتواصل والتسويق." },
      "video-editor": { title: "محرر الفيديو", description: "يحرر وينتج محتوى فيديو احترافي." },
      "photographer": { title: "مصور", description: "يلتقط الصور لأغراض متنوعة." },
      "civil-engineer": { title: "مهندس مدني", description: "يصمم ويشرف على مشاريع البنية التحتية." },
      "mechanical-engineer": { title: "مهندس ميكانيكي", description: "يصمم الأنظمة والآلات الميكانيكية." },
      "electrical-engineer": { title: "مهندس كهربائي", description: "يصمم الأنظمة الكهربائية والإلكترونية." },
      "police-officer": { title: "ضابط شرطة", description: "يحافظ على النظام العام وأمان المواطنين." }
    },
    skills: {
      'Communication': 'التواصل',
      'Leadership': 'القيادة',
      'Problem Solving': 'حل المشاكل',
      'Teamwork': 'العمل الجماعي',
      'Analytical Thinking': 'التفكير التحليلي',
      'Creativity': 'الإبداع',
      'Adaptability': 'القدرة على التكيف',
      'Time Management': 'إدارة الوقت',
      'Project Management': 'إدارة المشاريع',
      'Critical Thinking': 'التفكير النقدي',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': 'التعلم الآلي',
      'Data Analysis': 'تحليل البيانات',
      'UI/UX Design': 'تصميم UI/UX',
      'Agile Development': 'التطوير الرشيق',
      'DevOps': 'DevOps'
    }
  },

  // Italian translations
  it: {
    careers: {
      "ai-engineer": { title: "Ingegnere AI", description: "Sviluppa sistemi di intelligenza artificiale e machine learning." },
      "data-scientist": { title: "Scienziato dei Dati", description: "Analizza dati complessi per estrarre insights e creare modelli predittivi." },
      "software-engineer": { title: "Ingegnere del Software", description: "Progetta, sviluppa e mantiene applicazioni e sistemi software." },
      "devops-engineer": { title: "Ingegnere DevOps", description: "Automatizza i processi di sviluppo e deployment del software." },
      "cloud-engineer": { title: "Ingegnere Cloud", description: "Progetta e implementa soluzioni di cloud computing." },
      "cybersecurity-analyst": { title: "Analista di Cybersicurezza", description: "Protegge i sistemi informatici da minacce e vulnerabilità." },
      "blockchain-developer": { title: "Sviluppatore Blockchain", description: "Crea applicazioni decentralizzate utilizzando la tecnologia blockchain." },
      "business-analyst": { title: "Analista di Business", description: "Analizza i processi aziendali e raccomanda miglioramenti." },
      "project-manager": { title: "Project Manager", description: "Pianifica ed esegue progetti per raggiungere obiettivi aziendali." },
      "marketing-manager": { title: "Marketing Manager", description: "Sviluppa strategie di marketing e promozione." },
      "graphic-designer": { title: "Grafico", description: "Crea elementi visivi per comunicazione e marketing." },
      "video-editor": { title: "Editor Video", description: "Monta e produce contenuti video professionali." },
      "photographer": { title: "Fotografo", description: "Cattura immagini per vari scopi." },
      "civil-engineer": { title: "Ingegnere Civile", description: "Progetta e supervisiona progetti di infrastrutture." },
      "mechanical-engineer": { title: "Ingegnere Meccanico", description: "Progetta sistemi e macchine meccaniche." },
      "electrical-engineer": { title: "Ingegnere Elettrico", description: "Progetta sistemi elettrici ed elettronici." },
      "police-officer": { title: "Agente di Polizia", description: "Mantiene l'ordine pubblico e la sicurezza dei cittadini." }
    },
    skills: {
      'Communication': 'Comunicazione',
      'Leadership': 'Leadership',
      'Problem Solving': 'Risoluzione Problemi',
      'Teamwork': 'Lavoro di Squadra',
      'Analytical Thinking': 'Pensiero Analitico',
      'Creativity': 'Creatività',
      'Adaptability': 'Adattabilità',
      'Time Management': 'Gestione del Tempo',
      'Project Management': 'Gestione Progetti',
      'Critical Thinking': 'Pensiero Critico',
      'JavaScript': 'JavaScript',
      'Python': 'Python',
      'Java': 'Java',
      'React': 'React',
      'Node.js': 'Node.js',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'Docker': 'Docker',
      'Machine Learning': 'Machine Learning',
      'Data Analysis': 'Analisi Dati',
      'UI/UX Design': 'Design UI/UX',
      'Agile Development': 'Sviluppo Agile',
      'DevOps': 'DevOps'
    }
  }
};

async function populateAllLanguageTranslations() {
  console.log('🌍 Starting comprehensive multilingual translations population...');

  try {
    // Process each language
    for (const [languageCode, translations] of Object.entries(allLanguageTranslations)) {
      console.log(`\n📝 Processing ${languageCode.toUpperCase()} translations...`);
      
      // Add career translations
      if (translations.careers) {
        console.log(`💼 Adding ${Object.keys(translations.careers).length} career translations for ${languageCode}...`);
        for (const [careerId, translation] of Object.entries(translations.careers)) {
          const { error } = await supabase
            .from('career_translations')
            .upsert({
              career_id: careerId,
              language_code: languageCode,
              title: translation.title,
              description: translation.description,
              skills: [],
              job_titles: [],
              certifications: []
            }, {
              onConflict: 'career_id,language_code'
            });

          if (error) {
            console.error(`❌ Error inserting ${languageCode} translation for ${careerId}:`, error.message);
          } else {
            console.log(`✅ ${languageCode}: ${translation.title}`);
          }
        }
      }

      // Add skill translations
      if (translations.skills) {
        console.log(`🛠️ Adding ${Object.keys(translations.skills).length} skill translations for ${languageCode}...`);
        for (const [skillKey, skillName] of Object.entries(translations.skills)) {
          const { error } = await supabase
            .from('skill_translations')
            .upsert({
              skill_key: skillKey.toLowerCase().replace(/\s+/g, '_'),
              language_code: languageCode,
              skill_name: skillName,
              skill_category: getSkillCategory(skillKey)
            }, {
              onConflict: 'skill_key,language_code'
            });

          if (error) {
            console.error(`❌ Error inserting skill translation ${skillKey} (${languageCode}):`, error.message);
          } else {
            console.log(`✅ Skill: ${skillName} (${languageCode})`);
          }
        }
      }
    }

    console.log('\n✅ Comprehensive multilingual translations population completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${Object.keys(allLanguageTranslations).length} languages processed`);
    console.log(`   - ${Object.keys(allLanguageTranslations.fr.careers).length} careers per language`);
    console.log(`   - ${Object.keys(allLanguageTranslations.fr.skills).length} skills per language`);
    console.log(`   - Total: ${Object.keys(allLanguageTranslations).length * Object.keys(allLanguageTranslations.fr.careers).length} career translations`);
    console.log(`   - Total: ${Object.keys(allLanguageTranslations).length * Object.keys(allLanguageTranslations.fr.skills).length} skill translations`);

  } catch (error) {
    console.error('❌ Error during multilingual translations population:', error);
  }
}

function getSkillCategory(skillKey) {
  const categories = {
    'Communication': 'Soft Skills',
    'Leadership': 'Soft Skills',
    'Problem Solving': 'Soft Skills',
    'Teamwork': 'Soft Skills',
    'Analytical Thinking': 'Soft Skills',
    'Creativity': 'Soft Skills',
    'Adaptability': 'Soft Skills',
    'Time Management': 'Soft Skills',
    'Project Management': 'Management',
    'Critical Thinking': 'Soft Skills',
    'JavaScript': 'Programming',
    'Python': 'Programming',
    'Java': 'Programming',
    'React': 'Frontend',
    'Node.js': 'Backend',
    'SQL': 'Database',
    'Git': 'Version Control',
    'AWS': 'Cloud',
    'Docker': 'DevOps',
    'Machine Learning': 'AI/ML',
    'Data Analysis': 'Analytics',
    'UI/UX Design': 'Design',
    'Agile Development': 'Methodology',
    'DevOps': 'DevOps'
  };
  return categories[skillKey] || 'General';
}

// Run the comprehensive population
populateAllLanguageTranslations();
