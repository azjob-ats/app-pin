import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ButtonComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent],
  template: `
    <app-card>
      <app-card-header>
        <div class="d-flex justify-center">
          <span class="material-symbols-rounded text-7xl pin-red">mark_email_unread</span>
        </div>
        <app-card-title>{{ 'auth.verifyEmail' | translate }}</app-card-title>
        <app-card-description>We sent a verification email to your address. Please check your inbox and click the link to verify your account.</app-card-description>
      </app-card-header>

      <app-card-content>
        <app-button
          variant="primary"
          size="lg"
          [fullWidth]="true"
          (clicked)="router.navigate(['/auth/verify-code'])"
        >{{ 'auth.verifyCode' | translate }}</app-button>
        <a routerLink="" class="forgot-link text-center">Resend email</a>
        <a routerLink="/auth/login" class="back-link">
          <span class="material-symbols-rounded">arrow_back</span>
          Back to login
        </a>
      </app-card-content>
    </app-card>
  `
})
export class VerifyEmailComponent {
  constructor(public router: Router) {}
}
