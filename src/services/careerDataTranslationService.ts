import { ICareerNode } from '@/types/career';

// Career data translation mappings
const CAREER_TRANSLATIONS = {
  en: {
    // Skills translations
    skills: {
      'JavaScript': 'JavaScript',
      'React': 'React',
      'Node.js': 'Node.js',
      'Python': 'Python',
      'Java': 'Java',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'HTML': 'HTML',
      'CSS': 'CSS',
      'TypeScript': 'TypeScript',
      'Docker': 'Docker',
      'Kubernetes': 'Kubernetes',
      'Machine Learning': 'Machine Learning',
      'Data Analysis': 'Data Analysis',
      'Project Management': 'Project Management',
      'Leadership': 'Leadership',
      'Communication': 'Communication',
      'Problem Solving': 'Problem Solving',
      'Teamwork': 'Teamwork'
    },
    // Job titles translations
    jobTitles: {
      'Software Engineer': 'Software Engineer',
      'Developer': 'Developer',
      'Data Scientist': 'Data Scientist',
      'Product Manager': 'Product Manager',
      'Designer': 'Designer',
      'Analyst': 'Analyst',
      'Consultant': 'Consultant',
      'Manager': 'Manager',
      'Director': 'Director',
      'Specialist': 'Specialist',
      'Coordinator': 'Coordinator',
      'Assistant': 'Assistant',
      'Intern': 'Intern',
      'Trainee': 'Trainee'
    },
    // Career titles translations
    careerTitles: {
      'Junior Developer': 'Junior Developer',
      'Mid-Level Developer': 'Mid-Level Developer',
      'Senior Developer': 'Senior Developer',
      'Lead Developer': 'Lead Developer',
      'Full Stack Developer': 'Full Stack Developer',
      'Frontend Developer': 'Frontend Developer',
      'Backend Developer': 'Backend Developer',
      'DevOps Engineer': 'DevOps Engineer',
      'Data Engineer': 'Data Engineer',
      'Machine Learning Engineer': 'Machine Learning Engineer',
      'UI/UX Designer': 'UI/UX Designer',
      'Product Designer': 'Product Designer',
      'Marketing Manager': 'Marketing Manager',
      'Sales Manager': 'Sales Manager',
      'Business Analyst': 'Business Analyst',
      'Financial Analyst': 'Financial Analyst'
    },
    // Descriptions translations
    descriptions: {
      'Entry-level position focused on building and maintaining websites under supervision.': 'Entry-level position focused on building and maintaining websites under supervision.',
      'Builds complex web applications and mentors junior developers.': 'Builds complex web applications and mentors junior developers.',
      'Leads development teams and makes high-level architectural decisions.': 'Leads development teams and makes high-level architectural decisions.',
      'Manages entire product lifecycle and coordinates cross-functional teams.': 'Manages entire product lifecycle and coordinates cross-functional teams.',
      'Creates user interfaces and experiences for digital products.': 'Creates user interfaces and experiences for digital products.',
      'Analyzes business processes and recommends improvements.': 'Analyzes business processes and recommends improvements.'
    }
  },
  es: {
    skills: {
      'JavaScript': 'JavaScript',
      'React': 'React',
      'Node.js': 'Node.js',
      'Python': 'Python',
      'Java': 'Java',
      'SQL': 'SQL',
      'Git': 'Git',
      'AWS': 'AWS',
      'HTML': 'HTML',
      'CSS': 'CSS',
      'TypeScript': 'TypeScript',
      'Docker': 'Docker',
      'Kubernetes': 'Kubernetes',
      'Machine Learning': 'Aprendizaje Automático',
      'Data Analysis': 'Análisis de Datos',
      'Project Management': 'Gestión de Proyectos',
      'Leadership': 'Liderazgo',
      'Communication': 'Comunicación',
      'Problem Solving': 'Resolución de Problemas',
      'Teamwork': 'Trabajo en Equipo'
    },
    jobTitles: {
      'Software Engineer': 'Ingeniero de Software',
      'Developer': 'Desarrollador',
      'Data Scientist': 'Científico de Datos',
      'Product Manager': 'Gerente de Producto',
      'Designer': 'Diseñador',
      'Analyst': 'Analista',
      'Consultant': 'Consultor',
      'Manager': 'Gerente',
      'Director': 'Director',
      'Specialist': 'Especialista',
      'Coordinator': 'Coordinador',
      'Assistant': 'Asistente',
      'Intern': 'Pasante',
      'Trainee': 'Aprendiz'
    },
    careerTitles: {
      'Junior Developer': 'Desarrollador Junior',
      'Mid-Level Developer': 'Desarrollador de Nivel Medio',
      'Senior Developer': 'Desarrollador Senior',
      'Lead Developer': 'Desarrollador Líder',
      'Full Stack Developer': 'Desarrollador Full Stack',
      'Frontend Developer': 'Desarrollador Frontend',
      'Backend Developer': 'Desarrollador Backend',
      'DevOps Engineer': 'Ingeniero DevOps',
      'Data Engineer': 'Ingeniero de Datos',
      'Machine Learning Engineer': 'Ingeniero de Aprendizaje Automático',
      'UI/UX Designer': 'Diseñador UI/UX',
      'Product Designer': 'Diseñador de Producto',
      'Marketing Manager': 'Gerente de Marketing',
      'Sales Manager': 'Gerente de Ventas',
      'Business Analyst': 'Analista de Negocios',
      'Financial Analyst': 'Analista Financiero'
    },
    descriptions: {
      'Entry-level position focused on building and maintaining websites under supervision.': 'Posición de nivel de entrada enfocada en construir y mantener sitios web bajo supervisión.',
      'Builds complex web applications and mentors junior developers.': 'Construye aplicaciones web complejas y orienta a desarrolladores junior.',
      'Leads development teams and makes high-level architectural decisions.': 'Lidera equipos de desarrollo y toma decisiones arquitectónicas de alto nivel.',
      'Manages entire product lifecycle and coordinates cross-functional teams.': 'Gestiona todo el ciclo de vida del producto y coordina equipos multifuncionales.',
      'Creates user interfaces and experiences for digital products.': 'Crea interfaces de usuario y experiencias para productos digitales.',
      'Analyzes business processes and recommends improvements.': 'Analiza procesos de negocio y recomienda mejoras.'
    }
  }
};

