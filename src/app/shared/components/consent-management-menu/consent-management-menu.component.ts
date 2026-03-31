import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

interface ConsentItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

type FormStatus = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'app-consent-management-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  styleUrl: './consent-management-menu.component.scss',
  template: `
    <div class="consent">

      <header class="consent__hero">
        <span class="material-symbols-rounded consent__hero-icon" aria-hidden="true">shield</span>
        <h1 class="consent__hero-title">Gerenciar consentimento</h1>
        <p class="consent__hero-description">
          Controle suas preferências sobre coleta e uso de dados pela plataforma RealWe,
          em conformidade com a LGPD (Lei nº 13.709/2018).
        </p>
      </header>

      <section class="consent__section" aria-labelledby="required-heading">
        <h2 id="required-heading" class="consent__section-title">Essenciais</h2>
        <p class="consent__section-subtitle">
          Necessários para o funcionamento da plataforma. Não podem ser desativados.
        </p>
        <ul class="consent__list" role="list">
          @for (item of requiredItems(); track item.id) {
            <li class="consent__item">
              <div class="consent__item-info">
                <span class="material-symbols-rounded consent__item-icon" aria-hidden="true">{{ item.icon }}</span>
                <div class="consent__item-body">
                  <strong class="consent__item-title">{{ item.title }}</strong>
                  <span class="consent__item-description">{{ item.description }}</span>
                </div>
              </div>
              <div class="consent__required-badge" aria-label="Obrigatório">
                <span class="material-symbols-rounded" aria-hidden="true">lock</span>
                Sempre ativo
              </div>
            </li>
          }
        </ul>
      </section>

      <section class="consent__section" aria-labelledby="optional-heading">
        <h2 id="optional-heading" class="consent__section-title">Opcionais</h2>
        <p class="consent__section-subtitle">
          Você pode ativar ou desativar a qualquer momento sem afetar o funcionamento básico da plataforma.
        </p>
        <ul class="consent__list" role="list">
          @for (item of optionalItems(); track item.id) {
            <li class="consent__item">
              <div class="consent__item-info">
                <span class="material-symbols-rounded consent__item-icon" aria-hidden="true">{{ item.icon }}</span>
                <div class="consent__item-body">
                  <strong class="consent__item-title">{{ item.title }}</strong>
                  <span class="consent__item-description">{{ item.description }}</span>
                </div>
              </div>
              <button
                class="consent__toggle"
                type="button"
                role="switch"
                [attr.aria-checked]="item.enabled"
                [attr.aria-label]="(item.enabled ? 'Desativar' : 'Ativar') + ' ' + item.title"
                [class.consent__toggle--on]="item.enabled"
                (click)="toggle(item.id)"
              >
                <span class="consent__toggle-thumb"></span>
              </button>
            </li>
          }
        </ul>
      </section>

      <section class="consent__rights" aria-labelledby="rights-heading">
        <h2 id="rights-heading" class="consent__rights-title">
          <span class="material-symbols-rounded" aria-hidden="true">verified_user</span>
          Seus direitos
        </h2>
        <ul class="consent__rights-list" role="list">
          <li class="consent__right">Solicitar acesso aos seus dados pessoais armazenados.</li>
          <li class="consent__right">Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li class="consent__right">Solicitar a exclusão dos dados tratados com seu consentimento.</li>
          <li class="consent__right">Revogar o consentimento a qualquer momento.</li>
          <li class="consent__right">Solicitar portabilidade dos dados para outro serviço.</li>
        </ul>
      </section>

      <div class="consent__actions">
        @if (formStatus() === 'saved') {
          <span class="consent__saved-badge" role="status">
            <span class="material-symbols-rounded" aria-hidden="true">check_circle</span>
            Preferências salvas
          </span>
        }
        <app-button
          variant="primary"
          [loading]="formStatus() === 'saving'"
          (clicked)="save()"
        >
          Salvar preferências
        </app-button>
      </div>

    </div>
  `,
})
export class ConsentManagementMenuComponent {
  readonly consentItems = signal<ConsentItem[]>([
    {
      id: 'essential_auth',
      icon: 'key',
      title: 'Autenticação e segurança',
      description: 'Dados necessários para manter sua sessão ativa e proteger sua conta contra acessos não autorizados.',
      required: true,
      enabled: true,
    },
    {
      id: 'essential_platform',
      icon: 'build',
      title: 'Funcionamento da plataforma',
      description: 'Dados técnicos mínimos para exibir conteúdos, processar ações e garantir a estabilidade dos serviços.',
      required: true,
      enabled: true,
    },
    {
      id: 'analytics',
      icon: 'analytics',
      title: 'Análise de uso',
      description: 'Coletamos dados anônimos sobre como você navega para melhorar funcionalidades e corrigir problemas.',
      required: false,
      enabled: true,
    },
    {
      id: 'personalization',
      icon: 'tune',
      title: 'Personalização',
      description: 'Usamos seu histórico de interações para recomendar conteúdos e empresas relevantes para você.',
      required: false,
      enabled: true,
    },
    {
      id: 'marketing',
      icon: 'campaign',
      title: 'Comunicações de marketing',
      description: 'Envio de e-mails com novidades, promoções e conteúdos selecionados com base no seu perfil.',
      required: false,
      enabled: false,
    },
    {
      id: 'third_party',
      icon: 'share',
      title: 'Compartilhamento com parceiros',
      description: 'Dados agregados e anonimizados podem ser compartilhados com parceiros para análise de mercado.',
      required: false,
      enabled: false,
    },
  ]);

  readonly formStatus = signal<FormStatus>('idle');

  readonly requiredItems = () => this.consentItems().filter((i) => i.required);
  readonly optionalItems = () => this.consentItems().filter((i) => !i.required);

  toggle(id: string): void {
    this.consentItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)),
    );
    this.formStatus.set('idle');
  }

  save(): void {
    this.formStatus.set('saving');
    setTimeout(() => this.formStatus.set('saved'), 1000);
  }
}
