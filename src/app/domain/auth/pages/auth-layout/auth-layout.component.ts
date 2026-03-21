import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, TranslateModule, NgOptimizedImage],
  template: `
    <div class="auth-layout">
      <div class="auth-header">
        <a routerLink="/home" class="auth-logo">
          <img ngSrc="assets/images/logo-az-circlar.png" width="60" height="60" alt="ToGuideX" />
        </a>
      </div>
      <div class="auth-body">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      background: var(--pin-bg);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .auth-header {
      padding: 24px;
    }
    .auth-logo {
      display: block;
    }
    .auth-body {
      width: 100%;
      max-width: 400px;
      padding: 0 16px 32px;
    }
  `],
})
export class AuthLayoutComponent {}