export class CareerDataTranslationService {
  private static instance: CareerDataTranslationService;
  private currentLanguage: string = 'en';

  private constructor() {}

  public static getInstance(): CareerDataTranslationService {
    if (!CareerDataTranslationService.instance) {
      CareerDataTranslationService.instance = new CareerDataTranslationService();
    }
    return CareerDataTranslationService.instance;
  }

  public setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  public translateCareerNode(careerNode: ICareerNode): ICareerNode {
    const translations = CAREER_TRANSLATIONS[this.currentLanguage as keyof typeof CAREER_TRANSLATIONS] || CAREER_TRANSLATIONS.en;
    
    return {
      ...careerNode,
      t: this.translateCareerTitle(careerNode.t),
      d: this.translateDescription(careerNode.d),
      s: careerNode.s.map(skill => this.translateSkill(skill)),
      jt: careerNode.jt.map(title => this.translateJobTitle(title)),
      c: careerNode.c.map(cert => this.translateCertification(cert)),
      r: {
        ...careerNode.r,
        e: careerNode.r.e.map(edu => this.translateEducation(edu)),
        sk: careerNode.r.sk.map(skill => this.translateSkill(skill))
      }
    };
  }

  private translateCareerTitle(title: string): string {
    const translations = CAREER_TRANSLATIONS[this.currentLanguage as keyof typeof CAREER_TRANSLATIONS] || CAREER_TRANSLATIONS.en;
    return translations.careerTitles[title as keyof typeof translations.careerTitles] || title;
  }

  private translateJobTitle(title: string): string {
    const translations = CAREER_TRANSLATIONS[this.currentLanguage as keyof typeof CAREER_TRANSLATIONS] || CAREER_TRANSLATIONS.en;
    return translations.jobTitles[title as keyof typeof translations.jobTitles] || title;
  }

  private translateSkill(skill: string): string {
    const translations = CAREER_TRANSLATIONS[this.currentLanguage as keyof typeof CAREER_TRANSLATIONS] || CAREER_TRANSLATIONS.en;
    return translations.skills[skill as keyof typeof translations.skills] || skill;
  }

  private translateDescription(description: string): string {
    const translations = CAREER_TRANSLATIONS[this.currentLanguage as keyof typeof CAREER_TRANSLATIONS] || CAREER_TRANSLATIONS.en;
    return translations.descriptions[description as keyof typeof translations.descriptions] || description;
  }

  private translateCertification(cert: string): string {
    // For now, return as-is since certifications are often in English
    // Could be expanded with certification translations
    return cert;
  }

  private translateEducation(edu: string): string {
    // For now, return as-is since education terms are often standardized
    // Could be expanded with education translations
    return edu;
  }

  public translateCareerArray(careers: ICareerNode[]): ICareerNode[] {
    return careers.map(career => this.translateCareerNode(career));
  }
}

export default CareerDataTranslationService;
