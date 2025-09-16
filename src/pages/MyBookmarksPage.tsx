import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookmarkCheck,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBookmarks } from '@/hooks/useBookmarks';
import CareerBlock from '@/components/CareerBlock';
import { ICareerNode, CareerLevel } from '@/types/career';
import { BookmarkedCareer } from '@/services/bookmarkService';
import BottomNavigation from '@/components/BottomNavigation';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

const MyBookmarksPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { bookmarks, loading, removeBookmark, clearAllBookmarks, getBookmarkCount } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');

  // Convert BookmarkedCareer to ICareerNode format
  const convertToCareerNode = (bookmark: BookmarkedCareer): ICareerNode => ({
    id: bookmark.id,
    t: bookmark.title,
    l: (bookmark.level === 'entry' ? 'E' : 
        bookmark.level === 'mid' ? 'I' : 
        bookmark.level === 'senior' ? 'A' : 'X') as CareerLevel,
    s: bookmark.skills,
    c: bookmark.certifications,
    sr: bookmark.salary,
    te: bookmark.experience,
    d: bookmark.description,
    jt: bookmark.jobTitles,
    r: {
      e: [],
      exp: bookmark.experience,
      sk: bookmark.skills
    }
  });

  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        bookmark.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
      }
    });

    return filtered;
  }, [bookmarks, searchQuery, sortBy]);

  const handleRemoveBookmark = useCallback((careerId: string) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      removeBookmark(careerId);
    }
  }, [removeBookmark]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
      clearAllBookmarks();
    }
  }, [clearAllBookmarks]);

  const handleCareerClick = useCallback((career: ICareerNode) => {
    navigate(`/job/${career.id}`);
  }, [navigate]);

  const handleExport = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `careering-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // You could implement import functionality here
            console.log('Import data:', data);
            alert('Import functionality would be implemented here');
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title={t('pages.bookmarks.title')}
        icon={<BookmarkCheck />}
        backTo="/categories"
        badge={{
          text: `${getBookmarkCount()} saved`,
          variant: "secondary"
        }}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {bookmarks.length === 0 ? (
          <EmptyState
            icon="bookmark"
            title={t('pages.bookmarks.noBookmarks')}
            description={t('pages.bookmarks.noBookmarksDescription')}
            action={{
              label: t('pages.bookmarks.exploreCareers'),
              onClick: () => navigate('/categories')
            }}
          />
        ) : (
          <>
            {/* Search and Filter */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                    className="h-11 px-3 border rounded-md bg-background text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="destructive" size="sm" onClick={handleClearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </motion.div>

            {/* Bookmarks List */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filteredBookmarks.map((bookmark, index) => (
                <div key={bookmark.id} className="relative">
                  <CareerBlock
                    career={convertToCareerNode(bookmark)}
                    onClick={handleCareerClick}
                    index={index}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBookmark(bookmark.id);
                    }}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50 z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </motion.div>

            {filteredBookmarks.length === 0 && searchQuery && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-6">
                  No bookmarks match your search criteria.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>

      <BottomNavigation />
    </motion.div>
  );
});

MyBookmarksPage.displayName = 'MyBookmarksPage';

export default MyBookmarksPage;
