import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookmarkCheck,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Download,
  Upload,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Home,
  Grid3X3,
  Target,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookmarks } from '@/hooks/useBookmarks';

const MyBookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookmarks, loading, removeBookmark, clearAllBookmarks, getBookmarkCount } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');

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

  const handleRemoveBookmark = (careerId: string) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      removeBookmark(careerId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
      clearAllBookmarks();
    }
  };

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

  const getLevelBadgeColor = (level: string): string => {
    switch (level) {
      case 'E': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'I': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'A': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'X': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getLevelText = (level: string): string => {
    switch (level) {
      case 'E': return 'Entry';
      case 'I': return 'Intermediate';
      case 'A': return 'Advanced';
      case 'X': return 'Expert';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/categories" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BookmarkCheck className="h-5 w-5 text-primary" />
              <h1 className="text-lg md:text-xl font-bold">My Bookmarks</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {getBookmarkCount()} saved
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {bookmarks.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BookmarkCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Bookmarks Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring careers and bookmark the ones that interest you. Your saved jobs will appear here.
            </p>
            <Button onClick={() => navigate('/categories')}>
              Explore Careers
            </Button>
          </motion.div>
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

            {/* Bookmarks Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filteredBookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base mb-2 line-clamp-2">{bookmark.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getLevelBadgeColor(bookmark.level)}`}>
                              {getLevelText(bookmark.level)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {bookmark.category}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBookmark(bookmark.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {bookmark.description}
                        </p>

                        {/* Key Info */}
                        <div className="space-y-2">
                          {bookmark.salary && (
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">{bookmark.salary}</span>
                            </div>
                          )}
                          {bookmark.experience && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600">{bookmark.experience}</span>
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {bookmark.skills.length > 0 && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Skills</span>
                            <div className="flex flex-wrap gap-1">
                              {bookmark.skills.slice(0, 3).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {bookmark.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{bookmark.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Bookmarked Date */}
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Bookmarked</span>
                            <span>{new Date(bookmark.bookmarkedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            <Link to="/" className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
            <Link to="/categories" className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground">
              <Grid3X3 className="h-5 w-5" />
              <span className="text-xs">Categories</span>
            </Link>
            <Link to="/jobs" className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground">
              <Target className="h-5 w-5" />
              <span className="text-xs">Jobs</span>
            </Link>
            <Link to="/bookmarks" className="flex flex-col items-center space-y-1 p-2 text-primary">
              <BookmarkCheck className="h-5 w-5" />
              <span className="text-xs">Bookmarks</span>
            </Link>
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default MyBookmarksPage;
