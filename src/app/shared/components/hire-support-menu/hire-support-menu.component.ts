import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

interface SupportChannel {
  icon: string;
  title: string;
  description: string;
  availability: string;
}

const SUPPORT_CHANNELS: SupportChannel[] = [
  { icon: 'chat', title: 'Chat ao vivo', description: 'Fale com um agente em tempo real para resolver dúvidas rápidas.', availability: 'Seg–Sex, 9h–18h' },
  { icon: 'mail', title: 'E-mail', description: 'Abra um chamado e receba uma resposta detalhada no prazo de 1 dia útil.', availability: 'Respondido em até 24h' },
  { icon: 'help_center', title: 'Central de Ajuda', description: 'Consulte artigos e tutoriais antes de abrir um chamado.', availability: 'Disponível 24h' },
];

const SUBJECT_OPTIONS = [
  'Problema técnico',
  'Dúvida sobre conta',
  'Conteúdo e publicações',
  'Faturamento e campanhas',
  'Privacidade e dados',
  'Outro',
];

type FormStatus = 'idle' | 'submitting' | 'success';

@Component({
  selector: 'app-hire-support-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent, ButtonComponent],
  styleUrl: './hire-support-menu.component.scss',
  template: `
    <div class="hire-support">

      <header class="hire-support__hero">
        <span class="material-symbols-rounded hire-support__hero-icon" aria-hidden="true">support_agent</span>
        <h1 class="hire-support__hero-title">Contratar Suporte</h1>
        <p class="hire-support__hero-description">
          Abra um chamado ou inicie um chat ao vivo para resolver dúvidas
          específicas ou reportar incidentes na plataforma.
        </p>
      </header>

      <section class="hire-support__channels" aria-labelledby="channels-heading">
        <h2 id="channels-heading" class="hire-support__section-title">Canais disponíveis</h2>
        <ul class="hire-support__channel-list" role="list">
          @for (channel of channels; track channel.title) {
            <li class="hire-support__channel-item">
              <span class="material-symbols-rounded hire-support__channel-icon" aria-hidden="true">{{ channel.icon }}</span>
              <div class="hire-support__channel-body">
                <strong class="hire-support__channel-title">{{ channel.title }}</strong>
                <span class="hire-support__channel-description">{{ channel.description }}</span>
                <span class="hire-support__channel-availability">
                  <span class="material-symbols-rounded" aria-hidden="true">schedule</span>
                  {{ channel.availability }}
                </span>
              </div>
            </li>
          }
        </ul>
      </section>

      <section class="hire-support__form-section" aria-labelledby="form-heading">
        <h2 id="form-heading" class="hire-support__section-title">Abrir chamado</h2>

        @if (formStatus() === 'success') {
          <div class="hire-support__success" role="alert">
            <span class="material-symbols-rounded hire-support__success-icon" aria-hidden="true">check_circle</span>
            <strong class="hire-support__success-title">Chamado aberto com sucesso!</strong>
            <p class="hire-support__success-text">
              Nossa equipe entrará em contato em até 1 dia útil no e-mail informado.
            </p>
            <app-button variant="outline" (clicked)="resetForm()">Abrir novo chamado</app-button>
          </div>
        } @else {
          <form class="hire-support__form" (ngSubmit)="onSubmit()" novalidate>
            <div class="hire-support__form-row hire-support__form-row--2col">
              <app-input
                label="Nome completo"
                placeholder="Seu nome"
                [(ngModel)]="name"
                name="name"
                [errorMessage]="submitted() && !name ? 'Informe seu nome' : ''"
              />
              <app-input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                [(ngModel)]="email"
                name="email"
                [errorMessage]="submitted() && !email ? 'Informe seu e-mail' : ''"
              />
            </div>

            <div class="hire-support__field">
              <label class="hire-support__label" for="subject">Assunto</label>
              <select
                id="subject"
                class="hire-support__select"
                [(ngModel)]="subject"
                name="subject"
                [class.hire-support__select--error]="submitted() && !subject"
              >
                <option value="" disabled selected>Selecione um assunto</option>
                @for (option of subjectOptions; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
              @if (submitted() && !subject) {
                <p class="hire-support__field-error" role="alert">Selecione um assunto</p>
              }
            </div>

            <div class="hire-support__field">
              <label class="hire-support__label" for="message">Mensagem</label>
              <textarea
                id="message"
                class="hire-support__textarea"
                placeholder="Descreva o problema ou dúvida em detalhes..."
                [(ngModel)]="message"
                name="message"
                rows="5"
                [class.hire-support__textarea--error]="submitted() && !message"
              ></textarea>
              @if (submitted() && !message) {
                <p class="hire-support__field-error" role="alert">Descreva o problema</p>
              }
            </div>

            <app-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [loading]="formStatus() === 'submitting'"
              icon="send"
            >
              Enviar chamado
            </app-button>
          </form>
        }
      </section>

    </div>
  `,
})
export class HireSupportMenuComponent {
  readonly channels = SUPPORT_CHANNELS;
  readonly subjectOptions = SUBJECT_OPTIONS;

  name = '';
  email = '';
  subject = '';
  message = '';

  readonly submitted = signal(false);
  readonly formStatus = signal<FormStatus>('idle');

  readonly isFormValid = computed(
    () => !!this.name && !!this.email && !!this.subject && !!this.message,
  );

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.isFormValid()) return;
    this.formStatus.set('submitting');
    setTimeout(() => this.formStatus.set('success'), 1200);
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
    this.submitted.set(false);
    this.formStatus.set('idle');
  }
}
