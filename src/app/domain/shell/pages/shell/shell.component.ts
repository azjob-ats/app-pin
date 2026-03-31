import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@shared/services/theme.service';
import { LanguageService } from '@shared/services/language.service';
import { NotificationService } from '@shared/services/notification.service';
import { Language } from '@shared/enums/language.enum';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DrawerMenuComponent } from '@shared/components/drawer-menu/drawer-menu.component';
import { PopoverComponent } from '@shared/components/popover/popover.component';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip.directive';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { SidebarHeaderComponent } from '@shared/components/sidebar/sidebar-header.component';
import { SidebarContentComponent } from '@shared/components/sidebar/sidebar-content.component';
import { SidebarGroupComponent } from '@shared/components/sidebar/sidebar-group.component';
import { SidebarFooterComponent } from '@shared/components/sidebar/sidebar-footer.component';
import { TopbarComponent } from '@shared/components/topbar/topbar.component';
import { TopbarContentComponent } from '@shared/components/topbar/topbar-content.component';
import { TopbarGroupComponent } from '@shared/components/topbar/topbar-group.component';

interface NavItem {
  icon: string;
  iconFilled: string;
  labelKey: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    TranslateModule,
    FormsModule,
    SearchBarComponent,
    ButtonComponent,
    DrawerMenuComponent,
    PopoverComponent,
    TooltipDirective,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarContentComponent,
    SidebarGroupComponent,
    SidebarFooterComponent,
    TopbarComponent,
    TopbarContentComponent,
    TopbarGroupComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class ShellComponent {
  readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);
  readonly notifService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly isMobileMenuOpen = signal(false);
  readonly isMobile = signal(window.innerWidth < 768);

  readonly navItems: NavItem[] = [
    { icon: 'home', iconFilled: 'home', labelKey: 'nav.home', route: '/home', exact: true },
    { icon: 'kid_star', iconFilled: 'kid_star', labelKey: 'nav.explore', route: '/explore' },
    { icon: 'add_circle', iconFilled: 'add_circle', labelKey: 'nav.create', route: '/create' },
    {
      icon: 'notifications',
      iconFilled: 'notifications',
      labelKey: 'nav.notifications',
      route: '/notifications',
    },
  ];

  onResize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  setLanguage(lang: Language): void {
    this.languageService.setLang(lang);
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
