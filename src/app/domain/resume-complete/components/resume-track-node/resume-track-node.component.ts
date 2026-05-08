import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { TrackProgressStatus } from '@shared/enums/resume-track.enum';
import { TrackProgress } from '@shared/interfaces/entity/resume';
import { ResumeTrackDefinition } from '@domain/resume-complete/tokens/resume-tracks.config';

@Component({
  selector: 'app-resume-track-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      class="resume-track-node"
      [class.is-completed]="isCompleted()"
      [class.is-in-progress]="isInProgress()"
      [class.is-empty]="isEmpty()"
      [class.is-current]="isCurrent()"
      [attr.aria-label]="ariaLabel()"
      (click)="select.emit()"
    >
      <svg class="resume-track-node__ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="resume-track-node__ring-track" cx="50" cy="50" r="46" />
        <circle
          class="resume-track-node__ring-fill"
          cx="50"
          cy="50"
          r="46"
          [attr.stroke-dasharray]="289"
          [attr.stroke-dashoffset]="ringOffset()"
        />
      </svg>
      <span
        class="resume-track-node__circle"
        [style.background-color]="circleColor()"
      >
        <span class="material-symbols-rounded" aria-hidden="true">
          {{ isCompleted() ? 'check' : track().icon }}
        </span>
      </span>
      <span class="resume-track-node__label">
        <span class="resume-track-node__title">{{ track().title }}</span>
        <span class="resume-track-node__subtitle">{{ track().subtitle }}</span>
      </span>
    </button>
  `,
  styleUrl: './resume-track-node.component.scss',
})
export class ResumeTrackNodeComponent {
  readonly track = input.required<ResumeTrackDefinition>();
  readonly progress = input.required<TrackProgress>();
  readonly isCurrent = input<boolean>(false);

  readonly select = output<void>();

  readonly isCompleted = computed(() => this.progress().status === TrackProgressStatus.Completed);
  readonly isInProgress = computed(() => this.progress().status === TrackProgressStatus.InProgress);
  readonly isEmpty = computed(() => this.progress().status === TrackProgressStatus.Empty);

  readonly ringOffset = computed(() => 289 * (1 - this.progress().completion));

  readonly circleColor = computed(() => {
    if (this.isCompleted()) return '#22c55e';
    if (this.isEmpty()) return '#cbd5e1';
    return this.track().color;
  });

  readonly ariaLabel = computed(() => {
    const t = this.track();
    const status = this.isCompleted() ? 'concluído' : this.isInProgress() ? 'em andamento' : 'pendente';
    return `Trilho ${t.title}, ${t.subtitle}, ${status}`;
  });
}
