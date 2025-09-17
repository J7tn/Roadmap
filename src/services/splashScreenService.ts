import { SplashScreen } from '@capacitor/splash-screen';

class SplashScreenService {
  private static instance: SplashScreenService;
  private isHidden = false;
  private hidePromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): SplashScreenService {
    if (!SplashScreenService.instance) {
      SplashScreenService.instance = new SplashScreenService();
    }
    return SplashScreenService.instance;
  }

  /**
   * Hide the splash screen if it hasn't been hidden already
   */
  public async hide(): Promise<void> {
    if (this.isHidden) {
      return;
    }

    if (this.hidePromise) {
      return this.hidePromise;
    }

    this.hidePromise = this.performHide();
    return this.hidePromise;
  }

  private async performHide(): Promise<void> {
    try {
      await SplashScreen.hide();
      this.isHidden = true;
      console.log('✅ Splash screen hidden successfully');
    } catch (error) {
      console.warn('⚠️ Failed to hide splash screen:', error);
      this.isHidden = true; // Mark as hidden even if the call failed
    }
  }

  /**
   * Check if splash screen is already hidden
   */
  public isSplashHidden(): boolean {
    return this.isHidden;
  }

  /**
   * Force hide splash screen (for fallback scenarios)
   */
  public async forceHide(): Promise<void> {
    this.isHidden = true;
    try {
      await SplashScreen.hide();
      console.log('✅ Splash screen force hidden');
    } catch (error) {
      console.warn('⚠️ Failed to force hide splash screen:', error);
    }
  }
}

export default SplashScreenService;
