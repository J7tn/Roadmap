import { ICareerNode, ICareerPath } from '@/types/career';

export interface CareerPathProgress {
  id: string;
  pathId: string;
  pathName: string;
  pathCategory: string;
  currentStep: number; // Index of current step in the path
  totalSteps: number;
  completedSteps: number[];
  startedAt: string;
  lastUpdated: string;
  currentCareerId: string; // ID of the current career in the path
  pathNodes: ICareerNode[]; // Full path for reference
}

class CareerPathProgressService {
  private readonly STORAGE_KEY = 'careering_career_path_progress';

  /**
   * Get all career path progress entries
   */
  getAllProgress(): CareerPathProgress[] {
    try {
      const progress = localStorage.getItem(this.STORAGE_KEY);
      return progress ? JSON.parse(progress) : [];
    } catch (error) {
      console.error('Error loading career path progress:', error);
      return [];
    }
  }

  /**
   * Get progress for a specific career path
   */
  getProgressByPathId(pathId: string): CareerPathProgress | null {
    const allProgress = this.getAllProgress();
    return allProgress.find(progress => progress.pathId === pathId) || null;
  }

  /**
   * Get progress for a specific career (if it's part of a saved path)
   */
  getProgressByCareerId(careerId: string): CareerPathProgress | null {
    const allProgress = this.getAllProgress();
    return allProgress.find(progress => 
      progress.pathNodes.some(node => node.id === careerId)
    ) || null;
  }

  /**
   * Start tracking progress for a career path
   */
  startCareerPath(careerPath: ICareerPath, startingCareerId: string): CareerPathProgress {
    const existingProgress = this.getProgressByPathId(careerPath.id);
    
    if (existingProgress) {
      // Update existing progress
      return this.updateProgress(existingProgress.id, startingCareerId);
    }

    // Create new progress entry
    const startingIndex = careerPath.nodes.findIndex(node => node.id === startingCareerId);
    const progress: CareerPathProgress = {
      id: `progress_${careerPath.id}_${Date.now()}`,
      pathId: careerPath.id,
      pathName: careerPath.n,
      pathCategory: careerPath.cat,
      currentStep: startingIndex >= 0 ? startingIndex : 0,
      totalSteps: careerPath.nodes.length,
      completedSteps: startingIndex >= 0 ? [startingIndex] : [],
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      currentCareerId: startingCareerId,
      pathNodes: careerPath.nodes
    };

    this.saveProgress(progress);
    this.notifyUpdate();
    return progress;
  }

  /**
   * Update progress to a specific career in the path
   */
  updateProgress(progressId: string, newCareerId: string): CareerPathProgress | null {
    const allProgress = this.getAllProgress();
    const progressIndex = allProgress.findIndex(p => p.id === progressId);
    
    if (progressIndex === -1) return null;

    const progress = allProgress[progressIndex];
    const newIndex = progress.pathNodes.findIndex(node => node.id === newCareerId);
    
    if (newIndex === -1) return progress;

    // Update progress
    progress.currentStep = newIndex;
    progress.currentCareerId = newCareerId;
    progress.lastUpdated = new Date().toISOString();

    // Add to completed steps if not already there
    if (!progress.completedSteps.includes(newIndex)) {
      progress.completedSteps.push(newIndex);
      progress.completedSteps.sort((a, b) => a - b);
    }

    allProgress[progressIndex] = progress;
    this.saveAllProgress(allProgress);
    this.notifyUpdate();
    return progress;
  }

  /**
   * Mark a step as completed
   */
  markStepCompleted(progressId: string, stepIndex: number): CareerPathProgress | null {
    const allProgress = this.getAllProgress();
    const progressIndex = allProgress.findIndex(p => p.id === progressId);
    
    if (progressIndex === -1) return null;

    const progress = allProgress[progressIndex];
    
    if (!progress.completedSteps.includes(stepIndex)) {
      progress.completedSteps.push(stepIndex);
      progress.completedSteps.sort((a, b) => a - b);
      progress.lastUpdated = new Date().toISOString();
      
      allProgress[progressIndex] = progress;
      this.saveAllProgress(allProgress);
      this.notifyUpdate();
    }

    return progress;
  }

  /**
   * Remove a career path progress
   */
  removeProgress(progressId: string): boolean {
    try {
      const allProgress = this.getAllProgress();
      const filtered = allProgress.filter(p => p.id !== progressId);
      this.saveAllProgress(filtered);
      this.notifyUpdate();
      return true;
    } catch (error) {
      console.error('Error removing career path progress:', error);
      return false;
    }
  }

  /**
   * Get progress percentage for a career path
   */
  getProgressPercentage(progress: CareerPathProgress): number {
    return Math.round((progress.completedSteps.length / progress.totalSteps) * 100);
  }

  /**
   * Check if a career path is being tracked
   */
  isPathTracked(pathId: string): boolean {
    return this.getProgressByPathId(pathId) !== null;
  }

  /**
   * Get the next step in a career path
   */
  getNextStep(progress: CareerPathProgress): ICareerNode | null {
    const nextIndex = progress.currentStep + 1;
    return nextIndex < progress.totalSteps ? progress.pathNodes[nextIndex] : null;
  }

  /**
   * Get the previous step in a career path
   */
  getPreviousStep(progress: CareerPathProgress): ICareerNode | null {
    const prevIndex = progress.currentStep - 1;
    return prevIndex >= 0 ? progress.pathNodes[prevIndex] : null;
  }

  /**
   * Save a single progress entry
   */
  private saveProgress(progress: CareerPathProgress): void {
    const allProgress = this.getAllProgress();
    const existingIndex = allProgress.findIndex(p => p.id === progress.id);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    this.saveAllProgress(allProgress);
  }

  /**
   * Save all progress entries
   */
  private saveAllProgress(allProgress: CareerPathProgress[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving career path progress:', error);
    }
  }

  /**
   * Notify components of updates
   */
  private notifyUpdate(): void {
    window.dispatchEvent(new CustomEvent('careerPathProgressUpdated'));
  }
}

export const careerPathProgressService = new CareerPathProgressService();
