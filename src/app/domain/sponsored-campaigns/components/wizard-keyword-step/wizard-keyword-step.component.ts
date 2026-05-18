import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

const POPULAR_KEYWORDS = [
  'como fazer um doce',
  'engenheiro de software',
  'recrutamento ágil',
  'design system corporativo',
  'mentoria de carreira',
  'investimentos em fintech',
];

@Component({
  selector: 'app-wizard-keyword-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="wizard-keyword" aria-labelledby="wizard-keyword-title">
      <header class="wizard-keyword__head">
        <h2 class="wizard-keyword__title" id="wizard-keyword-title">
          Qual palavra-chave você quer dominar?
        </h2>
        <p class="wizard-keyword__subtitle">
          Sua campanha sobe para o slot único patrocinado quando alguém pesquisa por essa
          palavra-chave. Use o que faz sentido para o seu produto.
        </p>
      </header>

      <label class="wizard-keyword__field">
        <span class="wizard-keyword__label">Palavra-chave</span>
        <input
          type="text"
          class="wizard-keyword__input"
          [value]="value()"
          (input)="onInput($event)"
          placeholder="ex: como fazer um doce"
          name="keyword"
          autocomplete="off"
          autofocus
        />
        <span class="wizard-keyword__hint">
          Mínimo 3 caracteres. Você compra prioridade na busca por essa palavra durante os
          horários selecionados na próxima etapa.
        </span>
      </label>

      <div class="wizard-keyword__suggestions">
        <span class="wizard-keyword__suggestions-label">Populares agora</span>
        <ul class="wizard-keyword__chips" role="list">
          @for (suggestion of suggestions; track suggestion) {
            <li>
              <button
                type="button"
                class="wizard-keyword__chip"
                [class.is-selected]="suggestion === value()"
                (click)="valueChange.emit(suggestion)"
              >
                {{ suggestion }}
              </button>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './wizard-keyword-step.component.scss',
})
export class WizardKeywordStepComponent {
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  readonly suggestions = POPULAR_KEYWORDS;

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
