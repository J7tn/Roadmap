import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { bookmarkService, BookmarkedCareer } from "@/services/bookmarkService";
import { careerPathProgressService, CareerPathProgress } from "@/services/careerPathProgressService";
import { ICareerNode } from "@/types/career";
import {
  User,
  TrendingUp,
  Bookmark,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";

const MyCareerPathsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("my-career");
  const [bookmarkedCareers, setBookmarkedCareers] = useState<BookmarkedCareer[]>([]);
  const [careerPathProgress, setCareerPathProgress] = useState<CareerPathProgress[]>([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const bookmarks = await bookmarkService.getAllBookmarks();
        const progress = await careerPathProgressService.getAllProgress();
        setBookmarkedCareers(bookmarks);
        setCareerPathProgress(progress);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const removeBookmark = async (id: string) => {
    try {
      await bookmarkService.removeBookmark(id);
      setBookmarkedCareers(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const removeProgress = async (id: string) => {
    try {
      await careerPathProgressService.removeProgress(id);
      setCareerPathProgress(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error removing progress:", error);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50 safe-area-top"
        style={{ touchAction: 'none' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <h1 className="text-lg md:text-xl font-bold whitespace-nowrap">{t('pages.careerPaths.title')}</h1>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="my-career" className="text-xs sm:text-sm px-2 py-2 h-auto">
                <span className="truncate">{t('pages.careerPaths.tabs.myCareer')}</span>
              </TabsTrigger>
              <TabsTrigger value="career-interests" className="text-xs sm:text-sm px-2 py-2 h-auto">
                <span className="truncate">{t('pages.careerPaths.tabs.bookmarks')}</span>
              </TabsTrigger>
              <TabsTrigger value="my-assessments" className="text-xs sm:text-sm px-2 py-2 h-auto">
                <span className="truncate">{t('pages.careerPaths.tabs.assessments')}</span>
              </TabsTrigger>
            </TabsList>

            {/* My Career Tab */}
            <TabsContent value="my-career" className="space-y-6">
              {careerPathProgress.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('pages.careerPaths.myCareer.noProgress')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('pages.careerPaths.myCareer.noProgressDescription')}
                  </p>
                  <Button asChild>
                    <Link to="/search">{t('pages.careerPaths.myCareer.exploreCareers')}</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {careerPathProgress.map((progress) => (
                    <Card key={progress.id} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{progress.pathName}</h3>
                            <Badge variant="outline" className="mt-1">
                              {progress.pathCategory}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProgress(progress.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">{t('pages.careerPaths.myCareer.currentPosition')}</p>
                            <p className="text-sm text-muted-foreground">{progress.currentCareerId}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">{t('pages.careerPaths.myCareer.progress')}</p>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${careerPathProgressService.getProgressPercentage(progress)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">{t('pages.careerPaths.myCareer.nextStep')}</p>
                            <p className="text-sm text-muted-foreground">{t('pages.careerPaths.myCareer.nextStepDescription')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Career Interests Tab */}
            <TabsContent value="career-interests" className="space-y-6">
              {bookmarkedCareers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('pages.careerPaths.bookmarks.noBookmarks')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('pages.careerPaths.bookmarks.noBookmarksDescription')}
                  </p>
                  <Button asChild>
                    <Link to="/search">{t('pages.careerPaths.bookmarks.exploreCareers')}</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {bookmarkedCareers.map((bookmark) => (
                    <Card key={bookmark.id} className="hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{bookmark.title}</h3>
                            <p className="text-sm text-muted-foreground">{bookmark.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBookmark(bookmark.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* My Assessments Tab */}
            <TabsContent value="my-assessments" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
              >
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('pages.careerPaths.assessments.noAssessments')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('pages.careerPaths.assessments.noAssessmentsDescription')}
                </p>
                <Button asChild>
                  <Link to="/skills">{t('pages.careerPaths.assessments.takeAssessment')}</Link>
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNavigation />
    </motion.div>
  );
};

export default MyCareerPathsPage;