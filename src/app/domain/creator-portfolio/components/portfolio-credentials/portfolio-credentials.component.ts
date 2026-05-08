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
    <section class="portfolio-credentials" aria-label="Habilidades, idiomas e formação">
      @if (skills().length > 0) {
        <div class="portfolio-credentials__block">
          <h3 class="portfolio-credentials__heading">Habilidades</h3>
          <ul class="portfolio-credentials__chips" role="list">
            @for (skill of skills(); track skill) {
              <li class="portfolio-credentials__chip">{{ skill }}</li>
            }
          </ul>
        </div>
      }

      @if (languages().length > 0) {
        <div class="portfolio-credentials__block">
          <h3 class="portfolio-credentials__heading">Idiomas</h3>
          <ul class="portfolio-credentials__chips" role="list">
            @for (lang of languages(); track lang.id) {
              <li class="portfolio-credentials__chip">
                {{ lang.name }} <span class="portfolio-credentials__muted">— {{ proficiencyLabel(lang) }}</span>
              </li>
            }
          </ul>
        </div>
      }

      @if (educations().length > 0) {
        <div class="portfolio-credentials__block">
          <h3 class="portfolio-credentials__heading">Formação</h3>
          <ul class="portfolio-credentials__list" role="list">
            @for (edu of educations(); track edu.id) {
              <li class="portfolio-credentials__row">
                <span class="material-symbols-rounded portfolio-credentials__row-icon" aria-hidden="true">school</span>
                <div>
                  <div class="portfolio-credentials__row-title">{{ edu.course }}</div>
                  <div class="portfolio-credentials__row-sub">
                    {{ edu.institutionName }} ·
                    {{ edu.startDate | date: 'yyyy' }}
                    —
                    @if (edu.endDate) {
                      {{ edu.endDate | date: 'yyyy' }}
                    } @else {
                      em curso
                    }
                  </div>
                </div>
              </li>
            }
          </ul>
        </div>
      }

      @if (certifications().length > 0) {
        <div class="portfolio-credentials__block">
          <h3 class="portfolio-credentials__heading">Certificações</h3>
          <ul class="portfolio-credentials__list" role="list">
            @for (cert of certifications(); track cert.id) {
              <li class="portfolio-credentials__row">
                <span class="material-symbols-rounded portfolio-credentials__row-icon" aria-hidden="true">workspace_premium</span>
                <div>
                  <div class="portfolio-credentials__row-title">{{ cert.name }}</div>
                  <div class="portfolio-credentials__row-sub">
                    {{ cert.issuerName }} · emitida em {{ cert.issuedAt | date: 'MMM yyyy' }}
                  </div>
                </div>
                @if (cert.credentialUrl) {
                  <a
                    class="portfolio-credentials__row-link"
                    [href]="cert.credentialUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver credencial"
                  >
                    <span class="material-symbols-rounded icon-sm" aria-hidden="true">open_in_new</span>
                  </a>
                }
              </li>
            }
          </ul>
        </div>
      }

      @if (isAllEmpty()) {
        <p class="portfolio-credentials__empty">Sem credenciais publicadas ainda.</p>
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
