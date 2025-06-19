export class DarkModeToggle {
  private isDark: boolean = false;
  
  constructor() {
    this.isDark = localStorage.getItem('darkMode') === 'true' || 
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme();
  }
  
  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', this.isDark.toString());
    this.applyTheme();
  }
  
  private applyTheme(): void {
    const root = document.documentElement;
    
    if (this.isDark) {
      root.style.setProperty('--bg-color', '#1a1a1a');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--card-bg', '#2d2d2d');
      document.body.classList.add('dark');
    } else {
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--card-bg', '#ffffff');
      document.body.classList.remove('dark');
    }
  }
  
  getCurrentTheme(): 'light' | 'dark' {
    return this.isDark ? 'dark' : 'light';
  }
}

export const darkMode = new DarkModeToggle();