import { Injectable, signal, effect } from '@angular/core';
import { Theme } from '@shared/enums/theme.enum';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'pin-theme';
  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();
      localStorage.setItem(this.STORAGE_KEY, current);
      document.documentElement.classList.remove(Theme.Light, Theme.Dark);
      document.documentElement.classList.add(current);
    });
  }

  toggle(): void {
    this.theme.update(t => (t === Theme.Light ? Theme.Dark : Theme.Light));
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  get isDark(): boolean {
    return this.theme() === Theme.Dark;
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored && Object.values(Theme).includes(stored)) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light;
  }
}
