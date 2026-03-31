import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

interface StrengthRule {
  label: string;
  test: (password: string) => boolean;
}

const STRENGTH_RULES: StrengthRule[] = [
  { label: 'Mínimo de 8 caracteres', test: (p) => p.length >= 8 },
  { label: 'Letra maiúscula (A–Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'Letra minúscula (a–z)', test: (p) => /[a-z]/.test(p) },
  { label: 'Número (0–9)', test: (p) => /[0-9]/.test(p) },
  { label: 'Caractere especial (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

type FormStatus = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'app-change-password-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent, ButtonComponent],
  styleUrl: './change-password-menu.component.scss',
  template: `
    <div class="change-password">

      <header class="change-password__hero">
        <span class="material-symbols-rounded change-password__hero-icon" aria-hidden="true">lock</span>
        <h1 class="change-password__hero-title">Alterar senha</h1>
        <p class="change-password__hero-description">
          Crie uma senha forte e exclusiva para manter sua conta segura.
        </p>
      </header>

      @if (formStatus() === 'saved') {
        <div class="change-password__success" role="alert">
          <span class="material-symbols-rounded change-password__success-icon" aria-hidden="true">check_circle</span>
          <strong class="change-password__success-title">Senha alterada com sucesso!</strong>
          <p class="change-password__success-text">
            Sua nova senha já está ativa. Utilize-a no próximo acesso.
          </p>
          <app-button variant="outline" (clicked)="reset()">Alterar novamente</app-button>
        </div>
      } @else {
        <form class="change-password__form" (ngSubmit)="submit()" novalidate>

          <section class="change-password__section" aria-labelledby="current-heading">
            <h2 id="current-heading" class="change-password__section-title">Senha atual</h2>
            <app-input
              label="Senha atual"
              type="password"
              placeholder="Digite sua senha atual"
              [(ngModel)]="currentPassword"
              name="currentPassword"
              [errorMessage]="submitted() && !currentPassword ? 'Informe sua senha atual' : ''"
            />
          </section>

          <section class="change-password__section" aria-labelledby="new-heading">
            <h2 id="new-heading" class="change-password__section-title">Nova senha</h2>
            <div class="change-password__fields">
              <app-input
                label="Nova senha"
                type="password"
                placeholder="Digite sua nova senha"
                [(ngModel)]="newPassword"
                name="newPassword"
                (ngModelChange)="onNewPasswordChange($event)"
                [errorMessage]="newPasswordError()"
              />

              <div class="change-password__strength" aria-label="Força da senha">
                <div class="change-password__strength-bars" aria-hidden="true">
                  @for (bar of strengthBars; track $index) {
                    <div
                      class="change-password__strength-bar"
                      [class.change-password__strength-bar--filled]="$index < strengthScore()"
                      [style.background]="$index < strengthScore() ? strengthColor() : ''"
                    ></div>
                  }
                </div>
                @if (newPassword) {
                  <span class="change-password__strength-label" [style.color]="strengthColor()">
                    {{ strengthLabel() }}
                  </span>
                }
              </div>

              <ul class="change-password__rules" role="list" aria-label="Requisitos da senha">
                @for (rule of rules; track rule.label) {
                  <li
                    class="change-password__rule"
                    [class.change-password__rule--ok]="rule.test(newPassword)"
                  >
                    <span class="material-symbols-rounded change-password__rule-icon" aria-hidden="true">
                      {{ rule.test(newPassword) ? 'check_circle' : 'radio_button_unchecked' }}
                    </span>
                    {{ rule.label }}
                  </li>
                }
              </ul>

              <app-input
                label="Confirmar nova senha"
                type="password"
                placeholder="Repita a nova senha"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                [errorMessage]="confirmPasswordError()"
              />
            </div>
          </section>

          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            icon="lock_reset"
            [loading]="formStatus() === 'saving'"
          >
            Alterar senha
          </app-button>

        </form>
      }

    </div>
  `,
})
export class ChangePasswordMenuComponent {
  readonly rules = STRENGTH_RULES;
  readonly strengthBars = [0, 1, 2, 3, 4];

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  readonly submitted = signal(false);
  readonly formStatus = signal<FormStatus>('idle');
  readonly _newPassword = signal('');

  readonly strengthScore = computed(() => {
    const p = this._newPassword();
    return STRENGTH_RULES.filter((r) => r.test(p)).length;
  });

  readonly strengthLabel = computed(() => {
    const score = this.strengthScore();
    if (score <= 1) return 'Muito fraca';
    if (score === 2) return 'Fraca';
    if (score === 3) return 'Razoável';
    if (score === 4) return 'Forte';
    return 'Muito forte';
  });

  readonly strengthColor = computed(() => {
    const score = this.strengthScore();
    if (score <= 1) return '#dc2626';
    if (score === 2) return '#f97316';
    if (score === 3) return '#eab308';
    if (score === 4) return '#22c55e';
    return '#16a34a';
  });

  readonly newPasswordError = computed(() => {
    if (!this.submitted()) return '';
    if (!this.newPassword) return 'Informe a nova senha';
    if (this.strengthScore() < 3) return 'A senha não atende os requisitos mínimos';
    return '';
  });

  readonly confirmPasswordError = computed(() => {
    if (!this.submitted()) return '';
    if (!this.confirmPassword) return 'Confirme a nova senha';
    if (this.confirmPassword !== this.newPassword) return 'As senhas não coincidem';
    return '';
  });

  onNewPasswordChange(value: string): void {
    this._newPassword.set(value);
  }

  submit(): void {
    this.submitted.set(true);
    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmPassword ||
      this.strengthScore() < 3 ||
      this.confirmPassword !== this.newPassword
    ) return;

    this.formStatus.set('saving');
    setTimeout(() => this.formStatus.set('saved'), 1100);
  }

  reset(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this._newPassword.set('');
    this.submitted.set(false);
    this.formStatus.set('idle');
  }
}
