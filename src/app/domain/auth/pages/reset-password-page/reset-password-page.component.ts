import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, ButtonComponent, InputComponent],
  template: `
    <div class="auth-card">
      <h2 class="auth-card-title">{{ 'auth.resetPassword' | translate }}</h2>

      <app-input
        type="password"
        [label]="'auth.password' | translate"
        placeholder="New password"
        [ngModel]="password()"
        (ngModelChange)="password.set($event)"
      />

      <app-input
        type="password"
        [label]="'auth.confirmPassword' | translate"
        placeholder="Confirm new password"
        [ngModel]="confirm()"
        (ngModelChange)="confirm.set($event)"
        [errorMessage]="confirmError()"
      />

      <app-button
        variant="primary"
        size="lg"
        [fullWidth]="true"
        [loading]="isLoading()"
        [disabled]="!password() || passwordMismatch()"
        (clicked)="onSubmit()"
      >{{ 'auth.resetPassword' | translate }}</app-button>
    </div>
  `,
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent {
  readonly password = signal('');
  readonly confirm = signal('');
  readonly isLoading = signal(false);

  readonly passwordMismatch = computed(() => !!this.confirm() && this.password() !== this.confirm());
  readonly confirmError = computed(() => this.passwordMismatch() ? 'Passwords do not match.' : '');

  constructor(private router: Router) {}

  onSubmit(): void {
    this.isLoading.set(true);
    setTimeout(() => { this.isLoading.set(false); this.router.navigate(['/auth/login']); }, 1200);
  }
}
