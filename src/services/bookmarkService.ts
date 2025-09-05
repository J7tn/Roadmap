import { ICareerNode } from '@/types/career';

export interface BookmarkedCareer {
  id: string;
  title: string;
  description: string;
  level: string;
  salary: string;
  experience: string;
  skills: string[];
  jobTitles: string[];
  certifications: string[];
  category: string;
  pathName: string;
  pathId: string;
  bookmarkedAt: string;
}

class BookmarkService {
  private readonly STORAGE_KEY = 'careering_bookmarks';

  /**
   * Get all bookmarked careers
   */
  getAllBookmarks(): BookmarkedCareer[] {
    try {
      const bookmarks = localStorage.getItem(this.STORAGE_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  /**
   * Check if a career is bookmarked
   */
  isBookmarked(careerId: string): boolean {
    const bookmarks = this.getAllBookmarks();
    return bookmarks.some(bookmark => bookmark.id === careerId);
  }

  /**
   * Add a career to bookmarks
   */
  addBookmark(career: ICareerNode, category: string, pathName: string, pathId: string): boolean {
    try {
      const bookmarks = this.getAllBookmarks();
      
      // Check if already bookmarked
      if (this.isBookmarked(career.id)) {
        return false; // Already bookmarked
      }

      const bookmarkedCareer: BookmarkedCareer = {
        id: career.id,
        title: career.t || 'Unknown Title',
        description: career.d || '',
        level: career.l || 'E',
        salary: career.sr || 'Not specified',
        experience: career.te || 'Not specified',
        skills: career.s || [],
        jobTitles: career.jt || [],
        certifications: career.c || [],
        category,
        pathName,
        pathId,
        bookmarkedAt: new Date().toISOString()
      };

      bookmarks.push(bookmarkedCareer);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('bookmarksUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return false;
    }
  }

  /**
   * Remove a career from bookmarks
   */
  removeBookmark(careerId: string): boolean {
    try {
      const bookmarks = this.getAllBookmarks();
      const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== careerId);
      
      if (filteredBookmarks.length === bookmarks.length) {
        return false; // Not found
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredBookmarks));
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('bookmarksUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
  }

  /**
   * Toggle bookmark status
   */
  toggleBookmark(career: ICareerNode, category: string, pathName: string, pathId: string): boolean {
    if (this.isBookmarked(career.id)) {
      return this.removeBookmark(career.id);
    } else {
      return this.addBookmark(career, category, pathName, pathId);
    }
  }

  /**
   * Get bookmarks by category
   */
  getBookmarksByCategory(category: string): BookmarkedCareer[] {
    const bookmarks = this.getAllBookmarks();
    return bookmarks.filter(bookmark => bookmark.category === category);
  }

  /**
   * Clear all bookmarks
   */
  clearAllBookmarks(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('bookmarksUpdated'));
      return true;
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      return false;
    }
  }

  /**
   * Get bookmark count
   */
  getBookmarkCount(): number {
    return this.getAllBookmarks().length;
  }

  /**
   * Export bookmarks as JSON
   */
  exportBookmarks(): string {
    const bookmarks = this.getAllBookmarks();
    return JSON.stringify(bookmarks, null, 2);
  }

  /**
   * Import bookmarks from JSON
   */
  importBookmarks(jsonData: string): boolean {
    try {
      const bookmarks = JSON.parse(jsonData);
      if (Array.isArray(bookmarks)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
        window.dispatchEvent(new CustomEvent('bookmarksUpdated'));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing bookmarks:', error);
      return false;
    }
  }
}

export const bookmarkService = new BookmarkService();
