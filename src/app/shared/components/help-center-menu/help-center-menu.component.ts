import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
}

interface HelpCategory {
  id: string;
  icon: string;
  title: string;
  articles: HelpArticle[];
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'account',
    icon: 'manage_accounts',
    title: 'Conta e Perfil',
    articles: [
      { id: 'create-account', title: 'Como criar uma conta na RealWe', excerpt: 'Aprenda o passo a passo para criar seu perfil e começar a explorar conteúdos profissionais.' },
      { id: 'edit-profile', title: 'Como editar suas informações de perfil', excerpt: 'Atualize seu nome, foto, experiências profissionais e informações de contato.' },
      { id: 'recover-password', title: 'Recuperar senha esquecida', excerpt: 'Veja como redefinir sua senha via e-mail de forma rápida e segura.' },
    ],
  },
  {
    id: 'content',
    icon: 'video_library',
    title: 'Conteúdo e Publicações',
    articles: [
      { id: 'publish-video', title: 'Como publicar um vídeo como colaborador', excerpt: 'Entenda os requisitos e o fluxo para publicar conteúdo autêntico representando sua empresa.' },
      { id: 'content-types', title: 'Tipos de conteúdo aceitos na plataforma', excerpt: 'Conheça os formatos disponíveis: vídeos curtos, vídeos longos e materiais complementares.' },
      { id: 'content-moderation', title: 'Como funciona a moderação de conteúdo', excerpt: 'Saiba quais critérios são avaliados antes da publicação e como apelar de uma recusa.' },
    ],
  },
  {
    id: 'discovery',
    icon: 'explore',
    title: 'Descoberta e Busca',
    articles: [
      { id: 'search-content', title: 'Como pesquisar conteúdos e empresas', excerpt: 'Use filtros por catálogo, área de atuação, nível de experiência e muito mais.' },
      { id: 'recommendations', title: 'Como funcionam as recomendações', excerpt: 'A RealWe sugere conteúdos com base nas suas interações e áreas de interesse.' },
      { id: 'sponsored', title: 'O que é conteúdo Patrocinado', excerpt: 'Entenda como os conteúdos promovidos são identificados e os critérios de elegibilidade.' },
    ],
  },
  {
    id: 'community',
    icon: 'groups',
    title: 'Comunidade e Interações',
    articles: [
      { id: 'comments', title: 'Como comentar e interagir com conteúdos', excerpt: 'Descubra como participar das discussões e construir relacionamentos profissionais.' },
      { id: 'community-levels', title: 'Níveis da comunidade: visitante, interessado e insider', excerpt: 'Entenda como evoluir de visitante a insider e os benefícios de cada nível.' },
    ],
  },
  {
    id: 'companies',
    icon: 'apartment',
    title: 'Empresas e Campanhas',
    articles: [
      { id: 'company-channel', title: 'Como criar um canal para sua empresa', excerpt: 'Configure o canal da sua empresa, adicione colaboradores e comece a publicar.' },
      { id: 'sponsored-campaign', title: 'Como contratar uma campanha patrocinada', excerpt: 'Veja os requisitos de elegibilidade, modelos de cobrança e como impulsionar seu conteúdo.' },
    ],
  },
  {
    id: 'privacy',
    icon: 'privacy_tip',
    title: 'Privacidade e Segurança',
    articles: [
      { id: 'data-rights', title: 'Seus direitos sobre seus dados (LGPD)', excerpt: 'Como acessar, corrigir, exportar ou excluir seus dados pessoais da plataforma.' },
      { id: 'account-security', title: 'Como proteger sua conta', excerpt: 'Dicas de segurança, gerenciamento de dispositivos conectados e encerramento de sessões.' },
    ],
  },
];

