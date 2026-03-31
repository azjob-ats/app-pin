import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

interface DeactivateReason {
  value: string;
  label: string;
}

const DEACTIVATE_REASONS: DeactivateReason[] = [
  { value: 'not_useful', label: 'A plataforma não é útil para mim' },
  { value: 'too_many_emails', label: 'Estou recebendo muitos e-mails' },
  { value: 'privacy', label: 'Preocupações com privacidade' },
  { value: 'temporary', label: 'Quero fazer uma pausa temporária' },
  { value: 'duplicate', label: 'Tenho outra conta' },
  { value: 'other', label: 'Outro motivo' },
];

const CONSEQUENCES = [
  { icon: 'visibility_off', text: 'Seu perfil ficará invisível para outros usuários.' },
  { icon: 'block', text: 'Seus conteúdos publicados serão ocultados da plataforma.' },
  { icon: 'notifications_off', text: 'Você não receberá mais notificações.' },
  { icon: 'restore', text: 'Você poderá reativar sua conta a qualquer momento fazendo login.' },
];

type Step = 'reason' | 'confirm';
type FormStatus = 'idle' | 'submitting' | 'deactivated';

@Component({
  selector: 'app-deactivate-account-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent, ButtonComponent],
  styleUrl: './deactivate-account-menu.component.scss',
  template: `
    <div class="deactivate">

      <header class="deactivate__hero">
        <span class="material-symbols-rounded deactivate__hero-icon" aria-hidden="true">gpp_bad</span>
        <h1 class="deactivate__hero-title">Desativar conta</h1>
        <p class="deactivate__hero-description">
          Ao desativar sua conta, seu perfil e conteúdos ficarão ocultos.
          Você poderá reativá-la a qualquer momento fazendo login novamente.
        </p>
      </header>

      @if (formStatus() === 'deactivated') {
        <div class="deactivate__success" role="alert">
          <span class="material-symbols-rounded deactivate__success-icon" aria-hidden="true">check_circle</span>
          <strong class="deactivate__success-title">Conta desativada</strong>
          <p class="deactivate__success-text">
            Sua conta foi desativada com sucesso. Sentiremos sua falta!
            Para reativar, basta fazer login novamente.
          </p>
        </div>
      } @else {

        <section class="deactivate__section" aria-labelledby="consequences-heading">
          <h2 id="consequences-heading" class="deactivate__section-title">O que acontece ao desativar</h2>
          <ul class="deactivate__consequences" role="list">
            @for (item of consequences; track item.text) {
              <li class="deactivate__consequence">
                <span class="material-symbols-rounded deactivate__consequence-icon" aria-hidden="true">{{ item.icon }}</span>
                <span>{{ item.text }}</span>
              </li>
            }
          </ul>
        </section>

        @if (step() === 'reason') {
          <section class="deactivate__section" aria-labelledby="reason-heading">
            <h2 id="reason-heading" class="deactivate__section-title">Por que está saindo?</h2>
            <p class="deactivate__section-subtitle">
              Sua resposta nos ajuda a melhorar a plataforma.
            </p>
            <ul class="deactivate__reasons" role="list">
              @for (reason of reasons; track reason.value) {
                <li>
                  <button
                    type="button"
                    class="deactivate__reason-btn"
                    [class.deactivate__reason-btn--active]="selectedReason() === reason.value"
                    [attr.aria-pressed]="selectedReason() === reason.value"
                    (click)="selectReason(reason.value)"
                  >
                    <span
                      class="deactivate__reason-check"
                      [class.deactivate__reason-check--active]="selectedReason() === reason.value"
                      aria-hidden="true"
                    >
                      <span class="material-symbols-rounded">
                        {{ selectedReason() === reason.value ? 'radio_button_checked' : 'radio_button_unchecked' }}
                      </span>
                    </span>
                    {{ reason.label }}
                  </button>
                </li>
              }
            </ul>
            @if (submittedStep1() && !selectedReason()) {
              <p class="deactivate__field-error" role="alert">Selecione um motivo para continuar</p>
            }
          </section>

          <app-button
            variant="outline"
            [fullWidth]="true"
            (clicked)="goToConfirm()"
          >
            Continuar
          </app-button>
        }

        @if (step() === 'confirm') {
          <section class="deactivate__section" aria-labelledby="confirm-heading">
            <h2 id="confirm-heading" class="deactivate__section-title">Confirmar desativação</h2>
            <p class="deactivate__section-subtitle">
              Digite sua senha para confirmar a desativação da conta.
            </p>

            <div class="deactivate__confirm-form">
              <app-input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                [(ngModel)]="password"
                name="password"
                [errorMessage]="submittedStep2() && !password ? 'Informe sua senha' : ''"
              />

              <div class="deactivate__warning">
                <span class="material-symbols-rounded deactivate__warning-icon" aria-hidden="true">info</span>
                <p class="deactivate__warning-text">
                  Esta ação desativará sua conta imediatamente. Você pode reativar fazendo login a qualquer momento.
                </p>
              </div>
            </div>
          </section>

          <div class="deactivate__confirm-actions">
            <app-button variant="ghost" (clicked)="backToReason()">
              Voltar
            </app-button>
            <app-button
              variant="primary"
              [loading]="formStatus() === 'submitting'"
              (clicked)="submit()"
            >
              Desativar conta
            </app-button>
          </div>
        }

      }

    </div>
  `,
})
export class DeactivateAccountMenuComponent {
  readonly reasons = DEACTIVATE_REASONS;
  readonly consequences = CONSEQUENCES;

  password = '';

  readonly step = signal<Step>('reason');
  readonly selectedReason = signal('');
  readonly submittedStep1 = signal(false);
  readonly submittedStep2 = signal(false);
  readonly formStatus = signal<FormStatus>('idle');

  readonly canProceed = computed(() => !!this.selectedReason());

  selectReason(value: string): void {
    this.selectedReason.set(value);
  }

  goToConfirm(): void {
    this.submittedStep1.set(true);
    if (!this.selectedReason()) return;
    this.step.set('confirm');
  }

  backToReason(): void {
    this.step.set('reason');
    this.submittedStep2.set(false);
  }

  submit(): void {
    this.submittedStep2.set(true);
    if (!this.password) return;
    this.formStatus.set('submitting');
    setTimeout(() => this.formStatus.set('deactivated'), 1200);
  }
}
