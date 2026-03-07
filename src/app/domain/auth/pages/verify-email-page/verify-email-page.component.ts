import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="auth-card verify-card">
      <div class="verify-icon">
        <span class="material-symbols-rounded">mark_email_unread</span>
      </div>
      <h2 class="auth-card-title">{{ 'auth.verifyEmail' | translate }}</h2>
      <p class="verify-text">We sent a verification email to your address. Please check your inbox and click the link to verify your account.</p>
      <button class="submit-btn" (click)="router.navigate(['/auth/verify-code'])">
        {{ 'auth.verifyCode' | translate }}
      </button>
      <button class="text-btn">Resend email</button>
      <a routerLink="/auth/login" class="back-link">
        <span class="material-symbols-rounded">arrow_back</span>
        Back to login
      </a>
    </div>
  `,
  styleUrl: './verify-email-page.component.scss',
})
export class VerifyEmailPageComponent {
  constructor(public router: Router) {}
}
