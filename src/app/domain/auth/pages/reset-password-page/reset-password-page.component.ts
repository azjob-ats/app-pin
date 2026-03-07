import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <div class="auth-card">
      <h2 class="auth-card-title">{{ 'auth.resetPassword' | translate }}</h2>
      <div class="form-field">
        <label class="form-label">{{ 'auth.password' | translate }}</label>
        <div class="input-with-action">
          <input class="form-input" [type]="showPwd() ? 'text' : 'password'" placeholder="New password"
            [ngModel]="password()" (ngModelChange)="password.set($event)" />
          <button class="input-action-btn" type="button" (click)="showPwd.update(v => !v)">
            <span class="material-symbols-rounded">{{ showPwd() ? 'visibility_off' : 'visibility' }}</span>
          </button>
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">{{ 'auth.confirmPassword' | translate }}</label>
        <input class="form-input" type="password" placeholder="Confirm new password"
          [ngModel]="confirm()" (ngModelChange)="confirm.set($event)" />
      </div>
      @if (password() && confirm() && password() !== confirm()) {
        <p class="error-msg">Passwords don't match.</p>
      }
      <button class="submit-btn" (click)="onSubmit()" [disabled]="!password() || password() !== confirm() || isLoading()">
        @if (isLoading()) { <span class="spinner-sm"></span> }
        {{ 'auth.resetPassword' | translate }}
      </button>
    </div>
  `,
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent {
  readonly password = signal('');
  readonly confirm = signal('');
  readonly isLoading = signal(false);
  readonly showPwd = signal(false);
  constructor(private router: Router) {}
  onSubmit(): void {
    this.isLoading.set(true);
    setTimeout(() => { this.isLoading.set(false); this.router.navigate(['/auth/login']); }, 1200);
  }
}
