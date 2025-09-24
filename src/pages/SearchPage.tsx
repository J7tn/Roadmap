import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter,
  X,
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICareerNode } from "@/types/career";

// Extended career node with category for search page
interface ICareerNodeWithCategory extends ICareerNode {
  cat?: string;
  industry?: string;
}

// Industry interface for comprehensive industry display
interface Industry {
  id: string;
  name: string;
  description: string;
  job_count: number;
  avg_salary: string;
  growth_rate: string;
  global_demand: string;
  top_countries: string[];
  classification_type: 'naics' | 'gics' | 'custom';
  classification_code: string;
}
import { getAllCareerNodesArray, getCareerNodesByIndustry, careerService } from "@/services/careerService";
import { organizedCareerService } from "@/services/organizedCareerService";
import { comprehensiveCareerService } from "@/services/comprehensiveCareerService";
import CareerBlock from "@/components/CareerBlock";
import BottomNavigation from "@/components/BottomNavigation";
import SearchInput from "@/components/SearchInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

const SearchPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [allCareers, setAllCareers] = useState<ICareerNodeWithCategory[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  
  // Industries tab state
  const [activeTab, setActiveTab] = useState<"search" | "industries">("search");
  const [comprehensiveIndustries, setComprehensiveIndustries] = useState<Industry[]>([]);
  const [filteredIndustries, setFilteredIndustries] = useState<Industry[]>([]);
  const [industriesLoading, setIndustriesLoading] = useState(false);
  const [industriesError, setIndustriesError] = useState<string | null>(null);
  const [industrySearchQuery, setIndustrySearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<'all' | 'naics' | 'gics' | 'custom'>('all');
  const [selectedDemand, setSelectedDemand] = useState<'all' | 'Very High' | 'High' | 'Medium' | 'Low'>('all');

  // Check if a career belongs to a specific industry (same logic as services)
  const isCareerInIndustry = (careerId: string, industryId: string): boolean => {
    // Complete mapping with 100% industry coverage
    const careerIndustryMapping: { [key: string]: string[] } = {
      'software-engineer': ['technology', 'artificial-intelligence', 'gics-45', 'gaming', 'entertainment', 'blockchain', 'virtual-reality'],
      'data-scientist': ['technology', 'artificial-intelligence', 'gics-45', 'banking', 'finance', 'healthcare', 'pharmaceuticals'],
      'cybersecurity-analyst': ['technology', 'security', 'gics-45', 'banking', 'finance', 'government', 'defense'],
      'devops-engineer': ['technology', 'gics-45', 'cloud-computing'],
      'product-manager': ['technology', 'gics-45', 'marketing', 'gaming', 'entertainment'],
      'ux-designer': ['technology', 'design', 'gics-45', 'gaming', 'entertainment', 'marketing'],
      'cloud-architect': ['technology', 'gics-45', 'cloud-computing'],
      'ai-engineer': ['technology', 'artificial-intelligence', 'gics-45', 'healthcare', 'pharmaceuticals', 'automotive', 'aerospace'],
      'blockchain-developer': ['technology', 'blockchain', 'gics-45', 'finance', 'banking'],
      'quantum-computing-engineer': ['technology', 'artificial-intelligence', 'gics-45', 'defense', 'aerospace'],
      'game-developer': ['technology', 'gaming', 'entertainment', 'gics-45', 'esports'],
      'bioinformatics-scientist': ['healthcare', 'biotechnology', 'pharmaceuticals', 'gics-35', 'science', 'research'],
      'registered-nurse': ['healthcare', 'gics-35', 'hospitals', 'elder-care'],
      'physician': ['healthcare', 'gics-35', 'hospitals', 'clinics'],
      'physical-therapist': ['healthcare', 'gics-35', 'sports', 'fitness', 'rehabilitation'],
      'pharmacist': ['healthcare', 'pharmaceuticals', 'gics-35', 'retail', 'hospitals'],
      'medical-technologist': ['healthcare', 'biotechnology', 'gics-35', 'laboratories'],
      'genetic-counselor': ['healthcare', 'biotechnology', 'gics-35', 'genetics'],
      'art-therapist': ['healthcare', 'gics-35', 'mental-health', 'therapy'],
      'wildlife-veterinarian': ['healthcare', 'gics-35', 'wildlife', 'conservation', 'zoos'],
      'telemedicine-physician': ['healthcare', 'technology', 'gics-35', 'telemedicine'],
      'financial-analyst': ['finance', 'banking', 'gics-40', 'investment', 'consulting'],
      'investment-banker': ['finance', 'banking', 'gics-40', 'investment', 'mergers-acquisitions'],
      'accountant': ['finance', 'accounting', 'gics-40', 'auditing', 'tax'],
      'insurance-agent': ['finance', 'insurance', 'gics-40', 'sales', 'customer-service'],
      'actuary': ['finance', 'insurance', 'gics-40', 'risk-management', 'statistics'],
      'forensic-accountant': ['finance', 'accounting', 'legal', 'gics-40', 'investigation'],
      'cryptocurrency-trader': ['finance', 'blockchain', 'gics-40', 'trading', 'investment'],
      'teacher': ['education', 'gics-30', 'k-12', 'elementary', 'secondary'],
      'professor': ['education', 'gics-30', 'higher-education', 'research', 'universities'],
      'training-specialist': ['education', 'gics-30', 'corporate-training', 'hr'],
      'robotics-engineer': ['manufacturing', 'technology', 'gics-20', 'automation', 'ai'],
      'mechanical-engineer': ['manufacturing', 'automotive', 'aerospace', 'gics-20', 'mechanical'],
      'electrical-engineer': ['manufacturing', 'electronics', 'gics-20', 'power', 'utilities'],
      'industrial-engineer': ['manufacturing', 'gics-20', 'process-optimization', 'operations'],
      'quality-control-inspector': ['manufacturing', 'gics-20', 'quality-assurance', 'testing'],
      'precision-machinist': ['manufacturing', 'gics-20', 'machining', 'tooling'],
      'master-electrician': ['construction', 'gics-20', 'electrical', 'utilities', 'maintenance'],
      'plumber': ['construction', 'gics-20', 'plumbing', 'maintenance', 'utilities'],
      'wind-turbine-technician': ['energy', 'gics-10', 'renewable-energy', 'maintenance', 'environmental'],
      'sustainable-energy-technician': ['energy', 'environmental', 'gics-10', 'renewable-energy', 'sustainability'],
      'environmental-scientist': ['science', 'environmental', 'gics-35', 'research', 'conservation'],
      'sommelier': ['hospitality', 'food-beverage', 'gics-25', 'wine', 'restaurants'],
      'event-planner': ['hospitality', 'gics-25', 'events', 'weddings', 'corporate-events'],
      'chef': ['hospitality', 'food-beverage', 'gics-25', 'restaurants', 'culinary'],
      'personal-trainer': ['fitness', 'sports', 'gics-25', 'health', 'wellness'],
      'fitness-instructor': ['fitness', 'sports', 'gics-25', 'health', 'wellness'],
      'professional-athlete': ['sports', 'gics-25', 'athletics', 'competition'],
      'sports-analyst': ['sports', 'media', 'gics-25', 'analytics', 'broadcasting'],
      'motion-graphics-designer': ['entertainment', 'media', 'gics-25', 'graphics', 'video'],
      'sound-engineer': ['entertainment', 'media', 'gics-25', 'audio', 'broadcasting'],
      'food-stylist': ['entertainment', 'food-beverage', 'gics-25', 'photography', 'advertising'],
      'journalist': ['media', 'gics-50', 'news', 'broadcasting', 'publishing'],
      'public-relations-specialist': ['media', 'marketing', 'gics-50', 'communications', 'advertising'],
      'content-creator': ['media', 'entertainment', 'gics-50', 'social-media', 'digital'],
      'interior-designer': ['design', 'real-estate', 'gics-25', 'architecture', 'home-improvement'],
      'marine-biologist': ['science', 'environmental', 'gics-35', 'marine', 'conservation'],
      'astronomer': ['science', 'gics-35', 'astronomy', 'research', 'space'],
      'volcanologist': ['science', 'environmental', 'gics-35', 'geology', 'research'],
      'government-administrator': ['government', 'gics-40', 'public-administration', 'policy'],
      'diplomat': ['government', 'gics-40', 'foreign-service', 'international-relations'],
      'law-enforcement-officer': ['government', 'security', 'gics-40', 'police', 'public-safety'],
      'firefighter': ['government', 'gics-40', 'emergency-services', 'public-safety'],
      'lawyer': ['legal', 'gics-40', 'law', 'litigation', 'corporate-law'],
      'paralegal': ['legal', 'gics-40', 'law', 'legal-support'],
      'judge': ['legal', 'government', 'gics-40', 'courts', 'judiciary'],
      'airline-pilot': ['transportation', 'gics-20', 'aviation', 'airlines'],
      'ship-captain': ['transportation', 'shipping', 'gics-20', 'maritime', 'logistics'],
      'logistics-coordinator': ['transportation', 'logistics', 'gics-20', 'supply-chain', 'shipping'],
      'agricultural-engineer': ['agriculture', 'gics-15', 'farming', 'food-production'],
      'forestry-technician': ['agriculture', 'environmental', 'gics-15', 'forestry', 'conservation'],
      'social-worker': ['social-services', 'nonprofit', 'gics-35', 'mental-health', 'community'],
      'nonprofit-manager': ['social-services', 'nonprofit', 'gics-35', 'management', 'fundraising'],
      'community-organizer': ['social-services', 'nonprofit', 'gics-35', 'community', 'activism'],
      // SPECIALIZED INDUSTRIES - NEW CAREERS
      'fashion-designer': ['apparel', 'fashion', 'gics-25', 'design', 'retail'],
      'textile-engineer': ['apparel', 'materials', 'gics-20', 'manufacturing', 'textiles'],
      'merchandise-buyer': ['apparel', 'fashion', 'retail', 'gics-25', 'purchasing'],
      'chemical-engineer': ['chemicals', 'manufacturing', 'gics-20', 'process-engineering'],
      'process-chemist': ['chemicals', 'pharmaceuticals', 'gics-20', 'research', 'manufacturing'],
      'janitorial-supervisor': ['cleaning', 'facilities', 'gics-20', 'maintenance', 'management'],
      'sanitation-engineer': ['cleaning', 'waste-management', 'gics-20', 'environmental', 'public-health'],
      'cruise-director': ['cruise', 'hospitality', 'tourism', 'gics-25', 'entertainment'],
      'marine-engineer': ['cruise', 'transportation', 'gics-20', 'maritime', 'engineering'],
      'landscape-architect': ['landscaping', 'design', 'environmental', 'gics-25', 'architecture'],
      'arborist': ['landscaping', 'agriculture', 'environmental', 'gics-15', 'tree-care'],
      'materials-scientist': ['materials', 'research', 'manufacturing', 'gics-15', 'science'],
      'metallurgist': ['materials', 'mining', 'manufacturing', 'gics-15', 'metals'],
      'mining-engineer': ['mining', 'materials', 'gics-15', 'extraction', 'engineering'],
      'geologist': ['mining', 'materials', 'environmental', 'gics-15', 'geology'],
      'petroleum-engineer': ['oil-gas', 'energy', 'gics-10', 'extraction', 'engineering'],
      'drilling-supervisor': ['oil-gas', 'energy', 'gics-10', 'operations', 'supervision'],
      'property-manager': ['property-management', 'real-estate', 'gics-60', 'management', 'leasing'],
      'facilities-manager': ['property-management', 'real-estate', 'gics-60', 'maintenance', 'operations'],
      'real-estate-agent': ['gics-60', 'real-estate', 'sales', 'property', 'transactions'],
      'real-estate-appraiser': ['gics-60', 'real-estate', 'finance', 'valuation', 'assessment'],
      'satellite-engineer': ['satellite', 'aerospace', 'telecommunications', 'gics-20', 'space'],
      'ground-station-technician': ['satellite', 'telecommunications', 'gics-20', 'operations', 'communications'],
      'semiconductor-engineer': ['semiconductors', 'electronics', 'technology', 'gics-45', 'chips'],
      'chip-designer': ['semiconductors', 'electronics', 'technology', 'gics-45', 'design'],
      'telecommunications-engineer': ['telecommunications', 'technology', 'gics-50', 'networks', 'communications'],
      'network-architect': ['telecommunications', 'technology', 'gics-50', 'architecture', 'infrastructure'],
      'tour-guide': ['tourism', 'hospitality', 'gics-25', 'travel', 'cultural'],
      'travel-agent': ['tourism', 'hospitality', 'gics-25', 'travel', 'booking'],
      'power-plant-operator': ['gics-55', 'utilities', 'energy', 'operations', 'power'],
      'utility-inspector': ['gics-55', 'utilities', 'government', 'inspection', 'safety'],
      'waste-management-specialist': ['waste-management', 'environmental', 'gics-20', 'sustainability', 'recycling'],
      'recycling-coordinator': ['waste-management', 'environmental', 'gics-20', 'recycling', 'sustainability'],
      'water-treatment-operator': ['water-treatment', 'utilities', 'environmental', 'gics-55', 'water'],
      'environmental-engineer': ['water-treatment', 'environmental', 'gics-55', 'engineering', 'sustainability']
    };

    const careerIndustries = careerIndustryMapping[careerId] || [];
    return careerIndustries.includes(industryId);
  };


  // Get search query and industry from URL
  const urlSearchQuery = searchParams.get('search') || "";
  const urlIndustry = searchParams.get('industry') || "";

  // Load comprehensive industries
  const loadComprehensiveIndustries = async () => {
    try {
      setIndustriesLoading(true);
      setIndustriesError(null);
      const data = await comprehensiveCareerService.getAllIndustries();
      setComprehensiveIndustries(data);
    } catch (err) {
      console.error('Error loading comprehensive industries:', err);
      setIndustriesError('Failed to load industry data');
    } finally {
      setIndustriesLoading(false);
    }
  };

  // Filter comprehensive industries
  const filterComprehensiveIndustries = () => {
    let filtered = comprehensiveIndustries;

    // Search filter
    if (industrySearchQuery.trim()) {
      const query = industrySearchQuery.toLowerCase();
      filtered = filtered.filter(industry =>
        industry.name.toLowerCase().includes(query) ||
        industry.description.toLowerCase().includes(query) ||
        industry.classification_code.toLowerCase().includes(query)
      );
    }

    // Classification filter
    if (selectedClassification !== 'all') {
      filtered = filtered.filter(industry => industry.classification_type === selectedClassification);
    }

    // Demand filter
    if (selectedDemand !== 'all') {
      filtered = filtered.filter(industry => industry.global_demand === selectedDemand);
    }

    setFilteredIndustries(filtered);
  };

  // Helper functions for industry display
  const getClassificationColor = (type: string) => {
    switch (type) {
      case 'naics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'gics': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'custom': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Handle industry click to switch to search tab and filter by industry
  const handleIndustryClick = (industryId: string) => {
    setActiveTab("search");
    setSelectedIndustry(industryId);
    setSearchQuery("");
  };

  // Load industries from comprehensive career service
  useEffect(() => {
    const loadIndustries = async () => {
      try {
        // Make sure the comprehensive career service has the current language
        const currentLang = localStorage.getItem('app-language') || 'en';
        comprehensiveCareerService.setLanguage(currentLang);
        
        const industriesData = await comprehensiveCareerService.getAllIndustries();
        setIndustries(industriesData);
        console.log('SearchPage: Loaded industries:', industriesData.length);
        console.log('SearchPage: Sample industry data:', industriesData.slice(0, 3));
      } catch (error) {
        console.error('Error loading industries from comprehensive service:', error);
        // Fallback to organized service
        try {
          const currentLang = localStorage.getItem('app-language') || 'en';
          organizedCareerService.setLanguage(currentLang);
          const industriesData = await organizedCareerService.getIndustries();
          setIndustries(industriesData);
          console.log('SearchPage: Fallback loaded industries:', industriesData.length);
        } catch (fallbackError) {
          console.error('Error loading industries from fallback:', fallbackError);
          setIndustries([]);
        }
      }
    };

    loadIndustries();
  }, []);

  // Load comprehensive industries for the industries tab
  useEffect(() => {
    if (activeTab === "industries") {
      loadComprehensiveIndustries();
    }
  }, [activeTab]);

  // Filter comprehensive industries
  useEffect(() => {
    if (activeTab === "industries") {
      filterComprehensiveIndustries();
    }
  }, [comprehensiveIndustries, industrySearchQuery, selectedClassification, selectedDemand]);

  // Load career data based on industry selection (lazy loading)
  useEffect(() => {
    const loadCareers = async () => {
      try {
        setError(null);
        setLoading(true);
        
        console.log('SearchPage: Loading careers for industry:', selectedIndustry);
        
        let careerData: ICareerNode[] = [];
        
        if (selectedIndustry === "all") {
          // Don't load all careers at once - show empty state with message
          console.log('SearchPage: No industry selected, showing empty state');
          careerData = [];
        } else {
          // Load careers for specific industry using comprehensive service
          try {
            const currentLang = localStorage.getItem('app-language') || 'en';
            comprehensiveCareerService.setLanguage(currentLang);
            careerData = await comprehensiveCareerService.getCareersByIndustry(selectedIndustry);
            console.log(`SearchPage: Loaded ${careerData.length} careers from comprehensive service for industry: ${selectedIndustry}`);
          } catch (error) {
            console.error('Error loading careers from comprehensive service, falling back to career service:', error);
            // Fallback to career service
            try {
              const filters = {
                industry: [selectedIndustry as any]
              };
              careerData = await careerService.searchCareersTranslated("", filters);
              console.log(`SearchPage: Loaded ${careerData.length} translated careers for industry: ${selectedIndustry}`);
            } catch (fallbackError) {
              console.error('Error loading translated careers, falling back to regular careers:', fallbackError);
              // Final fallback to regular careers
              careerData = await getCareerNodesByIndustry(selectedIndustry);
              console.log(`SearchPage: Loaded ${careerData.length} regular careers for industry: ${selectedIndustry}`);
            }
          }
        }
        
        // Map career nodes (career nodes from Supabase already have translations and industry info)
        const careers: ICareerNodeWithCategory[] = careerData.map(item => ({
          ...item,
          cat: item.industry || 'technology' // Use industry from database as category
        }));
        
        console.log('SearchPage: Sample careers:');
        careers.slice(0, 5).forEach((c, index) => {
          console.log(`  ${index + 1}. ${c.t} (Industry: ${c.industry})`);
        });
        
        setAllCareers(careers);
        setLoading(false);
      } catch (err) {
        console.error('SearchPage: Error loading careers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load careers');
        setLoading(false);
      }
    };
    loadCareers();
  }, [selectedIndustry]);

  // Update local search query when URL changes
  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  // Update industry filter when URL changes
  useEffect(() => {
    if (urlIndustry) {
      setSelectedIndustry(urlIndustry);
      setShowFilters(true); // Show filters when industry is specified
    }
  }, [urlIndustry]);

  // State for translated search results
  const [translatedSearchResults, setTranslatedSearchResults] = useState<ICareerNodeWithCategory[]>([]);
  const [loadingTranslatedSearch, setLoadingTranslatedSearch] = useState(false);

  // Search translated careers when search query changes
  useEffect(() => {
    const searchTranslatedCareers = async () => {
      if (!searchQuery.trim() || selectedIndustry === "all") {
        setTranslatedSearchResults([]);
        return;
      }

      setLoadingTranslatedSearch(true);
      try {
        const filters = {
          industry: [selectedIndustry as any],
          level: selectedLevel !== "all" ? [selectedLevel as any] : undefined
        };
        const translated = await careerService.searchCareersTranslated(searchQuery, filters);
        const careersWithCategory = translated.map(item => ({
          ...item,
          cat: item.industry || selectedIndustry
        }));
        setTranslatedSearchResults(careersWithCategory);
        console.log(`SearchPage: Found ${careersWithCategory.length} translated careers for query: "${searchQuery}"`);
      } catch (error) {
        console.error('Error searching translated careers:', error);
        setTranslatedSearchResults([]);
      } finally {
        setLoadingTranslatedSearch(false);
      }
    };

    const timeoutId = setTimeout(searchTranslatedCareers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedIndustry, selectedLevel]);

  // Filter careers based on search query and filters
  const filteredCareers = useMemo(() => {
    console.log('SearchPage: Filtering careers with:');
    console.log('  - searchQuery:', `"${searchQuery}"`);
    console.log('  - selectedIndustry:', `"${selectedIndustry}"`);
    console.log('  - selectedLevel:', `"${selectedLevel}"`);
    console.log('  - totalCareers:', allCareers.length);
    console.log('  - translatedSearchResults:', translatedSearchResults.length);
    
    // If no search query and no industry selected, show empty state
    if (!searchQuery.trim() && selectedIndustry === "all") {
      console.log('SearchPage: No search query and no industry selected, showing empty state');
      return [];
    }

    // Use translated search results if available and there's a search query
    if (searchQuery.trim() && translatedSearchResults.length > 0) {
      console.log('SearchPage: Using translated search results');
      return translatedSearchResults;
    }

    // If there's a search query but no translated results, search through all careers
    if (searchQuery.trim()) {
      console.log('SearchPage: Searching through all careers with query:', searchQuery);
      const query = searchQuery.toLowerCase();
      
      // Score and filter careers based on relevance
      const scoredCareers = allCareers.map(career => {
        // Ensure career object has required properties
        if (!career || !career.id || !career.t) {
          return { career, score: 0 };
        }

        let score = 0;
        const title = career.t?.toLowerCase() || '';
        const description = career.d?.toLowerCase() || '';
        
        // Apply level filter
        const matchesLevel = selectedLevel === "all" || 
          career.l === selectedLevel;

        // If level filter doesn't match, return 0 score
        if (!matchesLevel) {
          return { career, score: 0 };
        }

        // Exact title match (highest priority)
        if (title === query) {
          score += 100;
        }
        // Title starts with query
        else if (title.startsWith(query)) {
          score += 80;
        }
        // Title contains query
        else if (title.includes(query)) {
          score += 60;
        }
        
        // Job titles exact match
        if (career.jt?.some(jobTitle => jobTitle.toLowerCase() === query)) {
          score += 70;
        }
        // Job titles contains match
        else if (career.jt?.some(jobTitle => jobTitle.toLowerCase().includes(query))) {
          score += 40;
        }
        
        // Skills exact match
        if (career.s?.some(skill => skill.toLowerCase() === query)) {
          score += 50;
        }
        // Skills contains match
        else if (career.s?.some(skill => skill.toLowerCase().includes(query))) {
          score += 25;
        }
        
        // Requirements skills exact match
        if (career.r?.sk?.some(skill => skill.toLowerCase() === query)) {
          score += 45;
        }
        // Requirements skills contains match
        else if (career.r?.sk?.some(skill => skill.toLowerCase().includes(query))) {
          score += 20;
        }
        
        // Description match (lowest priority)
        if (description.includes(query)) {
          score += 10;
        }
        
        // Multi-word query handling - boost score for careers that match multiple words
        const queryWords = query.split(/\s+/).filter(word => word.length > 2);
        if (queryWords.length > 1) {
          const matchedWords = queryWords.filter(word => 
            title.includes(word) || 
            career.jt?.some(jobTitle => jobTitle.toLowerCase().includes(word)) ||
            career.s?.some(skill => skill.toLowerCase().includes(word))
          );
          score += matchedWords.length * 10; // Bonus for matching multiple words
        }
        
        return { career, score };
      }).filter(({ score }) => score > 0); // Only include items with positive scores
      
      // Sort by score (highest first) and limit results
      const filtered = scoredCareers
        .sort((a, b) => b.score - a.score)
        .slice(0, 20) // Limit to top 20 most relevant results
        .map(({ career }) => career);
      
      console.log('SearchPage: Search results:', filtered.length);
      return filtered;
    }

    // If no search query but industry is selected, show careers for that industry
    if (!searchQuery.trim() && selectedIndustry !== "all") {
      console.log('SearchPage: Showing careers for selected industry:', selectedIndustry);
      const query = searchQuery.toLowerCase();
      
      // Score and filter careers based on relevance
      const scoredCareers = allCareers.map(career => {
        // Ensure career object has required properties
        if (!career || !career.id || !career.t) {
          return { career, score: 0 };
        }

        let score = 0;
        const title = career.t?.toLowerCase() || '';
        const description = career.d?.toLowerCase() || '';
        
        // Apply industry filter using the same logic as the services
        const matchesIndustry = selectedIndustry === "all" || 
          isCareerInIndustry(career.id, selectedIndustry);

        // Apply level filter
        const matchesLevel = selectedLevel === "all" || 
          career.l === selectedLevel;

        // If filters don't match, return 0 score
        if (!matchesIndustry || !matchesLevel) {
          return { career, score: 0 };
        }

        // Return all items that match filters
        return { career, score: 1 };
      }).filter(({ score }) => score > 0);
      
      // Sort by score (highest first)
      const filtered = scoredCareers
        .sort((a, b) => b.score - a.score)
        .map(({ career }) => career);
      
      console.log('SearchPage: Industry filter results:', filtered.length);
      return filtered;
    }

    // Default: return empty array
    return [];
  }, [searchQuery, allCareers, selectedIndustry, selectedLevel]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    // Add career titles
    allCareers.forEach(career => {
      if (career.t?.toLowerCase().includes(query)) {
        suggestions.add(career.t);
      }
      // Add skills
      career.s?.forEach(skill => {
        if (skill.toLowerCase().includes(query)) {
          suggestions.add(skill);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, [searchQuery, allCareers]);

  const handleCareerClick = useCallback((career: ICareerNode) => {
    navigate(`/jobs/${career.id}`);
  }, [navigate]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query
      const params = new URLSearchParams();
      params.set('search', searchQuery);
      navigate(`/search?${params.toString()}`);
    }
  }, [searchQuery, navigate]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    navigate('/search');
  }, [navigate]);


  if (loading || loadingTranslatedSearch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message={t('pages.search.loadingCareers')} size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title={t('errors.errorLoadingCareers')}
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b safe-area-top" style={{ touchAction: 'none' }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">
              {activeTab === "search" ? t('pages.search.title') : "Industry Database"}
            </h1>
            {activeTab === "search" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {t('pages.search.filters.title')}
              </Button>
            )}
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "search" | "industries")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Careers
              </TabsTrigger>
              <TabsTrigger value="industries" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Browse Industries
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content - flex-1 to take remaining space */}
      <div className="flex-1 pb-20">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "search" | "industries")}>
          {/* Search Careers Tab */}
          <TabsContent value="search" className="mt-0">
            <div className="p-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearchSubmit}
                placeholder={t('pages.search.placeholder')}
                loading={loading}
                suggestions={searchSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />

              {/* Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-muted rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{t('pages.search.filters.title')}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('pages.search.filters.industry')}</label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full p-2 border border-border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      >
                        <option value="all">{t('pages.search.filters.allIndustries')}</option>
                        {industries
                          .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
                          .map(industry => (
                            <option key={industry.id} value={industry.id}>
                              {industry.name || industry.id}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('pages.search.filters.experience')}</label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full p-2 border border-border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      >
                        <option value="all">{t('pages.search.filters.allLevels')}</option>
                        <option value="E">{t('pages.search.filters.entryLevel')}</option>
                        <option value="I">{t('pages.search.filters.intermediate')}</option>
                        <option value="A">{t('pages.search.filters.advanced')}</option>
                        <option value="X">{t('pages.search.filters.expert')}</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              <div className="mt-6">
                {filteredCareers.length === 0 ? (
                  (!searchQuery.trim() && selectedIndustry === "all") ? (
                    <EmptyState
                      icon="search"
                      title="Search for Careers"
                      description="Enter a career name, skill, or keyword to find relevant opportunities. You can also select an industry filter to explore careers in specific fields."
                    />
                  ) : (
                    <EmptyState
                      icon="search"
                      title={t('pages.search.noResults')}
                      description={t('pages.search.tryAdjustingSearch')}
                      action={{
                        label: t('pages.search.clearSearch'),
                        onClick: clearSearch
                      }}
                    />
                  )
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {filteredCareers.length} {filteredCareers.length !== 1 ? t('pages.search.careersFound') : t('pages.search.careerFound')}
                    </p>
                    {filteredCareers.filter(career => career && career.id && career.t).map((career, index) => (
                      <CareerBlock
                        key={career.id}
                        career={career}
                        onClick={handleCareerClick}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Browse Industries Tab */}
          <TabsContent value="industries" className="mt-0">
            <div className="p-4">
              {industriesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner message="Loading industries..." size="lg" />
                </div>
              ) : industriesError ? (
                <div className="flex items-center justify-center py-12">
                  <ErrorState
                    title="Error Loading Industries"
                    message={industriesError}
                    onRetry={loadComprehensiveIndustries}
                  />
                </div>
              ) : (
                <>
                  {/* Industry Search and Filters */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Industry Search & Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Search Input */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Search Industries</label>
                        <Input
                          type="text"
                          placeholder="Search by name, description, or classification code..."
                          value={industrySearchQuery}
                          onChange={(e) => setIndustrySearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      {/* Filters */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Classification Filter */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Classification Type</label>
                          <Select value={selectedClassification} onValueChange={(value) => setSelectedClassification(value as any)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select classification type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Classifications</SelectItem>
                              <SelectItem value="naics">NAICS</SelectItem>
                              <SelectItem value="gics">GICS</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Demand Filter */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Global Demand</label>
                          <Select value={selectedDemand} onValueChange={(value) => setSelectedDemand(value as any)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select demand level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Demand Levels</SelectItem>
                              <SelectItem value="Very High">Very High Demand</SelectItem>
                              <SelectItem value="High">High Demand</SelectItem>
                              <SelectItem value="Medium">Medium Demand</SelectItem>
                              <SelectItem value="Low">Low Demand</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Industry Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIndustries.map((industry) => (
                      <Card key={industry.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleIndustryClick(industry.id)}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{industry.name}</CardTitle>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={getClassificationColor(industry.classification_type)}>
                                  {industry.classification_type.toUpperCase()} {industry.classification_code}
                                </Badge>
                                <Badge className={getDemandColor(industry.global_demand)}>
                                  {industry.global_demand} Demand
                                </Badge>
                              </div>
                            </div>
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {industry.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{industry.job_count.toLocaleString()} jobs</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>{industry.avg_salary}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span>{industry.growth_rate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span>{industry.top_countries.slice(0, 2).join(', ')}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <Card className="mt-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Database Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{comprehensiveIndustries.length}</div>
                          <div className="text-sm text-muted-foreground">Total Industries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {comprehensiveIndustries.filter(i => i.classification_type === 'naics').length}
                          </div>
                          <div className="text-sm text-muted-foreground">NAICS Classifications</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {comprehensiveIndustries.filter(i => i.classification_type === 'gics').length}
                          </div>
                          <div className="text-sm text-muted-foreground">GICS Classifications</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {comprehensiveIndustries.reduce((sum, i) => sum + i.job_count, 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Jobs</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation - positioned at bottom */}
      <BottomNavigation />
    </motion.div>
  );
});

SearchPage.displayName = 'SearchPage';

export default SearchPage;
