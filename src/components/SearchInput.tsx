import React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilterClick?: () => void;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  showFilter = false,
  onFilterClick,
  loading = false,
  suggestions = [],
  onSuggestionClick,
  className = ""
}) => {
  const { t } = useTranslation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder || t('search.placeholder')}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {showFilter && (
            <Button
              type="button"
              variant="outline"
              onClick={onFilterClick}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t('pages.search.filters')}
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? t('common.searching') : t('common.search')}
          </Button>
        </div>
      </form>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('search.suggestions')}:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
