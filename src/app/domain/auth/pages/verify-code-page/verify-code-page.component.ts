import { Component, signal, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-verify-code-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, ButtonComponent],
  template: `
    <div class="auth-card verify-card">
      <div class="verify-icon">
        <span class="material-symbols-rounded">pin</span>
      </div>
      <h2 class="auth-card-title">{{ 'auth.verifyCode' | translate }}</h2>
      <p class="verify-text">Enter the 6-digit code sent to your email address.</p>

      <div class="code-inputs">
        @for (i of [0,1,2,3,4,5]; track i) {
          <input
            #codeInput
            class="code-input"
            type="text"
            maxlength="1"
            [value]="codeDigits()[i]"
            (input)="onDigitInput($event, i)"
            (keydown.backspace)="onBackspace(i)"
            (paste)="onPaste($event)"
          />
        }
      </div>

      <app-button
        variant="primary"
        size="lg"
        [fullWidth]="true"
        [loading]="isLoading()"
        [disabled]="codeValue.length < 6"
        (clicked)="onSubmit()"
      >Verify</app-button>

      <button class="text-btn">Resend code</button>

      <a routerLink="/auth/login" class="back-link">
        <span class="material-symbols-rounded">arrow_back</span>
        Back to login
      </a>
    </div>
  `,
  styleUrl: './verify-code-page.component.scss',
})
export class VerifyCodePageComponent {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  readonly codeDigits = signal<string[]>(['', '', '', '', '', '']);
  readonly isLoading = signal(false);

  constructor(private router: Router) {}

  get codeValue(): string {
    return this.codeDigits().join('');
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    const digits = [...this.codeDigits()];
    digits[index] = val;
    this.codeDigits.set(digits);
    if (val && index < 5) {
      const inputs = this.codeInputs.toArray();
      inputs[index + 1]?.nativeElement.focus();
    }
  }

  onBackspace(index: number): void {
    const digits = [...this.codeDigits()];
    if (!digits[index] && index > 0) {
      const inputs = this.codeInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    }
    digits[index] = '';
    this.codeDigits.set(digits);
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    const filled = [...Array(6)].map((_, i) => digits[i] ?? '');
    this.codeDigits.set(filled);
  }

  onSubmit(): void {
    if (this.codeValue.length < 6) return;
    this.isLoading.set(true);
    setTimeout(() => { this.isLoading.set(false); this.router.navigate(['/home']); }, 1200);
  }
}
