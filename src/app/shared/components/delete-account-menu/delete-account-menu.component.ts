import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

interface DeleteReason {
  value: string;
  label: string;
}

const DELETE_REASONS: DeleteReason[] = [
  { value: 'privacy', label: 'Preocupações com privacidade ou segurança' },
  { value: 'not_useful', label: 'A plataforma não atende às minhas necessidades' },
  { value: 'too_complex', label: 'Difícil de usar' },
  { value: 'found_alternative', label: 'Encontrei uma alternativa melhor' },
  { value: 'temporary', label: 'Não quero mais usar redes sociais profissionais' },
  { value: 'other', label: 'Outro motivo' },
];

const CONSEQUENCES = [
  { icon: 'person_off', text: 'Seu perfil será removido permanentemente.' },
  { icon: 'delete_forever', text: 'Todos os seus conteúdos, pins e comentários serão excluídos.' },
  { icon: 'group_remove', text: 'Suas conexões e seguidores serão perdidos.' },
  { icon: 'folder_delete', text: 'Seu histórico de atividades será apagado.' },
  { icon: 'block', text: 'Esta ação não poderá ser desfeita de nenhuma forma.' },
];

type Step = 'warning' | 'reason' | 'confirm';
type FormStatus = 'idle' | 'submitting' | 'deleted';

const CONFIRM_PHRASE = 'ENCERRAR MINHA CONTA';

@Component({
  selector: 'app-delete-account-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent, ButtonComponent],
  styleUrl: './delete-account-menu.component.scss',
  template: `
    <div class="delete-account">

      <header class="delete-account__hero">
        <span class="material-symbols-rounded delete-account__hero-icon" aria-hidden="true">delete_forever</span>
        <h1 class="delete-account__hero-title">Encerrar conta</h1>
        <p class="delete-account__hero-description">
          Remova sua conta permanentemente. Esta ação excluirá todos os seus
          dados e histórico da plataforma.
        </p>
      </header>

      @if (formStatus() === 'deleted') {

        <div class="delete-account__success" role="alert">
          <span class="material-symbols-rounded delete-account__success-icon" aria-hidden="true">check_circle</span>
          <strong class="delete-account__success-title">Conta encerrada</strong>
          <p class="delete-account__success-text">
            Sua conta foi removida permanentemente. Obrigado por ter feito parte da RealWe.
          </p>
        </div>

      } @else {

        <div class="delete-account__stepper" aria-label="Etapas">
          @for (s of steps; track s.key) {
            <div
              class="delete-account__step"
              [class.delete-account__step--active]="step() === s.key"
              [class.delete-account__step--done]="isStepDone(s.key)"
            >
              <span class="delete-account__step-dot" aria-hidden="true">
                @if (isStepDone(s.key)) {
                  <span class="material-symbols-rounded">check</span>
                } @else {
                  {{ s.index }}
                }
              </span>
              <span class="delete-account__step-label">{{ s.label }}</span>
            </div>
          }
        </div>

        @if (step() === 'warning') {
          <section class="delete-account__section" aria-labelledby="consequences-heading">
            <h2 id="consequences-heading" class="delete-account__section-title">
              O que será excluído permanentemente
            </h2>
            <ul class="delete-account__consequences" role="list">
              @for (item of consequences; track item.text) {
                <li class="delete-account__consequence">
                  <span class="material-symbols-rounded delete-account__consequence-icon" aria-hidden="true">{{ item.icon }}</span>
                  <span>{{ item.text }}</span>
                </li>
              }
            </ul>
          </section>

          <div class="delete-account__alert">
            <span class="material-symbols-rounded delete-account__alert-icon" aria-hidden="true">warning</span>
            <p class="delete-account__alert-text">
              Diferente da desativação, o encerramento é <strong>irreversível</strong>.
              Não será possível recuperar seus dados após confirmar.
            </p>
          </div>

          <div class="delete-account__actions">
            <app-button variant="outline" (clicked)="nextStep()">
              Entendi, continuar
            </app-button>
          </div>
        }

        @if (step() === 'reason') {
          <section class="delete-account__section" aria-labelledby="reason-heading">
            <h2 id="reason-heading" class="delete-account__section-title">Por que está encerrando?</h2>
            <p class="delete-account__section-subtitle">
              Sua resposta nos ajuda a melhorar a plataforma.
            </p>
            <ul class="delete-account__reasons" role="list">
              @for (reason of reasons; track reason.value) {
                <li>
                  <button
                    type="button"
                    class="delete-account__reason-btn"
                    [class.delete-account__reason-btn--active]="selectedReason() === reason.value"
                    [attr.aria-pressed]="selectedReason() === reason.value"
                    (click)="selectReason(reason.value)"
                  >
                    <span
                      class="delete-account__reason-radio"
                      [class.delete-account__reason-radio--active]="selectedReason() === reason.value"
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
            @if (submittedReason() && !selectedReason()) {
              <p class="delete-account__field-error" role="alert">Selecione um motivo para continuar</p>
            }
          </section>

          <div class="delete-account__actions">
            <app-button variant="ghost" (clicked)="prevStep()">Voltar</app-button>
            <app-button variant="outline" (clicked)="goToConfirm()">Continuar</app-button>
          </div>
        }

        @if (step() === 'confirm') {
          <section class="delete-account__section" aria-labelledby="confirm-heading">
            <h2 id="confirm-heading" class="delete-account__section-title">Confirmação final</h2>
            <p class="delete-account__section-subtitle">
              Para confirmar, digite exatamente a frase abaixo:
            </p>

            <div class="delete-account__phrase-box" aria-label="Frase de confirmação">
              {{ confirmPhrase }}
            </div>

            <div class="delete-account__confirm-fields">
              <app-input
                label="Digite a frase de confirmação"
                placeholder="{{ confirmPhrase }}"
                [(ngModel)]="confirmInput"
                name="confirmInput"
                [errorMessage]="submittedConfirm() && !isPhraseValid() ? 'A frase não confere' : ''"
              />
              <app-input
                label="Senha atual"
                type="password"
                placeholder="Digite sua senha"
                [(ngModel)]="password"
                name="password"
                [errorMessage]="submittedConfirm() && !password ? 'Informe sua senha' : ''"
              />
            </div>
          </section>

          <div class="delete-account__actions">
            <app-button variant="ghost" (clicked)="prevStep()">Voltar</app-button>
            <app-button
              variant="primary"
              [loading]="formStatus() === 'submitting'"
              (clicked)="submit()"
            >
              Encerrar conta
            </app-button>
          </div>
        }

      }

    </div>
  `,
})
export class DeleteAccountMenuComponent {
  readonly reasons = DELETE_REASONS;
  readonly consequences = CONSEQUENCES;
  readonly confirmPhrase = CONFIRM_PHRASE;

