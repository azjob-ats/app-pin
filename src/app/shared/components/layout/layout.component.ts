import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { NotificationService } from '../../services/notification.service';
import { Language } from '../../enums/language.enum';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';

interface NavItem {
  icon: string;
  iconFilled: string;
  labelKey: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    FormsModule,
    SearchBarComponent,
    BadgeModule,
    TooltipModule,
    PopoverModule,
    ButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);
  readonly notifService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly isMobileMenuOpen = signal(false);
  readonly isMobile = signal(window.innerWidth < 768);

  readonly navItems: NavItem[] = [
    { icon: 'home', iconFilled: 'home', labelKey: 'nav.home', route: '/home', exact: true },
    { icon: 'explore', iconFilled: 'explore', labelKey: 'nav.explore', route: '/explore' },
    { icon: 'add_circle', iconFilled: 'add_circle', labelKey: 'nav.create', route: '/create' },
    { icon: 'notifications', iconFilled: 'notifications', labelKey: 'nav.notifications', route: '/notifications' },
  ];

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  setLanguage(lang: Language): void {
    this.languageService.setLang(lang);
  }

  navigateToProfile(): void {
    this.router.navigate(['/fondecranvip']);
  }

  onSearch(query: string): void {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  goToAuth(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
