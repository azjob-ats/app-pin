import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { BuiCheck } from '../icon/icon.component';

export type StepOrientation = 'horizontal' | 'vertical';

/**
 * ProgressSteps — clone de `baseui/progress-steps`. `<ol>` com `li[buiStep]`/`li[buiNumberedStep]`
 * filhos (projetados → `<ol><li>` semântico limpo); `current` (índice ativo) define completed
 * (index<current) / active (index===current). Orientação vertical (default). DI. Nenhum token novo.
 */
@Component({
  selector: 'bui-progress-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './progress-steps.component.scss',
  template: `<ol class="bui-ps" [class.bui-ps--horizontal]="orientation() === 'horizontal'"><ng-content /></ol>`,
  host: { style: 'display:contents' },
})
export class BuiProgressSteps {
  readonly current = input<number>(0);
  readonly orientation = input<StepOrientation>('vertical');

  private readonly steps = contentChildren(BuiStep);
  private readonly numbered = contentChildren(BuiNumberedStep);
  readonly total = computed(() => this.steps().length + this.numbered().length);

  private idx = 0;
  register(): number {
    return this.idx++;
  }
}

/** Base comum: índice, estados derivados do `current`, orientação. */
@Directive()
abstract class StepBase {
  protected readonly group = inject(BuiProgressSteps);
  readonly title = input<string>('');
  readonly isActive = input<boolean | undefined, unknown>(undefined, {
    transform: (v) => (v === '' ? true : v == null ? undefined : booleanAttribute(v as boolean)),
  });
  readonly isCompleted = input<boolean | undefined, unknown>(undefined, {
    transform: (v) => (v === '' ? true : v == null ? undefined : booleanAttribute(v as boolean)),
  });
  readonly alwaysShowDescription = input(false, { transform: booleanAttribute });

  protected readonly index = this.group.register();
  protected readonly completed = computed(() => this.isCompleted() ?? this.index < this.group.current());
  protected readonly active = computed(() => this.isActive() ?? this.index === this.group.current());
  protected readonly isLast = computed(() => this.index === this.group.total() - 1);
  protected readonly horizontal = computed(() => this.group.orientation() === 'horizontal');
  protected readonly showDesc = computed(() => this.active() || this.alwaysShowDescription());

  protected readonly cls = computed(() =>
    [
      'bui-ps__step',
      this.horizontal() ? 'bui-ps__step--horizontal' : '',
      this.completed() ? 'bui-ps__step--completed' : '',
      this.active() ? 'bui-ps__step--active' : '',
      this.index === this.group.current() ? 'bui-ps__step--current' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}

/** Step (variante "dot") — círculo pequeno + tail + título/descrição. Host = `<li>`. */
@Component({
  selector: 'li[buiStep]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './progress-steps.component.scss',
  template: `
    <div class="bui-ps__icon-container">
      <div class="bui-ps__icon">@if (active()) {<div class="bui-ps__inner-icon"></div>}</div>
    </div>
    @if (!isLast()) {
      <div class="bui-ps__tail" aria-hidden="true"></div>
    }
    <div class="bui-ps__content">
      <div class="bui-ps__title">{{ title() }}</div>
      @if (showDesc()) {
        <div class="bui-ps__desc"><ng-content /></div>
      }
    </div>
  `,
  host: { '[class]': 'cls()' },
})
export class BuiStep extends StepBase {}

/** NumberedStep — círculo grande numerado (check ao concluir) + tail. Host = `<li>`. */
@Component({
  selector: 'li[buiNumberedStep]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCheck],
  styleUrl: './progress-steps.component.scss',
  template: `
    <div class="bui-ps__num-icon">
      @if (completed()) {
        <bui-check [size]="30" title="" />
      } @else {
        <span>{{ index + 1 }}</span>
      }
    </div>
    @if (!isLast()) {
      <div class="bui-ps__num-tail" aria-hidden="true"></div>
    }
    <div class="bui-ps__content">
      <div class="bui-ps__title">{{ title() }}</div>
      @if (showDesc()) {
        <div class="bui-ps__desc"><ng-content /></div>
      }
    </div>
  `,
  host: { '[class]': 'cls()' },
})
export class BuiNumberedStep extends StepBase {}
