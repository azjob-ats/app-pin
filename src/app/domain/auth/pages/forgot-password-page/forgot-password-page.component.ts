import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <div class="auth-card">
      <h2 class="auth-card-title">{{ 'auth.forgotPassword' | translate }}</h2>
      <p class="auth-subtitle">We'll send a link to reset your password</p>

      <div class="form-field">
        <label class="form-label">{{ 'auth.email' | translate }}</label>
        <input class="form-input" type="email" [placeholder]="'auth.email' | translate"
          [ngModel]="email()" (ngModelChange)="email.set($event)" (keydown.enter)="onSubmit()" />
      </div>

      @if (sent()) {
        <div class="success-msg">
          <span class="material-symbols-rounded">mark_email_read</span>
          {{ 'auth.emailSent' | translate }}
        </div>
      }

      <button class="submit-btn" (click)="onSubmit()" [disabled]="!email() || isLoading() || sent()">
        @if (isLoading()) { <span class="spinner-sm"></span> }
        Send reset link
      </button>

      <a routerLink="/auth/login" class="back-link">
        <span class="material-symbols-rounded">arrow_back</span>
        {{ 'common.back' | translate }} to login
      </a>
    </div>
  `,
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent {
  readonly email = signal('');
  readonly isLoading = signal(false);
  readonly sent = signal(false);

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.email() || this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => { this.isLoading.set(false); this.sent.set(true); }, 1200);
  }
}
