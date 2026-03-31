import { Component, ChangeDetectionStrategy } from '@angular/core';

const FUNNEL_STAGES = [
  { icon: 'play_circle', title: 'Descoberta', description: 'Vídeos curtos criados por colaboradores reais revelam o dia a dia das empresas.' },
  { icon: 'menu_book', title: 'Profundidade', description: 'Conteúdos detalhados aprofundam temas, construindo autoridade e confiança.' },
  { icon: 'ads_click', title: 'Conversão', description: 'Botões "Saiba Mais" conectam você a vagas, produtos e treinamentos.' },
  { icon: 'groups', title: 'Comunidade', description: 'Interações, perguntas e trocas de experiência entre pessoas reais.' },
];

const CONTENT_TYPES = [
  { icon: 'apartment', label: 'Empresas' },
  { icon: 'work', label: 'Vagas' },
  { icon: 'school', label: 'Treinamentos' },
  { icon: 'inventory_2', label: 'Produtos e Serviços' },
  { icon: 'newspaper', label: 'Notícias e Tendências' },
];

const AUDIENCES = [
  { icon: 'person_search', label: 'Pessoas buscando emprego' },
  { icon: 'auto_stories', label: 'Profissionais que querem aprender' },
  { icon: 'school', label: 'Estudantes' },
  { icon: 'rate_review', label: 'Quem avalia empresas' },
  { icon: 'shopping_bag', label: 'Quem busca produtos ou serviços' },
];

@Component({
  selector: 'app-about-realwe-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about-realwe-menu.component.scss',
  template: `
    <div class="about-realwe">

      <header class="about-realwe__hero">
        <span class="material-symbols-rounded about-realwe__hero-icon" aria-hidden="true">sentiment_satisfied</span>
        <h1 class="about-realwe__hero-title">Sobre o RealWe</h1>
        <p class="about-realwe__hero-tagline">Pessoas confiam em pessoas.</p>
        <p class="about-realwe__hero-description">
          Uma plataforma onde empresas mostram como realmente trabalham,
          através de conteúdos criados pelos próprios colaboradores.
        </p>
      </header>

      <section class="about-realwe__section" aria-labelledby="mission-heading">
        <h2 id="mission-heading" class="about-realwe__section-title">Nossa missão</h2>
        <p class="about-realwe__section-text">
          Aproximar pessoas, empresas e conhecimento real do mercado.
          Na RealWe, a transparência não é um diferencial — é o fundamento.
          Cada conteúdo é criado por quem vive a rotina, não por quem a descreve de fora.
        </p>
      </section>

      <section class="about-realwe__section" aria-labelledby="funnel-heading">
        <h2 id="funnel-heading" class="about-realwe__section-title">Como funciona</h2>
        <ul class="about-realwe__funnel" role="list">
          @for (stage of stages; track stage.title) {
            <li class="about-realwe__funnel-item">
              <span class="material-symbols-rounded about-realwe__funnel-icon" aria-hidden="true">{{ stage.icon }}</span>
              <div class="about-realwe__funnel-body">
                <strong class="about-realwe__funnel-title">{{ stage.title }}</strong>
                <span class="about-realwe__funnel-description">{{ stage.description }}</span>
              </div>
            </li>
          }
        </ul>
      </section>

      <section class="about-realwe__section" aria-labelledby="content-heading">
        <h2 id="content-heading" class="about-realwe__section-title">O que você encontra</h2>
        <ul class="about-realwe__tags" role="list">
          @for (type of contentTypes; track type.label) {
            <li class="about-realwe__tag">
              <span class="material-symbols-rounded about-realwe__tag-icon" aria-hidden="true">{{ type.icon }}</span>
              {{ type.label }}
            </li>
          }
        </ul>
      </section>

      <section class="about-realwe__section" aria-labelledby="audience-heading">
        <h2 id="audience-heading" class="about-realwe__section-title">Para quem é</h2>
        <ul class="about-realwe__audience" role="list">
          @for (item of audiences; track item.label) {
            <li class="about-realwe__audience-item">
              <span class="material-symbols-rounded about-realwe__audience-icon" aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </li>
          }
        </ul>
      </section>

    </div>
  `,
})
export class AboutRealweMenuComponent {
  readonly stages = FUNNEL_STAGES;
  readonly contentTypes = CONTENT_TYPES;
  readonly audiences = AUDIENCES;
}
