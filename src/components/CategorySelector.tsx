import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Code,
  Stethoscope,
  Briefcase,
  Landmark,
  Wrench,
  Palette,
  Microscope,
  Utensils,
  Leaf,
  Globe,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CategorySelectorProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
}

const CategorySelector = ({
  onCategorySelect = () => {},
  selectedCategory = "",
}: CategorySelectorProps) => {
  const [selected, setSelected] = useState<string>(selectedCategory);

  const categories: Category[] = [
    {
      id: "technology",
      name: "Technology",
      icon: <Code size={24} />,
      description:
        "Software development, IT, cybersecurity, and data science careers",
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: <Stethoscope size={24} />,
      description:
        "Medical, nursing, therapy, and healthcare administration roles",
    },
    {
      id: "business",
      name: "Business",
      icon: <Briefcase size={24} />,
      description: "Management, marketing, HR, and entrepreneurship paths",
    },
    {
      id: "finance",
      name: "Finance",
      icon: <Landmark size={24} />,
      description:
        "Banking, accounting, financial analysis, and investment careers",
    },
    {
      id: "trades",
      name: "Skilled Trades",
      icon: <Wrench size={24} />,
      description:
        "Electrician, plumbing, carpentry, and other skilled trade professions",
    },
    {
      id: "creative",
      name: "Creative Arts",
      icon: <Palette size={24} />,
      description: "Design, writing, music, film, and other creative careers",
    },
    {
      id: "science",
      name: "Science",
      icon: <Microscope size={24} />,
      description: "Research, laboratory, engineering, and scientific roles",
    },
    {
      id: "hospitality",
      name: "Hospitality",
      icon: <Utensils size={24} />,
      description:
        "Food service, hotel management, tourism, and event planning",
    },
    {
      id: "agriculture",
      name: "Agriculture",
      icon: <Leaf size={24} />,
      description:
        "Farming, forestry, environmental science, and sustainability careers",
    },
    {
      id: "education",
      name: "Education",
      icon: <Globe size={24} />,
      description:
        "Teaching, administration, counseling, and educational technology",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelected(categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <div className="w-full bg-background border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Explore Career Categories</h2>
          {selected && (
            <Badge variant="outline" className="ml-2">
              {categories.find((cat) => cat.id === selected)?.name ||
                "All Categories"}
            </Badge>
          )}
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-3 pb-2">
            <TooltipProvider>
              {categories.map((category) => (
                <Tooltip key={category.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selected === category.id ? "default" : "outline"}
                      size="lg"
                      className={`flex flex-col items-center justify-center h-20 w-28 gap-2 transition-all ${selected === category.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.icon}
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{category.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategorySelector;
