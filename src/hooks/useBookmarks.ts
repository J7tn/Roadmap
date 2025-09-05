import { useState, useEffect, useCallback } from 'react';
import { bookmarkService, BookmarkedCareer } from '@/services/bookmarkService';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedCareer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks on mount
  useEffect(() => {
    const loadBookmarks = () => {
      setBookmarks(bookmarkService.getAllBookmarks());
      setLoading(false);
    };

    loadBookmarks();

    // Listen for bookmark updates
    const handleBookmarksUpdated = () => {
      setBookmarks(bookmarkService.getAllBookmarks());
    };

    window.addEventListener('bookmarksUpdated', handleBookmarksUpdated);

    return () => {
      window.removeEventListener('bookmarksUpdated', handleBookmarksUpdated);
    };
  }, []);

  const isBookmarked = useCallback((careerId: string) => {
    return bookmarkService.isBookmarked(careerId);
  }, []);

  const addBookmark = useCallback((career: any, category: string, pathName: string, pathId: string) => {
    return bookmarkService.addBookmark(career, category, pathName, pathId);
  }, []);

  const removeBookmark = useCallback((careerId: string) => {
    return bookmarkService.removeBookmark(careerId);
  }, []);

  const toggleBookmark = useCallback((career: any, category: string, pathName: string, pathId: string) => {
    return bookmarkService.toggleBookmark(career, category, pathName, pathId);
  }, []);

  const getBookmarksByCategory = useCallback((category: string) => {
    return bookmarkService.getBookmarksByCategory(category);
  }, []);

  const clearAllBookmarks = useCallback(() => {
    return bookmarkService.clearAllBookmarks();
  }, []);

  const getBookmarkCount = useCallback(() => {
    return bookmarkService.getBookmarkCount();
  }, []);

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    getBookmarksByCategory,
    clearAllBookmarks,
    getBookmarkCount
  };
};
