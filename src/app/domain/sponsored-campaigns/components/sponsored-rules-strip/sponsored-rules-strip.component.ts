import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { SponsoredRule } from '@shared/interfaces/entity/sponsored-campaigns';

const TYPE_LABELS: Record<string, string> = {
  do: 'Faça',
  dont: 'Não faça',
  policy: 'Política',
};

const TYPE_ICONS: Record<string, string> = {
  do: 'check_circle',
  dont: 'block',
  policy: 'gavel',
};

@Component({
  selector: 'app-sponsored-rules-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="sponsored-rules" aria-labelledby="sponsored-rules-title">
      <header class="sponsored-rules__head">
        <h2 class="sponsored-rules__title" id="sponsored-rules-title">Regras do produto</h2>
        <p class="sponsored-rules__subtitle">
          Conteúdo pago nunca pode quebrar o funil de qualidade.
        </p>
      </header>

      <ul class="sponsored-rules__list" role="list">
        @for (rule of rules(); track rule.id) {
          <li class="sponsored-rules__item" [class]="'type-' + rule.type">
            <span class="material-symbols-rounded sponsored-rules__icon" aria-hidden="true">
              {{ iconFor(rule.type) }}
            </span>
            <div class="sponsored-rules__body">
              <span class="sponsored-rules__tag">{{ labelFor(rule.type) }}</span>
              <p class="sponsored-rules__text">{{ rule.text }}</p>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './sponsored-rules-strip.component.scss',
})
export class SponsoredRulesStripComponent {
  readonly rules = input.required<SponsoredRule[]>();

  iconFor(type: string): string {
    return TYPE_ICONS[type] ?? TYPE_ICONS['policy'];
  }

  labelFor(type: string): string {
    return TYPE_LABELS[type] ?? TYPE_LABELS['policy'];
  }
}
