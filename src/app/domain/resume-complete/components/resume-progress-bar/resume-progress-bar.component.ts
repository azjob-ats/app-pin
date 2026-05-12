import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

@Component({
  selector: 'app-resume-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="resume-progress" role="progressbar" [attr.aria-valuenow]="completed()" [attr.aria-valuemax]="total()">
      <div class="resume-progress__bar">
        <div class="resume-progress__fill" [style.width.%]="percent()"></div>
        <span class="resume-progress__count resume-progress__count--dark">
          {{ completed() }}/{{ total() }} trilhos
        </span>
        <span
          class="resume-progress__count resume-progress__count--light"
          [style.clip-path]="'inset(0 ' + (100 - percent()) + '% 0 0)'"
        >
          {{ completed() }}/{{ total() }} trilhos
        </span>
      </div>
    </div>
  `,
  styleUrl: './resume-progress-bar.component.scss',
})
export class ResumeProgressBarComponent {
  readonly completed = input.required<number>();
  readonly total = input.required<number>();

  readonly percent = computed(() => Math.round((this.completed() / this.total()) * 100));
}
