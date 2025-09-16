import React, { memo, useMemo, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, TrendingUp, Users, Target, ChevronDown, Star } from "lucide-react";
import { ICareerNode, CareerLevel } from "@/types/career";
import { smartCareerCacheService } from "@/services/smartCareerCacheService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CareerTransitionSuggestionsProps {
  currentCareer: ICareerNode;
  onCareerSelect?: (careerId: string) => void;
  onCareerSelection?: (career: ICareerNode, type: 'nextGoal' | 'target') => void;
  targetCareer?: ICareerNode | null;
  nextCareerGoal?: ICareerNode | null;
}

const CareerTransitionSuggestions: React.FC<CareerTransitionSuggestionsProps> = memo(({ 
  currentCareer, 
  onCareerSelect,
  onCareerSelection,
  targetCareer,
  nextCareerGoal
}) => {
  const { t } = useTranslation();
  const [allCareers, setAllCareers] = useState<ICareerNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        setLoading(true);
        // Use smart caching service to load careers
        const careers = await smartCareerCacheService.getCareers({
          limit: 100 // Load more careers for better suggestions
        });
        setAllCareers(careers);
      } catch (error) {
        console.error('Failed to load careers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCareers();
  }, []);

  const getLevelDisplayName = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return t('pages.search.entryLevel');
      case 'I': return t('pages.search.intermediate');
      case 'A': return t('pages.search.advanced');
      case 'X': return t('pages.search.expert');
      default: return t('common.unknown');
    }
  }, [t]);


  // Generate real transition suggestions based on actual career data
  const transitionSuggestions = useMemo(() => {
    if (loading || allCareers.length === 0) return [];

    console.log('Total careers loaded:', allCareers.length);
    console.log('Current career:', currentCareer);
    console.log('Target career:', targetCareer);

    const suggestions = [];
    
    // Helper function to check if career makes logical sense as next step
    const isLogicalNextStep = (career: ICareerNode, targetType: 'nextGoal' | 'target') => {
      // For next goal: should be same level or one level up
      if (targetType === 'nextGoal') {
        const currentLevel = currentCareer.l;
        const careerLevel = career.l;
        
        // Allow same level (lateral move) or one level up
        if (currentLevel === 'E' && careerLevel === 'I') return true; // Entry to Intermediate
        if (currentLevel === 'I' && careerLevel === 'A') return true; // Intermediate to Advanced
        if (currentLevel === 'A' && careerLevel === 'X') return true; // Advanced to Expert
        if (currentLevel === careerLevel) return true; // Same level (lateral)
        
        return false;
      }
      
      // For target career: should be at least one level up from current
      if (targetType === 'target') {
        const currentLevel = currentCareer.l;
        const careerLevel = career.l;
        
        // Target should be higher level than current
        if (currentLevel === 'E' && (careerLevel === 'I' || careerLevel === 'A' || careerLevel === 'X')) return true;
        if (currentLevel === 'I' && (careerLevel === 'A' || careerLevel === 'X')) return true;
        if (currentLevel === 'A' && careerLevel === 'X') return true;
        
        return false;
      }
      
      return false;
    };

    // Game-like filtering: Check if a career is a valid step toward the target career
    const isStepTowardTarget = (career: ICareerNode) => {
      if (!targetCareer) return true; // No target set, show all valid options
      
      const currentLevel = currentCareer.l;
      const careerLevel = career.l;
      const targetLevel = targetCareer.l;
      
      // If target is set, next step should be closer to target level
      const levelHierarchy = { 'E': 1, 'I': 2, 'A': 3, 'X': 4 };
      const currentLevelNum = levelHierarchy[currentLevel as keyof typeof levelHierarchy];
      const careerLevelNum = levelHierarchy[careerLevel as keyof typeof levelHierarchy];
      const targetLevelNum = levelHierarchy[targetLevel as keyof typeof levelHierarchy];
      
      // Next step should be between current and target levels
      if (targetLevelNum > currentLevelNum) {
        // Moving up: next step should be current level or one level up, but not beyond target
        return careerLevelNum >= currentLevelNum && careerLevelNum <= targetLevelNum;
      } else if (targetLevelNum < currentLevelNum) {
        // Moving down: next step should be current level or one level down, but not beyond target
        return careerLevelNum <= currentLevelNum && careerLevelNum >= targetLevelNum;
      } else {
        // Same level: allow lateral moves
        return careerLevelNum === currentLevelNum;
      }
    };

    // Check if career is "locked" (not available due to target career constraints)
    const isCareerLocked = (career: ICareerNode) => {
      if (!targetCareer) return false; // No target set, nothing is locked
      
      // If target is set, lock careers that don't lead toward the target
      return !isStepTowardTarget(career);
    };
    
    // Helper function to check if career is relevant to current career
    const isRelevantCareer = (career: ICareerNode) => {
      const currentSkills = currentCareer.s || [];
      const careerSkills = career.s || [];
      
      // Check for skill overlap
      const skillMatches = careerSkills.filter(skill => 
        currentSkills.some(currentSkill => 
          currentSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(currentSkill.toLowerCase())
        )
      );
      
      // Check for industry-related keywords
      const getIndustryKeywords = (title: string, description: string) => {
        const text = `${title} ${description}`.toLowerCase();
        const industries = {
          tech: ['developer', 'engineer', 'programmer', 'software', 'tech', 'it', 'data', 'analyst', 'designer', 'architect', 'manager', 'lead', 'senior', 'full stack', 'frontend', 'backend', 'mobile', 'web', 'cloud', 'devops', 'qa', 'test', 'cyber', 'security'],
          healthcare: ['nurse', 'doctor', 'physician', 'medical', 'healthcare', 'clinical', 'therapist', 'pharmacist', 'dentist', 'veterinary', 'health', 'care', 'patient', 'hospital'],
          finance: ['financial', 'banking', 'accounting', 'finance', 'investment', 'analyst', 'advisor', 'broker', 'auditor', 'treasurer', 'controller', 'cfo', 'economist'],
          business: ['manager', 'director', 'executive', 'business', 'operations', 'strategy', 'consultant', 'analyst', 'coordinator', 'specialist', 'supervisor', 'lead'],
          education: ['teacher', 'professor', 'educator', 'instructor', 'trainer', 'curriculum', 'academic', 'student', 'learning', 'education', 'school', 'university'],
          marketing: ['marketing', 'advertising', 'promotion', 'brand', 'social media', 'content', 'digital', 'campaign', 'public relations', 'communications'],
          sales: ['sales', 'account', 'representative', 'business development', 'revenue', 'client', 'customer', 'relationship', 'territory'],
          creative: ['designer', 'artist', 'creative', 'graphic', 'visual', 'content', 'writer', 'editor', 'photographer', 'video', 'media'],
          legal: ['lawyer', 'attorney', 'legal', 'paralegal', 'counsel', 'judge', 'court', 'litigation', 'compliance'],
          engineering: ['engineer', 'mechanical', 'electrical', 'civil', 'chemical', 'aerospace', 'industrial', 'systems', 'project'],
          science: ['scientist', 'researcher', 'laboratory', 'chemistry', 'biology', 'physics', 'research', 'development', 'analysis'],
          trades: ['technician', 'mechanic', 'electrician', 'plumber', 'carpenter', 'welder', 'construction', 'maintenance', 'repair'],
          hospitality: ['hotel', 'restaurant', 'tourism', 'hospitality', 'chef', 'server', 'bartender', 'concierge', 'event'],
          transportation: ['driver', 'pilot', 'logistics', 'shipping', 'delivery', 'transportation', 'fleet', 'dispatch'],
          manufacturing: ['production', 'manufacturing', 'assembly', 'quality', 'supervisor', 'operator', 'machinist', 'fabrication']
        };
        
        const matchedIndustries = Object.entries(industries).filter(([_, keywords]) =>
          keywords.some(keyword => text.includes(keyword))
        );
        
        return matchedIndustries.map(([industry, _]) => industry);
      };
      
      const currentIndustries = getIndustryKeywords(currentCareer.t, currentCareer.d);
      const careerIndustries = getIndustryKeywords(career.t, career.d);
      
      // Check if careers share any industry
      const hasIndustryOverlap = currentIndustries.some(industry => 
        careerIndustries.includes(industry)
      );
      
      // If careers are in the same industry, they're relevant
      if (hasIndustryOverlap) {
        return true;
      }
      
      // If no industry overlap, require significant skill overlap
      if (skillMatches.length >= 2) {
        return true;
      }
      
      // Allow careers with at least one skill match if they're at appropriate levels
      return skillMatches.length > 0;
    };

    // Same level careers (lateral moves) - only for next goal
    const sameLevelCareers = allCareers
      .filter(career => 
        career.l === currentCareer.l && 
        career.id !== currentCareer.id &&
        isLogicalNextStep(career, 'nextGoal') &&
        isStepTowardTarget(career) &&
        isRelevantCareer(career)
      )
      .slice(0, 6); // Show more options
    
    console.log('Same level careers found:', sameLevelCareers.length);
    
    if (sameLevelCareers.length > 0) {
      suggestions.push({
        id: 'lateral-move',
        title: t('pages.roadmap.lateralCareerMove'),
        description: t('pages.roadmap.exploreSimilarRoles'),
        careers: sameLevelCareers.map(career => ({
          id: career.id,
          title: career.t,
          industry: t('common.various'),
          level: career.l,
          salary: career.sr || t('common.salaryNotSpecified'),
          canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
          canBeTarget: isLogicalNextStep(career, 'target')
        })),
        icon: <ArrowRight className="h-4 w-4" />,
        color: 'border-muted bg-muted/50 dark:border-muted dark:bg-muted/30'
      });
    }

    // Next level up careers
    if (currentCareer.l !== 'X') {
      const nextLevel = currentCareer.l === 'E' ? 'I' : currentCareer.l === 'I' ? 'A' : 'X';
      const nextLevelCareers = allCareers
        .filter(career => 
          career.l === nextLevel &&
          isLogicalNextStep(career, 'nextGoal') &&
          isStepTowardTarget(career) &&
          isRelevantCareer(career)
        )
        .slice(0, 6); // Show more options
      
      console.log('Next level careers found:', nextLevelCareers.length, 'for level:', nextLevel);
      
      if (nextLevelCareers.length > 0) {
        suggestions.push({
          id: 'level-up',
          title: t('pages.roadmap.levelUpYourCareer'),
          description: t('pages.roadmap.advanceToNextLevel'),
          careers: nextLevelCareers.map(career => ({
            id: career.id,
            title: career.t,
            industry: 'Various',
            level: career.l,
            salary: career.sr || 'Salary not specified',
            canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
            canBeTarget: isLogicalNextStep(career, 'target')
          })),
          icon: <TrendingUp className="h-4 w-4" />,
          color: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
        });
      }
    }

    // Skill-based transitions (careers with similar skills)
    const skillBasedCareers = allCareers
      .filter(career => {
        if (career.id === currentCareer.id || !career.s || !currentCareer.s) return false;
        // Find careers that share at least one skill AND make logical sense AND lead toward target AND are relevant
        const hasSharedSkills = career.s.some(skill => currentCareer.s?.includes(skill));
        const isLogical = isLogicalNextStep(career, 'nextGoal') || isLogicalNextStep(career, 'target');
        const leadsToTarget = isStepTowardTarget(career);
        const isRelevant = isRelevantCareer(career);
        return hasSharedSkills && isLogical && leadsToTarget && isRelevant;
      })
      .slice(0, 6); // Show more options
    
    console.log('Skill-based careers found:', skillBasedCareers.length);
    
    if (skillBasedCareers.length > 0) {
      suggestions.push({
        id: 'skill-transition',
        title: t('pages.roadmap.skillBasedTransitions'),
        description: t('pages.roadmap.leverageCurrentSkills'),
        careers: skillBasedCareers.map(career => ({
          id: career.id,
          title: career.t,
          industry: t('common.various'),
          level: career.l,
          salary: career.sr || t('common.salaryNotSpecified'),
          canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
          canBeTarget: isLogicalNextStep(career, 'target')
        })),
        icon: <Target className="h-4 w-4" />,
        color: 'border-muted bg-muted/50 dark:border-muted dark:bg-muted/30'
      });
    }

    console.log('Total suggestions generated:', suggestions.length);
    console.log('Suggestions:', suggestions.map(s => ({ id: s.id, title: s.title, count: s.careers.length })));

    // Always add curated tech career suggestions as a fallback to ensure we have options
    // This ensures users always see relevant career options even if database filtering is too restrictive
    
    // Check if we need to add more suggestions
    const hasLateralMove = suggestions.some(s => s.id === 'lateral-move');
    const hasLevelUp = suggestions.some(s => s.id === 'level-up');
    const hasSkillBased = suggestions.some(s => s.id === 'skill-transition');
      const curatedCareers = [
        // Tech Careers
        {
          id: 'senior-dev',
          t: 'Senior Software Developer',
          l: 'A' as CareerLevel,
          s: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'Agile', 'Leadership'],
          sr: '$90,000 - $120,000',
          te: '5-8 years',
          d: 'Lead development projects and mentor junior developers',
          jt: ['Senior Developer', 'Lead Developer', 'Technical Lead'],
          c: ['AWS Certified Solutions Architect', 'Scrum Master'],
          r: {
            e: ['Bachelor\'s in Computer Science or related field'],
            exp: '5-8 years of software development experience',
            sk: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'Agile', 'Leadership', 'Mentoring']
          }
        },
        {
          id: 'full-stack-dev',
          t: 'Full Stack Developer',
          l: 'I' as CareerLevel,
          s: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'MongoDB'],
          sr: '$75,000 - $95,000',
          te: '3-5 years',
          d: 'Develop both frontend and backend applications',
          jt: ['Full Stack Developer', 'Web Developer', 'Software Engineer'],
          c: ['Full Stack Web Development Certification'],
          r: {
            e: ['Bachelor\'s in Computer Science or related field'],
            exp: '3-5 years of full-stack development experience',
            sk: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'MongoDB', 'REST APIs']
          }
        },
        // Healthcare Careers
        {
          id: 'senior-nurse',
          t: 'Senior Registered Nurse',
          l: 'A' as CareerLevel,
          s: ['Patient Care', 'Medical Knowledge', 'Leadership', 'Critical Thinking', 'Communication'],
          sr: '$70,000 - $90,000',
          te: '5-8 years',
          d: 'Lead nursing teams and provide advanced patient care',
          jt: ['Senior Nurse', 'Charge Nurse', 'Nurse Supervisor'],
          c: ['RN License', 'BLS Certification', 'ACLS Certification'],
          r: {
            e: ['Bachelor\'s in Nursing (BSN)'],
            exp: '5-8 years of nursing experience',
            sk: ['Patient Care', 'Medical Knowledge', 'Leadership', 'Critical Thinking', 'Communication', 'Team Management']
          }
        },
        {
          id: 'nurse-practitioner',
          t: 'Nurse Practitioner',
          l: 'A' as CareerLevel,
          s: ['Advanced Practice', 'Diagnosis', 'Treatment', 'Patient Care', 'Medical Knowledge'],
          sr: '$95,000 - $120,000',
          te: '6-10 years',
          d: 'Provide advanced healthcare services and primary care',
          jt: ['Nurse Practitioner', 'Family Nurse Practitioner', 'Adult Nurse Practitioner'],
          c: ['NP License', 'Master\'s in Nursing', 'Board Certification'],
          r: {
            e: ['Master\'s in Nursing (MSN)'],
            exp: '6-10 years of nursing experience',
            sk: ['Advanced Practice', 'Diagnosis', 'Treatment', 'Patient Care', 'Medical Knowledge']
          }
        },
        // Business Careers
        {
          id: 'senior-manager',
          t: 'Senior Manager',
          l: 'A' as CareerLevel,
          s: ['Leadership', 'Strategy', 'Operations', 'Team Management', 'Communication'],
          sr: '$80,000 - $110,000',
          te: '5-8 years',
          d: 'Lead teams and drive business operations',
          jt: ['Senior Manager', 'Operations Manager', 'Department Manager'],
          c: ['MBA', 'Project Management Certification'],
          r: {
            e: ['Bachelor\'s degree, MBA preferred'],
            exp: '5-8 years of management experience',
            sk: ['Leadership', 'Strategy', 'Operations', 'Team Management', 'Communication', 'Budgeting']
          }
        },
        {
          id: 'business-analyst',
          t: 'Business Analyst',
          l: 'I' as CareerLevel,
          s: ['Analysis', 'Data', 'Process Improvement', 'Communication', 'Problem Solving'],
          sr: '$65,000 - $85,000',
          te: '3-5 years',
          d: 'Analyze business processes and recommend improvements',
          jt: ['Business Analyst', 'Process Analyst', 'Data Analyst'],
          c: ['Business Analysis Certification'],
          r: {
            e: ['Bachelor\'s in Business or related field'],
            exp: '3-5 years of business analysis experience',
            sk: ['Analysis', 'Data', 'Process Improvement', 'Communication', 'Problem Solving', 'Documentation']
          }
        },
        // Finance Careers
        {
          id: 'senior-financial-analyst',
          t: 'Senior Financial Analyst',
          l: 'A' as CareerLevel,
          s: ['Financial Analysis', 'Excel', 'Modeling', 'Reporting', 'Leadership'],
          sr: '$75,000 - $100,000',
          te: '5-8 years',
          d: 'Lead financial analysis and strategic planning',
          jt: ['Senior Financial Analyst', 'Lead Analyst', 'Finance Manager'],
          c: ['CFA', 'CPA', 'MBA'],
          r: {
            e: ['Bachelor\'s in Finance or Accounting'],
            exp: '5-8 years of financial analysis experience',
            sk: ['Financial Analysis', 'Excel', 'Modeling', 'Reporting', 'Leadership', 'Strategic Planning']
          }
        },
        {
          id: 'financial-analyst',
          t: 'Financial Analyst',
          l: 'I' as CareerLevel,
          s: ['Financial Analysis', 'Excel', 'Modeling', 'Reporting', 'Data Analysis'],
          sr: '$60,000 - $80,000',
          te: '3-5 years',
          d: 'Analyze financial data and create reports',
          jt: ['Financial Analyst', 'Investment Analyst', 'Credit Analyst'],
          c: ['CFA Level 1', 'Financial Modeling Certification'],
          r: {
            e: ['Bachelor\'s in Finance or Accounting'],
            exp: '3-5 years of financial analysis experience',
            sk: ['Financial Analysis', 'Excel', 'Modeling', 'Reporting', 'Data Analysis', 'Valuation']
          }
        },
        // Marketing Careers
        {
          id: 'senior-marketing-manager',
          t: 'Senior Marketing Manager',
          l: 'A' as CareerLevel,
          s: ['Marketing Strategy', 'Digital Marketing', 'Leadership', 'Analytics', 'Campaign Management'],
          sr: '$80,000 - $110,000',
          te: '5-8 years',
          d: 'Lead marketing teams and develop strategic campaigns',
          jt: ['Senior Marketing Manager', 'Marketing Director', 'Brand Manager'],
          c: ['Digital Marketing Certification', 'Google Analytics'],
          r: {
            e: ['Bachelor\'s in Marketing or related field'],
            exp: '5-8 years of marketing experience',
            sk: ['Marketing Strategy', 'Digital Marketing', 'Leadership', 'Analytics', 'Campaign Management', 'Brand Management']
          }
        },
        {
          id: 'marketing-specialist',
          t: 'Marketing Specialist',
          l: 'I' as CareerLevel,
          s: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics', 'SEO'],
          sr: '$50,000 - $70,000',
          te: '3-5 years',
          d: 'Execute marketing campaigns and analyze performance',
          jt: ['Marketing Specialist', 'Digital Marketing Specialist', 'Content Marketing Specialist'],
          c: ['Google Ads Certification', 'HubSpot Certification'],
          r: {
            e: ['Bachelor\'s in Marketing or related field'],
            exp: '3-5 years of marketing experience',
            sk: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics', 'SEO', 'Email Marketing']
          }
        },
        // Sales Careers
        {
          id: 'senior-sales-manager',
          t: 'Senior Sales Manager',
          l: 'A' as CareerLevel,
          s: ['Sales Leadership', 'Relationship Building', 'Strategy', 'Team Management', 'Negotiation'],
          sr: '$85,000 - $120,000',
          te: '5-8 years',
          d: 'Lead sales teams and drive revenue growth',
          jt: ['Senior Sales Manager', 'Sales Director', 'Regional Sales Manager'],
          c: ['Sales Management Certification'],
          r: {
            e: ['Bachelor\'s degree'],
            exp: '5-8 years of sales experience',
            sk: ['Sales Leadership', 'Relationship Building', 'Strategy', 'Team Management', 'Negotiation', 'Revenue Growth']
          }
        },
        {
          id: 'account-executive',
          t: 'Account Executive',
          l: 'I' as CareerLevel,
          s: ['Sales', 'Relationship Building', 'Communication', 'Negotiation', 'CRM'],
          sr: '$60,000 - $85,000',
          te: '3-5 years',
          d: 'Manage client relationships and drive sales',
          jt: ['Account Executive', 'Sales Representative', 'Business Development Representative'],
          c: ['Sales Certification'],
          r: {
            e: ['Bachelor\'s degree'],
            exp: '3-5 years of sales experience',
            sk: ['Sales', 'Relationship Building', 'Communication', 'Negotiation', 'CRM', 'Lead Generation']
          }
        }
      ];

      // Filter curated careers based on current career level and relevance
      const relevantCuratedCareers = curatedCareers.filter(career => {
        const isRelevant = isRelevantCareer(career);
        const isLogical = isLogicalNextStep(career, 'nextGoal') || isLogicalNextStep(career, 'target');
        const leadsToTarget = isStepTowardTarget(career);
        return isRelevant && isLogical && leadsToTarget;
      });

      // Always add curated suggestions to ensure we have all types of career transitions
      if (relevantCuratedCareers.length > 0) {
        // Add lateral moves if missing
        if (!hasLateralMove) {
          const lateralCareers = relevantCuratedCareers.filter(career => 
            career.l === currentCareer.l && isLogicalNextStep(career, 'nextGoal')
          );
          if (lateralCareers.length > 0) {
            suggestions.push({
              id: 'lateral-move',
              title: t('pages.roadmap.lateralCareerMove'),
              description: t('pages.roadmap.exploreSimilarRoles'),
              careers: lateralCareers.slice(0, 6).map(career => ({
                id: career.id,
                title: career.t,
                industry: 'Various',
                level: career.l,
                salary: career.sr || 'Salary not specified',
                canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
                canBeTarget: isLogicalNextStep(career, 'target')
              })),
              icon: <ArrowRight className="h-4 w-4" />,
              color: 'border-muted bg-muted/50 dark:border-muted dark:bg-muted/30'
            });
          }
        }

        // Add level up if missing
        if (!hasLevelUp && currentCareer.l !== 'X') {
          const nextLevel = currentCareer.l === 'E' ? 'I' : currentCareer.l === 'I' ? 'A' : 'X';
          const levelUpCareers = relevantCuratedCareers.filter(career => 
            career.l === nextLevel && isLogicalNextStep(career, 'nextGoal')
          );
          if (levelUpCareers.length > 0) {
            suggestions.push({
              id: 'level-up',
              title: 'Level Up Your Career',
              description: 'Advance to the next career level',
              careers: levelUpCareers.slice(0, 6).map(career => ({
                id: career.id,
                title: career.t,
                industry: 'Various',
                level: career.l,
                salary: career.sr || 'Salary not specified',
                canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
                canBeTarget: isLogicalNextStep(career, 'target')
              })),
              icon: <TrendingUp className="h-4 w-4" />,
              color: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
            });
          }
        }

        // Add skill-based if missing
        if (!hasSkillBased) {
          const skillBasedCareers = relevantCuratedCareers.filter(career => {
            const hasSharedSkills = career.s.some(skill => currentCareer.s?.includes(skill));
            return hasSharedSkills && (isLogicalNextStep(career, 'nextGoal') || isLogicalNextStep(career, 'target'));
          });
          if (skillBasedCareers.length > 0) {
            suggestions.push({
              id: 'skill-transition',
              title: 'Skill-Based Transitions',
              description: 'Leverage your current skills in new areas',
              careers: skillBasedCareers.slice(0, 6).map(career => ({
                id: career.id,
                title: career.t,
                industry: 'Various',
                level: career.l,
                salary: career.sr || 'Salary not specified',
                canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
                canBeTarget: isLogicalNextStep(career, 'target')
              })),
              icon: <Target className="h-4 w-4" />,
              color: 'border-muted bg-muted/50 dark:border-muted dark:bg-muted/30'
            });
          }
        }
      }

    return suggestions;
  }, [currentCareer, allCareers, loading, targetCareer]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{t('pages.roadmap.yourCareerTransitionOptions')}</h3>
          <p className="text-sm text-muted-foreground">
            Loading career suggestions...
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (transitionSuggestions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{t('pages.roadmap.yourCareerTransitionOptions')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('pages.roadmap.noResultsFound')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{t('pages.roadmap.yourCareerTransitionOptions')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('pages.roadmap.basedOnCurrentRole', { role: currentCareer.t })}
        </p>
        
      </div>

      {transitionSuggestions.map((suggestion) => (
        <Card key={suggestion.id} className={suggestion.color}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {suggestion.icon}
                <h4 className="font-medium">{suggestion.title}</h4>
              </div>
              <Badge variant="outline" className="text-xs">
                {suggestion.careers.length} options
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {suggestion.description}
            </p>

            <div className="grid gap-3">
              {suggestion.careers.map((career) => {
                const fullCareer = allCareers.find(c => c.id === career.id);
                const isLocked = false; // TODO: Implement isStepTowardTarget logic
                
                return (
                <div 
                  key={career.id}
                  className={`flex items-start justify-between p-3 rounded-lg border ${
                    isLocked 
                      ? 'bg-muted/50 border-muted opacity-50' 
                      : 'bg-background border-border'
                  }`}
                  style={!isLocked ? { backgroundColor: 'hsl(var(--background))' } : {}}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-2 mb-2">
                      <h5 className={`font-medium text-sm flex-1 min-w-0 ${isLocked ? 'text-gray-500' : ''}`}>
                        {career.title}
                        {isLocked && targetCareer && (
                          <span className="text-xs text-gray-400 ml-2">
                            (Doesn't lead to {targetCareer.t})
                          </span>
                        )}
                      </h5>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {career.industry}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground min-w-[120px] text-right">
                        {career.salary}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-3 flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`justify-between ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isLocked}
                        >
                          {isLocked ? 'Locked' : 'Set Career'}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            // Find the full career object from allCareers
                            const fullCareer = allCareers.find(c => c.id === career.id);
                            if (fullCareer) {
                              onCareerSelection?.(fullCareer, 'nextGoal');
                            }
                          }}
                          className="flex items-center"
                          disabled={!career.canBeNextGoal}
                        >
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
{t('pages.roadmap.setAsNextGoal')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            // Find the full career object from allCareers
                            const fullCareer = allCareers.find(c => c.id === career.id);
                            if (fullCareer) {
                              onCareerSelection?.(fullCareer, 'target');
                            }
                          }}
                          className="flex items-center"
                          disabled={!career.canBeTarget}
                        >
                          <Star className="h-4 w-4 mr-2 text-primary" />
{t('pages.roadmap.setAsTargetCareer')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onCareerSelect?.(`details-${career.id}`)}
                    >
{t('pages.roadmap.careerDetails')}
                    </Button>
                  </div>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

    </div>
  );
});

CareerTransitionSuggestions.displayName = "CareerTransitionSuggestions";

export default CareerTransitionSuggestions;
