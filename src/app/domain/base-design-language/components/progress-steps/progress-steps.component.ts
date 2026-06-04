import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export interface StepItem { title: string; description?: string; }

/** ProgressSteps — fiel ao baseui/progress-steps (passos numerados, atual destacado). */
@Component({
  selector: 'bui-progress-steps',
  exportAs: 'buiProgressSteps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ol class="bui-ps">
      @for (s of steps(); track $index; let i = $index) {
        <li class="bui-ps__step" [attr.data-state]="i < current() ? 'done' : i === current() ? 'current' : 'todo'">
          <div class="bui-ps__icon">@if (i < current()) {<span class="material-symbols-rounded">check</span>} @else {{{ i + 1 }}}</div>
          <div class="bui-ps__body">
            <div class="bui-ps__title">{{ s.title }}</div>
            @if (s.description) { <div class="bui-ps__desc">{{ s.description }}</div> }
          </div>
        </li>
      }
    </ol>
  `,
  styles: `
    .bui-ps { list-style:none; margin:0; padding:0; }
    .bui-ps__step { display:flex; gap:var(--bw-sizing-scale500); padding-bottom:var(--bw-sizing-scale700); position:relative; }
    .bui-ps__step:not(:last-child)::before { content:''; position:absolute; left:15px; top:32px; bottom:0; width:2px; background:var(--bw-border-opaque); }
    .bui-ps__icon { display:flex; align-items:center; justify-content:center; width:32px; height:32px; flex-shrink:0; border-radius:50%; font:var(--bw-font-LabelSmall); background:var(--bw-background-tertiary); color:var(--bw-content-secondary); z-index:1; }
    .bui-ps__icon span { font-size:18px; }
    .bui-ps__step[data-state="done"] .bui-ps__icon { background:var(--bw-content-positive); color:var(--bw-content-on-color); }
    .bui-ps__step[data-state="current"] .bui-ps__icon { background:var(--bw-content-primary); color:var(--bw-content-inverse-primary); }
    .bui-ps__title { font:var(--bw-font-LabelMedium); color:var(--bw-content-primary); }
    .bui-ps__desc { font:var(--bw-font-ParagraphSmall); color:var(--bw-content-secondary); }
    .bui-ps__step[data-state="todo"] .bui-ps__title { color:var(--bw-content-tertiary); }
  `,
})
export class ProgressSteps {
  readonly steps = input.required<StepItem[]>();
  readonly current = input<number>(0);
}

@Component({
  selector: 'bui-s-progress-steps', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [ProgressSteps],
  template: `<div style="width:360px;"><bui-progress-steps [current]="1" [steps]="steps" /></div>`,
})
export class ProgressStepsScenario {
  protected readonly steps: StepItem[] = [
    { title: 'Create account', description: 'Dados básicos' },
    { title: 'Verify email', description: 'Confirme o e-mail' },
    { title: 'Done', description: 'Tudo pronto' },
  ];
}

/** Stepper — indicador horizontal de passos (numerado + conector). */
@Component({
  selector: 'bui-stepper',
  exportAs: 'buiStepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-stp">
      @for (s of steps(); track $index; let i = $index; let last = $last) {
        <div class="bui-stp__step" [attr.data-state]="i < current() ? 'done' : i === current() ? 'current' : 'todo'">
          <div class="bui-stp__dot">@if (i < current()) {<span class="material-symbols-rounded">check</span>} @else {{{ i + 1 }}}</div>
          <span class="bui-stp__label">{{ s }}</span>
        </div>
        @if (!last) { <div class="bui-stp__line"></div> }
      }
    </div>
  `,
  styles: `
    .bui-stp { display:flex; align-items:center; }
    .bui-stp__step { display:flex; align-items:center; gap:var(--bw-sizing-scale300); }
    .bui-stp__dot { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; font:var(--bw-font-LabelSmall); background:var(--bw-background-tertiary); color:var(--bw-content-secondary); }
    .bui-stp__dot span { font-size:16px; }
    .bui-stp__step[data-state="done"] .bui-stp__dot { background:var(--bw-content-positive); color:var(--bw-content-on-color); }
    .bui-stp__step[data-state="current"] .bui-stp__dot { background:var(--bw-content-primary); color:var(--bw-content-inverse-primary); }
    .bui-stp__label { font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); }
    .bui-stp__line { flex:1; height:2px; min-width:24px; margin:0 var(--bw-sizing-scale400); background:var(--bw-border-opaque); }
  `,
})
export class Stepper {
  readonly steps = input.required<string[]>();
  readonly current = input<number>(0);
}

@Component({
  selector: 'bui-s-stepper', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Stepper],
  template: `<div style="width:480px;"><bui-stepper [current]="1" [steps]="['Cart','Shipping','Payment','Review']" /></div>`,
})
export class StepperScenario {}
