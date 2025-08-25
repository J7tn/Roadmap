import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Computer, 
  Heart, 
  Briefcase, 
  DollarSign, 
  Megaphone, 
  BookOpen, 
  Palette, 
  Settings, 
  Flask, 
  Scale, 
  Building, 
  HeartHandshake, 
  Wrench, 
  Utensils, 
  Video 
} from "lucide-react";
import { IIndustryCategory, IndustryCategory } from "@/types/career";
import { INDUSTRY_CATEGORIES } from "@/data/industries";

interface CategorySelectorProps {
  selectedCategory: IndustryCategory;
  onSelectCategory: (category: IndustryCategory) => void;
  showStats?: boolean;
}

// Icon mapping for industry categories
const iconMap = {
  tech: Computer,
  healthcare: Heart,
  business: Briefcase,
  finance: DollarSign,
  marketing: Megaphone,
  education: BookOpen,
  creative: Palette,
  engineering: Settings,
  science: Flask,
  legal: Scale,
  government: Building,
  nonprofit: HeartHandshake,
  trades: Wrench,
  hospitality: Utensils,
  media: Video,
};

const CategorySelector: React.FC<CategorySelectorProps> = memo(({
  selectedCategory,
  onSelectCategory,
  showStats = true,
}) => {
  // Memoize the sorted industries for performance
  const sortedIndustries = useMemo(() => {
    return [...INDUSTRY_CATEGORIES].sort((a, b) => {
      // Sort by growth rate first (High > Medium > Low)
      const growthOrder = { High: 3, Medium: 2, Low: 1 };
      const aGrowth = growthOrder[a.growthRate as keyof typeof growthOrder] || 0;
      const bGrowth = growthOrder[b.growthRate as keyof typeof growthOrder] || 0;
      
      if (aGrowth !== bGrowth) {
        return bGrowth - aGrowth;
      }
      
      // Then sort by job count
      return b.jobCount - a.jobCount;
    });
  }, []);

  // Memoize the total job count
  const totalJobs = useMemo(() => {
    return sortedIndustries.reduce((total, industry) => total + industry.jobCount, 0);
  }, [sortedIndustries]);

  const handleCategoryClick = (category: IndustryCategory) => {
    onSelectCategory(category);
  };

  return (
    <div className="space-y-4">
      {showStats && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Browse {totalJobs} career paths across {sortedIndustries.length} industries</span>
          <Badge variant="secondary">
            {sortedIndustries.filter(i => i.growthRate === 'High').length} High Growth
          </Badge>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sortedIndustries.map((industry) => {
          const IconComponent = iconMap[industry.id];
          const isSelected = selectedCategory === industry.id;
          
          return (
            <motion.div
              key={industry.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-primary bg-primary/5 border-primary"
                    : "hover:border-primary/50 hover:shadow-md"
                }`}
                onClick={() => handleCategoryClick(industry.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-full ${
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm">{industry.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {industry.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-1">
                      <Badge 
                        variant={industry.growthRate === 'High' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {industry.growthRate} Growth
                      </Badge>
                      
                      <div className="text-xs text-muted-foreground">
                        <div>{industry.jobCount} careers</div>
                        <div>{industry.avgSalary} avg</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

CategorySelector.displayName = "CategorySelector";

export default CategorySelector;
