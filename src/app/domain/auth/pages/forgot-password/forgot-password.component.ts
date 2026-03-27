import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, ButtonComponent, InputComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent],
  template: `
    <app-card>
      <app-card-header>
        <app-card-title>{{ 'auth.forgotPassword' | translate }}</app-card-title>
        <app-card-description>We'll send a link to reset your password</app-card-description>
      </app-card-header>

      <app-card-content>
        <app-input
          type="email"
          [label]="'auth.email' | translate"
          [placeholder]="'auth.email' | translate"
          [ngModel]="email()"
          (ngModelChange)="email.set($event)"
          (enter)="onSubmit()"
        />

        @if (sent()) {
          <div class="success-msg">
            <span class="material-symbols-rounded">mark_email_read</span>
            {{ 'auth.emailSent' | translate }}
          </div>
        }

        <app-button
          variant="primary"
          size="lg"
          [fullWidth]="true"
          [loading]="isLoading()"
          [disabled]="!email() || sent()"
          (clicked)="onSubmit()"
        >Send reset link</app-button>

        <a routerLink="/auth/login" class="back-link">
          <span class="material-symbols-rounded">arrow_back</span>
          {{ 'common.back' | translate }} to login
        </a>
      </app-card-content>
    </app-card>
  `,
})
export class ForgotPasswordComponent {
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
