import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { LanguageService } from './shared/services/language.service';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject as injectAnalytics } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: [':host { display: block; height: 100%; }'],
})
export class App {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  constructor() {
    injectSpeedInsights();
    injectAnalytics();
  }
}
