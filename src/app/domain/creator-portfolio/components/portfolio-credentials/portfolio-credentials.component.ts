import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LanguageProficiency } from '@shared/enums/language-proficiency.enum';
import {
  Certification,
  Education,
  Language,
} from '@shared/interfaces/entity/creator-portfolio';

const PROFICIENCY_LABELS: Record<LanguageProficiency, string> = {
  [LanguageProficiency.Basic]: 'Básico',
  [LanguageProficiency.Intermediate]: 'Intermediário',
  [LanguageProficiency.Advanced]: 'Avançado',
  [LanguageProficiency.Fluent]: 'Fluente',
  [LanguageProficiency.Native]: 'Nativo',
};

@Component({
  selector: 'app-portfolio-credentials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe],
  template: `
    <section class="portfolio-credentials" aria-labelledby="credentials-title">
      <header class="portfolio-credentials__head">
        <h2 id="credentials-title" class="portfolio-credentials__title">Credenciais</h2>
      </header>

      @if (isAllEmpty()) {
        <p class="portfolio-credentials__empty">Sem credenciais publicadas.</p>
      } @else {
        @if (skills().length > 0) {
          <div class="portfolio-credentials__section">
            <h3 class="portfolio-credentials__section-title">Habilidades</h3>
            <ul class="portfolio-credentials__chips" role="list">
              @for (skill of skills(); track skill) {
                <li class="portfolio-credentials__chip">{{ skill }}</li>
              }
            </ul>
          </div>
        }

        @if (languages().length > 0) {
          <div class="portfolio-credentials__section">
            <h3 class="portfolio-credentials__section-title">Idiomas</h3>
            <ul class="portfolio-credentials__rows" role="list">
              @for (lang of languages(); track lang.id) {
                <li class="portfolio-credentials__row">
                  <span class="portfolio-credentials__row-label">{{ lang.name }}</span>
                  <span class="portfolio-credentials__row-value">{{ proficiencyLabel(lang) }}</span>
                </li>
              }
            </ul>
          </div>
        }

        @if (educations().length > 0) {
          <div class="portfolio-credentials__section">
            <h3 class="portfolio-credentials__section-title">Formação</h3>
            <ul class="portfolio-credentials__entries" role="list">
              @for (edu of educations(); track edu.id) {
                <li class="portfolio-credentials__entry">
                  <span class="portfolio-credentials__entry-title">{{ edu.course }}</span>
                  <span class="portfolio-credentials__entry-sub">
                    {{ edu.institutionName }}
                    <span class="portfolio-credentials__entry-dot" aria-hidden="true">·</span>
                    {{ edu.startDate | date: 'yyyy' }} —
                    @if (edu.endDate) {
                      {{ edu.endDate | date: 'yyyy' }}
                    } @else {
                      em curso
                    }
                  </span>
                </li>
              }
            </ul>
          </div>
        }

        @if (certifications().length > 0) {
          <div class="portfolio-credentials__section">
            <h3 class="portfolio-credentials__section-title">Certificações</h3>
            <ul class="portfolio-credentials__entries" role="list">
              @for (cert of certifications(); track cert.id) {
                <li class="portfolio-credentials__entry portfolio-credentials__entry--with-link">
                  <div class="portfolio-credentials__entry-main">
                    <span class="portfolio-credentials__entry-title">{{ cert.name }}</span>
                    <span class="portfolio-credentials__entry-sub">
                      {{ cert.issuerName }}
                      <span class="portfolio-credentials__entry-dot" aria-hidden="true">·</span>
                      {{ cert.issuedAt | date: 'MMM yyyy' }}
                    </span>
                  </div>
                  @if (cert.credentialUrl) {
                    <a
                      class="portfolio-credentials__entry-link"
                      [href]="cert.credentialUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver credencial
                    </a>
                  }
                </li>
              }
            </ul>
          </div>
        }
      }
    </section>
  `,
  styleUrl: './portfolio-credentials.component.scss',
})
export class PortfolioCredentialsComponent {
  readonly skills = input<string[]>([]);
  readonly languages = input<Language[]>([]);
  readonly educations = input<Education[]>([]);
  readonly certifications = input<Certification[]>([]);

  readonly isAllEmpty = computed(
    () =>
      this.skills().length === 0 &&
      this.languages().length === 0 &&
      this.educations().length === 0 &&
      this.certifications().length === 0,
  );

  proficiencyLabel(lang: Language): string {
    return PROFICIENCY_LABELS[lang.proficiency] ?? '';
  }
}
