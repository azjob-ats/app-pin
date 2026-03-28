import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { filter } from 'rxjs';
import { SeoService } from '@shared/services/seo.service';
import { LanguageService } from '@shared/services/language.service';
import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: [':host { display: block; height: 100%; }'],
})
export class App {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);

  constructor() {
    injectAnalytics();
    injectSpeedInsights();
    this.listenToRouteChanges();
  }

  private listenToRouteChanges(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) route = route.firstChild;

        const { title, description } = route.snapshot.data as {
          title?: string;
          description?: string;
        };

        if (title) {
          this.seoService.setPage(title, description);
        } else {
          this.seoService.setDefault();
        }
      });
  }
}
