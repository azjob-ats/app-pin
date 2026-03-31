import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface PolicySection {
  id: string;
  icon: string;
  title: string;
  items: string[];
}

const TERMS_OF_USE: PolicySection[] = [
  { id: 'eligibility', icon: 'person_check', title: 'Elegibilidade', items: ['A plataforma é destinada a pessoas com 18 anos ou mais.', 'O uso está condicionado ao aceite destes Termos.', 'Contas criadas com informações falsas podem ser encerradas.'] },
  { id: 'account', icon: 'manage_accounts', title: 'Conta e responsabilidades', items: ['Você é responsável por manter a confidencialidade da sua senha.', 'Qualquer atividade realizada na sua conta é de sua responsabilidade.', 'Notifique-nos imediatamente em caso de uso não autorizado da conta.'] },
  { id: 'content', icon: 'video_library', title: 'Conteúdo publicado', items: ['Conteúdos devem ser verídicos, autênticos e relacionados à experiência profissional real.', 'É proibido publicar conteúdo ofensivo, discriminatório, enganoso ou que viole direitos de terceiros.', 'A RealWe se reserva o direito de remover conteúdos que violem estas diretrizes.', 'Ao publicar, você concede à RealWe licença não exclusiva para exibir e distribuir o conteúdo na plataforma.'] },
  { id: 'sponsored', icon: 'campaign', title: 'Conteúdo patrocinado', items: ['Campanhas patrocinadas são sempre identificadas como "Patrocinado".', 'Só é permitido impulsionar conteúdos que cumpram os critérios de qualidade e moderação.', 'A RealWe limita os slots patrocinados para preservar a qualidade da experiência.'] },
  { id: 'prohibited', icon: 'block', title: 'Condutas proibidas', items: ['Uso da plataforma para fins ilegais ou não autorizados.', 'Tentativas de manipular, hackear ou comprometer a segurança da plataforma.', 'Criação de múltiplas contas para burlar restrições.', 'Publicação de conteúdo sem a devida autorização da empresa representada.'] },
];

const PRIVACY_POLICY: PolicySection[] = [
  { id: 'data-collected', icon: 'database', title: 'Dados coletados', items: ['Informações de cadastro: nome, e-mail e dados profissionais.', 'Dados de uso: páginas visitadas, vídeos assistidos e interações.', 'Dados do dispositivo: tipo de dispositivo, sistema operacional e navegador.'] },
  { id: 'data-use', icon: 'analytics', title: 'Como usamos seus dados', items: ['Personalizar recomendações e a experiência na plataforma.', 'Analisar métricas de desempenho de conteúdos para criadores.', 'Melhorar funcionalidades e corrigir problemas técnicos.', 'Enviar comunicações relevantes, caso você tenha optado por recebê-las.'] },
  { id: 'data-sharing', icon: 'share', title: 'Compartilhamento de dados', items: ['Não vendemos seus dados pessoais a terceiros.', 'Dados podem ser compartilhados com empresas parceiras apenas quando necessário para a prestação do serviço.', 'Podemos divulgar informações quando exigido por lei ou ordem judicial.'] },
  { id: 'your-rights', icon: 'verified_user', title: 'Seus direitos (LGPD)', items: ['Acessar, corrigir ou excluir seus dados pessoais a qualquer momento.', 'Revogar o consentimento para o tratamento dos seus dados.', 'Solicitar portabilidade dos seus dados para outro serviço.', 'Ser informado sobre como seus dados são utilizados.'] },
  { id: 'cookies', icon: 'cookie', title: 'Cookies e rastreamento', items: ['Utilizamos cookies essenciais para o funcionamento da plataforma.', 'Cookies de análise nos ajudam a entender como a plataforma é usada.', 'Você pode gerenciar suas preferências de cookies nas configurações do navegador.'] },
];

type ActiveTab = 'terms' | 'privacy';

@Component({
  selector: 'app-terms-and-policies-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terms-and-policies-menu.component.scss',
  template: `
    <div class="terms">

      <header class="terms__hero">
        <span class="material-symbols-rounded terms__hero-icon" aria-hidden="true">contract</span>
        <h1 class="terms__hero-title">Termos e Políticas</h1>
        <p class="terms__hero-description">
          Leia nossos Termos de Uso, Política de Privacidade e as diretrizes que regem
          o uso da plataforma RealWe.
        </p>
        <p class="terms__hero-date">Última atualização: 31 de março de 2026</p>
      </header>

      <div class="terms__tabs" role="tablist" aria-label="Seções de Termos e Políticas">
        <button
          class="terms__tab"
          role="tab"
          [attr.aria-selected]="activeTab() === 'terms'"
          [class.terms__tab--active]="activeTab() === 'terms'"
          (click)="setTab('terms')"
        >
          <span class="material-symbols-rounded" aria-hidden="true">gavel</span>
          Termos de Uso
        </button>
        <button
          class="terms__tab"
          role="tab"
          [attr.aria-selected]="activeTab() === 'privacy'"
          [class.terms__tab--active]="activeTab() === 'privacy'"
          (click)="setTab('privacy')"
        >
          <span class="material-symbols-rounded" aria-hidden="true">privacy_tip</span>
          Privacidade
        </button>
      </div>

      @if (activeTab() === 'terms') {
        <div role="tabpanel" aria-label="Termos de Uso">
          <p class="terms__intro">
            Ao usar a RealWe, você concorda com os termos abaixo. Leia com atenção
            antes de utilizar a plataforma.
          </p>
          <ul class="terms__sections" role="list">
            @for (section of termsSections; track section.id) {
              <li class="terms__section">
                <div class="terms__section-header">
                  <span class="material-symbols-rounded terms__section-icon" aria-hidden="true">{{ section.icon }}</span>
                  <h2 class="terms__section-title">{{ section.title }}</h2>
                </div>
                <ul class="terms__items" role="list">
                  @for (item of section.items; track item) {
                    <li class="terms__item">
                      <span class="material-symbols-rounded terms__item-bullet" aria-hidden="true">fiber_manual_record</span>
                      {{ item }}
                    </li>
                  }
                </ul>
              </li>
            }
          </ul>
        </div>
      }

      @if (activeTab() === 'privacy') {
        <div role="tabpanel" aria-label="Política de Privacidade">
          <p class="terms__intro">
            A RealWe respeita sua privacidade e está comprometida com a proteção dos seus
            dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).
          </p>
          <ul class="terms__sections" role="list">
            @for (section of privacySections; track section.id) {
              <li class="terms__section">
                <div class="terms__section-header">
                  <span class="material-symbols-rounded terms__section-icon" aria-hidden="true">{{ section.icon }}</span>
                  <h2 class="terms__section-title">{{ section.title }}</h2>
                </div>
                <ul class="terms__items" role="list">
                  @for (item of section.items; track item) {
                    <li class="terms__item">
                      <span class="material-symbols-rounded terms__item-bullet" aria-hidden="true">fiber_manual_record</span>
                      {{ item }}
                    </li>
                  }
                </ul>
              </li>
            }
          </ul>
        </div>
      }

      <footer class="terms__footer">
        <p class="terms__footer-text">
          Dúvidas sobre nossos termos ou privacidade? Entre em contato pelo suporte da plataforma.
        </p>
      </footer>

    </div>
  `,
})
export class TermsAndPoliciesMenuComponent {
  readonly activeTab = signal<ActiveTab>('terms');
  readonly termsSections = TERMS_OF_USE;
  readonly privacySections = PRIVACY_POLICY;

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }
}
