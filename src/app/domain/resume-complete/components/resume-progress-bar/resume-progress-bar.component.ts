import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { SavingState } from '@domain/resume-complete/services/resume-draft.store';

@Component({
  selector: 'app-resume-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="resume-progress" role="progressbar" [attr.aria-valuenow]="completed()" [attr.aria-valuemax]="total()">
      <div class="resume-progress__bar">
        <div class="resume-progress__fill" [style.width.%]="percent()"></div>
      </div>
      <div class="resume-progress__meta">
        <span class="resume-progress__count">{{ completed() }}/{{ total() }} trilhos</span>
        <span class="resume-progress__streak" aria-label="Streak">
          <span class="material-symbols-rounded icon-sm" aria-hidden="true">local_fire_department</span>
          {{ streak() }}
        </span>
        <span class="resume-progress__saving" [class]="'state-' + savingState()" aria-live="polite">
          @switch (savingState()) {
            @case ('saving') { Salvando… }
            @case ('saved') { Salvo }
            @case ('error') { Falha ao salvar }
            @default { Pronto }
          }
        </span>
      </div>
    </div>
  `,
  styleUrl: './resume-progress-bar.component.scss',
})
export class ResumeProgressBarComponent {
  readonly completed = input.required<number>();
  readonly total = input.required<number>();
  readonly streak = input<number>(1);
  readonly savingState = input<SavingState>('idle');

  readonly percent = computed(() => Math.round((this.completed() / this.total()) * 100));
}