  readonly steps = [
    { key: 'warning' as Step, index: 1, label: 'Aviso' },
    { key: 'reason' as Step, index: 2, label: 'Motivo' },
    { key: 'confirm' as Step, index: 3, label: 'Confirmação' },
  ];

  confirmInput = '';
  password = '';

  readonly step = signal<Step>('warning');
  readonly selectedReason = signal('');
  readonly submittedReason = signal(false);
  readonly submittedConfirm = signal(false);
  readonly formStatus = signal<FormStatus>('idle');

  readonly isPhraseValid = computed(
    () => this.confirmInput.trim().toUpperCase() === CONFIRM_PHRASE,
  );

  isStepDone(key: Step): boolean {
    const order: Step[] = ['warning', 'reason', 'confirm'];
    return order.indexOf(key) < order.indexOf(this.step());
  }

  nextStep(): void {
    this.step.set('reason');
  }

  prevStep(): void {
    const order: Step[] = ['warning', 'reason', 'confirm'];
    const idx = order.indexOf(this.step());
    if (idx > 0) this.step.set(order[idx - 1]);
  }

  selectReason(value: string): void {
    this.selectedReason.set(value);
  }

  goToConfirm(): void {
    this.submittedReason.set(true);
    if (!this.selectedReason()) return;
    this.step.set('confirm');
  }

  submit(): void {
    this.submittedConfirm.set(true);
    if (!this.isPhraseValid() || !this.password) return;
    this.formStatus.set('submitting');
    setTimeout(() => this.formStatus.set('deleted'), 1400);
  }
}
