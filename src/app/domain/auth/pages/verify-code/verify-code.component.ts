import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../../shared/components/card/card.component';
import { CodeDigitsComponent } from '../../../../shared/components/code-digits/code-digits.component';

@Component({
  selector: 'app-verify-code',
  imports: [RouterLink, TranslateModule, ButtonComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CodeDigitsComponent],
  template: `
    <app-card>
      <app-card-header>
        <div class="d-flex justify-center">
          <span class="material-symbols-rounded text-7xl pin-red">pin</span>
        </div>
        <app-card-title>{{ 'auth.verifyCode' | translate }}</app-card-title>
        <app-card-description>Enter the 6-digit code sent to your email address.</app-card-description>
      </app-card-header>

      <app-card-content>
        <app-code-digits (valueChange)="onCodeChange($event)" />

        <app-button
          variant="primary"
          size="lg"
          [fullWidth]="true"
          [loading]="isLoading()"
          [disabled]="codeValue().length < 6"
          (clicked)="onSubmit()"
        >Verify</app-button>

        <a routerLink="" class="forgot-link text-center">Resend code</a>

        <a routerLink="/auth/login" class="back-link">
          <span class="material-symbols-rounded">arrow_back</span>
          Back to login
        </a>
      </app-card-content>
    </app-card>
  `
})
export class VerifyCodeComponent {
  readonly codeValue = signal('');
  readonly isLoading = signal(false);

  private readonly router = inject(Router);

  onCodeChange(value: string): void {
    this.codeValue.set(value);
  }

  onSubmit(): void {
    if (this.codeValue().length < 6) return;
    this.isLoading.set(true);
    setTimeout(() => { this.isLoading.set(false); this.router.navigate(['/home']); }, 1200);
  }
}