@Component({
  selector: 'app-help-center-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: './help-center-menu.component.scss',
  template: `
    <div class="help-center">

      <header class="help-center__hero">
        <span class="material-symbols-rounded help-center__hero-icon" aria-hidden="true">contact_support</span>
        <h1 class="help-center__hero-title">Central de Ajuda</h1>
        <p class="help-center__hero-description">
          Encontre respostas rápidas sobre como usar a plataforma, publicar
          conteúdos, gerenciar sua conta e muito mais.
        </p>

        <div class="help-center__search">
          <label class="help-center__search-label" for="help-search">
            <span class="material-symbols-rounded help-center__search-icon" aria-hidden="true">search</span>
          </label>
          <input
            id="help-search"
            class="help-center__search-input"
            type="search"
            placeholder="Buscar artigos de ajuda..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            [attr.aria-label]="'Buscar artigos de ajuda'"
          />
          @if (searchQuery) {
            <button
              class="help-center__search-clear"
              type="button"
              aria-label="Limpar busca"
              (click)="clearSearch()"
            >
              <span class="material-symbols-rounded" aria-hidden="true">close</span>
            </button>
          }
        </div>
      </header>

      @if (searchQuery && filteredResults().length === 0) {
        <div class="help-center__empty" role="status">
          <span class="material-symbols-rounded help-center__empty-icon" aria-hidden="true">search_off</span>
          <p class="help-center__empty-text">Nenhum artigo encontrado para <strong>"{{ searchQuery }}"</strong>.</p>
        </div>
      }

      @if (searchQuery && filteredResults().length > 0) {
        <section aria-labelledby="search-results-heading">
          <h2 id="search-results-heading" class="help-center__section-title">
            {{ filteredResults().length }} resultado{{ filteredResults().length !== 1 ? 's' : '' }} para "{{ searchQuery }}"
          </h2>
          <ul class="help-center__article-list" role="list">
            @for (article of filteredResults(); track article.id) {
              <li class="help-center__article-item">
                <button class="help-center__article-btn" type="button">
                  <div class="help-center__article-body">
                    <strong class="help-center__article-title">{{ article.title }}</strong>
                    <span class="help-center__article-excerpt">{{ article.excerpt }}</span>
                  </div>
                  <span class="material-symbols-rounded help-center__article-arrow" aria-hidden="true">chevron_right</span>
                </button>
              </li>
            }
          </ul>
        </section>
      }

      @if (!searchQuery) {
        <div class="help-center__categories">
          @for (category of categories; track category.id) {
            <section class="help-center__category" [attr.aria-labelledby]="'cat-' + category.id">
              <div class="help-center__category-header">
                <span class="material-symbols-rounded help-center__category-icon" aria-hidden="true">{{ category.icon }}</span>
                <h2 [id]="'cat-' + category.id" class="help-center__category-title">{{ category.title }}</h2>
              </div>
              <ul class="help-center__article-list" role="list">
                @for (article of category.articles; track article.id) {
                  <li class="help-center__article-item">
                    <button class="help-center__article-btn" type="button">
                      <div class="help-center__article-body">
                        <strong class="help-center__article-title">{{ article.title }}</strong>
                        <span class="help-center__article-excerpt">{{ article.excerpt }}</span>
                      </div>
                      <span class="material-symbols-rounded help-center__article-arrow" aria-hidden="true">chevron_right</span>
                    </button>
                  </li>
                }
              </ul>
            </section>
          }
        </div>
      }

    </div>
  `,
})
export class HelpCenterMenuComponent {
  readonly categories = HELP_CATEGORIES;

  searchQuery = '';

  readonly _query = signal('');

  readonly filteredResults = computed(() => {
    const q = this._query().toLowerCase().trim();
    if (!q) return [];
    const results: HelpArticle[] = [];
    for (const cat of HELP_CATEGORIES) {
      for (const article of cat.articles) {
        if (article.title.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q)) {
          results.push(article);
        }
      }
    }
    return results;
  });

  onSearch(value: string): void {
    this._query.set(value);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this._query.set('');
  }
}
