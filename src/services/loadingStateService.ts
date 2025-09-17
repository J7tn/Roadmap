class LoadingStateService {
  private static instance: LoadingStateService;
  private loadingStates: Map<string, boolean> = new Map();
  private listeners: Set<(isLoading: boolean) => void> = new Set();

  private constructor() {}

  public static getInstance(): LoadingStateService {
    if (!LoadingStateService.instance) {
      LoadingStateService.instance = new LoadingStateService();
    }
    return LoadingStateService.instance;
  }

  /**
   * Set loading state for a specific component
   */
  public setLoading(componentId: string, isLoading: boolean): void {
    this.loadingStates.set(componentId, isLoading);
    this.notifyListeners();
  }

  /**
   * Check if any critical components are still loading
   */
  public isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }

  /**
   * Check if all critical components are loaded
   */
  public areAllLoaded(): boolean {
    return Array.from(this.loadingStates.values()).every(loading => !loading);
  }

  /**
   * Get loading state for a specific component
   */
  public isLoading(componentId: string): boolean {
    return this.loadingStates.get(componentId) || false;
  }

  /**
   * Subscribe to loading state changes
   */
  public subscribe(listener: (isLoading: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of loading state changes
   */
  private notifyListeners(): void {
    const isLoading = this.isAnyLoading();
    this.listeners.forEach(listener => listener(isLoading));
  }

  /**
   * Reset all loading states
   */
  public reset(): void {
    this.loadingStates.clear();
    this.notifyListeners();
  }
}

export default LoadingStateService;
